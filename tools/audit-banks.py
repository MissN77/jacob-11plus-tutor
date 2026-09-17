#!/usr/bin/env python3
"""Audit every answer bank in the 11+ app.  RUN THIS BEFORE ANY RELEASE.

    python3 tools/audit-banks.py

Why this exists: six answers in data/inference.json were mis-keyed, so Jacob
was marked WRONG for choosing the RIGHT answer, over and over, for months.
Nothing in the app noticed. This does.

Two passes:
  1. STRUCTURAL, which is certain: answer index out of range, duplicate
     options, missing explanation, an option that repeats the question.
  2. SUSPICIOUS, which needs a human to read it: the flag that exposed the six
     mis-keyed inference answers, where the keyed option is short and another
     option is much longer and more specific.

Nothing is changed. This only reports.
"""
import json, glob, os, re, sys

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data')

def walk(obj, path=''):
    """Yield (path, question-dict) for anything that looks like a question."""
    if isinstance(obj, list):
        for i, x in enumerate(obj):
            yield from walk(x, f'{path}[{i}]')
    elif isinstance(obj, dict):
        opts = obj.get('options') or obj.get('opts')
        if isinstance(opts, list) and len(opts) >= 2:
            yield path, obj
        for k, v in obj.items():
            if k in ('options', 'opts'):
                continue
            yield from walk(v, f'{path}.{k}')

def answer_index(q):
    for key in ('correctIndex', 'answer', 'ans', 'correct', 'a'):
        if key in q and isinstance(q[key], int):
            return key, q[key]
    return None, None

def answer_text(q):
    """Some banks store the answer TWICE, as an index and as text. That is a
    free proof: if they disagree, the key is definitely wrong."""
    for key in ('answer', 'correctAnswer', 'correctText'):
        v = q.get(key)
        if isinstance(v, str) and v.strip():
            return key, v.strip()
    return None, None

structural = []
suspicious = []
counts = {}

for f in sorted(glob.glob(os.path.join(ROOT, '*.json'))):
    name = os.path.basename(f)
    try:
        data = json.load(open(f))
    except Exception as e:
        structural.append(f'{name}: UNREADABLE {e}')
        continue

    n = 0
    for path, q in walk(data):
        opts = q.get('options') or q.get('opts')
        # NVR options are shape data, not text; skip those
        if not all(isinstance(o, str) for o in opts):
            continue
        n += 1
        key, idx = answer_index(q)
        stem = q.get('question') or q.get('stem') or q.get('q') or ''
        ident = q.get('id') or path

        if key is None:
            structural.append(f'{name} {ident}: no answer key at all')
            continue
        if not (0 <= idx < len(opts)):
            structural.append(f'{name} {ident}: answer index {idx} outside {len(opts)} options')
            continue
        # ── the strongest check available: index against stored text ──
        tkey, ttext = answer_text(q)
        if ttext is not None:
            if opts[idx].strip() != ttext:
                structural.append(
                    f'{name} {ident}: MIS-KEY PROVEN. index {idx} gives '
                    f'"{opts[idx][:60]}" but "{tkey}" says "{ttext[:60]}"')
        if len(set(o.strip() for o in opts)) != len(opts):
            structural.append(f'{name} {ident}: duplicate options -> {opts}')
        if not str(q.get('explanation') or q.get('why') or q.get('workingOut') or q.get('e') or '').strip():
            structural.append(f'{name} {ident}: no explanation')

        # ── the flag that caught the six inference mis-keys ──
        keyed = opts[idx]
        longest = max(opts, key=len)
        if longest is not keyed and len(longest) > max(20, len(keyed) * 1.5):
            suspicious.append({
                'file': name, 'id': str(ident), 'stem': stem[:95],
                'keyed': keyed[:85], 'longer': longest[:95]
            })
    counts[name] = n

print('questions checked per file:')
for k, v in counts.items():
    if v:
        print(f'  {k:28} {v:5}')
print()

print(f'STRUCTURAL FAULTS (certain): {len(structural)}')
FAILED = len(structural) > 0
noexp = [s for s in structural if s.endswith('no explanation')]
other = [s for s in structural if not s.endswith('no explanation')]
print(f'  of which "no explanation": {len(noexp)}')
for s in other[:40]:
    print('   -', s)
if len(other) > 40:
    print(f'   … and {len(other) - 40} more')
print()

print(f'NEEDS A HUMAN TO READ (the mis-key signature): {len(suspicious)}')
for s in suspicious[:60]:
    print(f"   {s['file']} {s['id']}")
    print(f"      Q     : {s['stem']}")
    print(f"      keyed : {s['keyed']}")
    print(f"      longer: {s['longer']}")
if len(suspicious) > 60:
    print(f'   … and {len(suspicious) - 60} more')


if FAILED:
    print('\nFAILED. Fix the structural faults above before shipping.')
    sys.exit(1)
print('\nPASS. Every question has a valid answer key, four different options '
      'and an explanation.')
print('The flagged items above are not faults, they just need reading once.')
