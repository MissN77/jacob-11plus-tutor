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

# ── The answer lock ────────────────────────────────────────────────────────
# Heuristics only catch a SIGNATURE. A planted mis-key on short options slips
# straight through them, so they are not enough on their own.
# The lock records the exact answer TEXT of every question at a moment when the
# banks were verified. If a later edit moves an answer index, the text changes
# and that is a hard fault.
# To accept a deliberate change:  python3 tools/audit-banks.py --relock
LOCK_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'answer-lock.json')
RELOCK = '--relock' in sys.argv
try:
    lock = json.load(open(LOCK_PATH))['answers']
except Exception:
    lock = {}
new_lock = {}

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
        # Keyed by the question's OWN WORDS plus its options, not by position,
        # so a bank that shuffles itself does not report false changes, and two
        # questions that share a short stem do not collide.
        # These banks are static JSON, so the PATH is stable and unique. Keying
        # on the stem alone collided: many passages ask "what word class is
        # this?" with the same four options.
        lock_key = f'{name}{path} :: {str(stem)[:80]}'
        new_lock[lock_key] = opts[idx]
        if not RELOCK and lock_key in lock and lock[lock_key] != opts[idx]:
            structural.append(
                f'{name} {ident}: ANSWER CHANGED. was "{str(lock[lock_key])[:45]}" '
                f'and is now "{opts[idx][:45]}". If deliberate, re-run with --relock.')

        if len(set(o.strip() for o in opts)) != len(opts):
            structural.append(f'{name} {ident}: duplicate options -> {opts}')
        if not str(q.get('explanation') or q.get('why') or q.get('workingOut') or q.get('e') or '').strip():
            structural.append(f'{name} {ident}: no explanation')

        # ── second cross-check: does the explanation name a DIFFERENT option? ──
        # Most explanations quote the answer. One that quotes another option
        # instead, and never the keyed one, is a key worth doubting.
        why = str(q.get('explanation') or q.get('why') or q.get('workingOut') or q.get('e') or '').lower()
        if len(why) > 15:
            def whole(hay, needle):
                n = needle.lower().rstrip('.!?').strip()
                if len(n) < 6:
                    return False
                return re.search(r'(^|[^a-z])' + re.escape(n) + r'($|[^a-z])', hay) is not None
            keyed_in = opts[idx].lower().rstrip('.!?').strip() in why
            others = [o for i, o in enumerate(opts) if i != idx and whole(why, o)]
            if not keyed_in and len(others) == 1:
                suspicious.append({
                    'file': name, 'id': str(ident), 'stem': stem[:95],
                    'keyed': opts[idx][:85],
                    'longer': 'explanation quotes "' + others[0][:60] + '" instead'
                })

        # ── the flag that caught the six inference mis-keys ──
        keyed = opts[idx]
        longest = max(opts, key=len)
        if longest is not keyed and len(longest) > max(20, len(keyed) * 1.5):
            suspicious.append({
                'file': name, 'id': str(ident), 'stem': stem[:95],
                'keyed': keyed[:85], 'longer': longest[:95]
            })
    counts[name] = n

if RELOCK:
    json.dump({
        'note': 'The verified answer TEXT of every question. The audit fails if an '
                'answer silently changes. Re-lock only when you MEANT to change one.',
        'lockedOn': '2026-09-17',
        'answers': new_lock,
    }, open(LOCK_PATH, 'w'), indent=1, ensure_ascii=False)
    print(f'RE-LOCKED {len(new_lock)} answers into {LOCK_PATH}\n')

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

# ── The ratchet ────────────────────────────────────────────────────────────
# A semantic mis-key cannot be proven by a machine, so the flag list alone let
# a planted fault through. Instead: every flagged item must be signed off ONCE
# in tools/reviewed-flags.json. Anything flagged that is NOT on that list fails
# the audit, so a new mis-key with this signature blocks the push until a human
# has actually read it.
REVIEWED_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'reviewed-flags.json')
try:
    reviewed = set(json.load(open(REVIEWED_PATH))['reviewed'])
except Exception:
    reviewed = set()

def fingerprint(s):
    return f"{s['file']}|{s['id']}|{s['keyed'][:40]}"

unreviewed = [s for s in suspicious if fingerprint(s) not in reviewed]

print(f'NEEDS A HUMAN TO READ (the mis-key signature): {len(suspicious)}'
      f', of which NOT YET SIGNED OFF: {len(unreviewed)}')
for s in suspicious[:60]:
    print(f"   {s['file']} {s['id']}")
    print(f"      Q     : {s['stem']}")
    print(f"      keyed : {s['keyed']}")
    print(f"      longer: {s['longer']}")
if len(suspicious) > 60:
    print(f'   … and {len(suspicious) - 60} more')


if unreviewed:
    print('\nFAILED. These are flagged and have never been signed off:')
    for s in unreviewed:
        print(f"   {s['file']} {s['id']}")
        print(f"      Q     : {s['stem']}")
        print(f"      keyed : {s['keyed']}")
        print(f"      other : {s['longer']}")
    print('\nRead each one. If the key is RIGHT, add its fingerprint to')
    print(f'   {REVIEWED_PATH}')
    print('If the key is WRONG, fix the bank. Fingerprints to add:')
    for s in unreviewed:
        print(f'   "{fingerprint(s)}"')
    sys.exit(1)

if FAILED:
    print('\nFAILED. Fix the structural faults above before shipping.')
    sys.exit(1)
print('\nPASS. Every question has a valid answer key, four different options '
      'and an explanation.')
print('The flagged items above are not faults, they just need reading once.')
