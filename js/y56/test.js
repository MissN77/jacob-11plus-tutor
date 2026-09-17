// Structure and answer checks for the Year 5/6 generators.
//   node js/y56/test.js
require('./maths.js');
const { TOPICS } = globalThis.Y56_MATHS;

const RUNS = 4000;
const problems = [];
const distinct = {};

for (const t of TOPICS) {
  const texts = new Set();
  for (let i = 0; i < RUNS; i++) {
    let q;
    try { q = t.gen(); } catch (e) { problems.push(`${t.id}: threw ${e.message}`); break; }
    if (!q || !q.q || !String(q.q).trim()) problems.push(`${t.id}: empty question`);
    if (!Array.isArray(q.opts) || q.opts.length !== 4) problems.push(`${t.id}: ${q.opts && q.opts.length} options (${q.q})`);
    // compare TRIMMED, so an option padded with a space cannot hide as distinct
    else if (new Set(q.opts.map((o) => String(o).trim())).size !== 4) problems.push(`${t.id}: duplicate option "${q.q}" ${JSON.stringify(q.opts)}`);
    if (!(q.ans >= 0 && q.ans < 4)) problems.push(`${t.id}: answer index ${q.ans} (${q.q})`);
    if (!q.why) problems.push(`${t.id}: no explanation (${q.q})`);
    const blob = q.q + q.why + q.opts.join('');
    if (/NaN|undefined|Infinity/.test(blob)) problems.push(`${t.id}: bad value in "${q.q}"`);
    texts.add(q.q);
    if (problems.length > 20) break;
  }
  distinct[t.id] = texts.size;
  if (problems.length > 20) break;

  // teaching must be there, it is the whole point of the tier
  if (!t.rule || !Array.isArray(t.points) || t.points.length < 4) problems.push(`${t.id}: thin teaching`);
  if (!t.example || !t.example.q || !t.example.a || !Array.isArray(t.example.steps) || t.example.steps.length < 3) {
    problems.push(`${t.id}: thin worked example`);
  }
}

console.log('distinct questions in ' + RUNS + ' runs per topic:');
for (const [k, v] of Object.entries(distinct)) {
  console.log('  ' + k.padEnd(14) + String(v).padStart(5) + (v < 60 ? '   <-- THIN' : ''));
}

// ── Re-derive answers from the PRINTED question text ───────────────────────
const num = (s) => Number(String(s).replace(/[,£\s]/g, ''));
function solve(q) {
  const t = q.q.replace(/−/g, '-');
  let m;
  if ((m = t.match(/^([\d,]+) × (\d+) = \?$/))) return (num(m[1]) * +m[2]).toLocaleString('en-GB');
  if ((m = t.match(/^([\d,]+) ÷ (\d+) = \?$/))) return (num(m[1]) / +m[2]).toLocaleString('en-GB');
  if ((m = t.match(/^(\d+) \+ (\d+) × (\d+) = \?$/))) return String(+m[1] + +m[2] * +m[3]);
  if ((m = t.match(/^\((\d+) \+ (\d+)\) × (\d+) = \?$/))) return String((+m[1] + +m[2]) * +m[3]);
  if ((m = t.match(/^(\d+) - (\d+) × (\d+) = \?$/))) return String(+m[1] - +m[2] * +m[3]);
  if ((m = t.match(/^What is (\d+) squared\?$/))) return String(+m[1] * +m[1]);
  if ((m = t.match(/^What is the cube root of (\d+)\?$/))) return String(Math.round(Math.cbrt(+m[1])));
  if ((m = t.match(/^What is (\d+)\/(\d+) of (\d+)\?$/))) return String((+m[3] / +m[2]) * +m[1]);
  if ((m = t.match(/^What is (\d+)% of (\d+)\?$/))) return String((+m[2] * +m[1]) / 100);
  if ((m = t.match(/^What is (-?\d+) × (-?\d+)\?$/))) return String(+m[1] * +m[2]);
  if ((m = t.match(/^What is (-?\d+) - \((-?\d+)\)\?$/))) return String(+m[1] - +m[2]);
  if ((m = t.match(/difference between (-?\d+) and (-?\d+)\?$/))) return String(Math.abs(+m[2] - +m[1]));
  if ((m = t.match(/^Round ([\d,]+) to the nearest ([\d,]+)\.$/))) {
    const n = num(m[1]), to = num(m[2]);
    return (Math.round(n / to) * to).toLocaleString('en-GB');
  }
  if ((m = t.match(/^Round ([\d.]+) to (\d) decimal/))) return Number(m[1]).toFixed(+m[2]);
  if ((m = t.match(/angles of (\d+)° and (\d+)°.*third/))) return `${180 - +m[1] - +m[2]}°`;
  if ((m = t.match(/straight line\. One is (\d+)°/))) return `${180 - +m[1]}°`;
  if ((m = t.match(/base of (\d+) cm and a height of (\d+) cm.*triangle|triangle has a base of (\d+) cm and a height of (\d+) cm/))) {
    const b = +(m[1] || m[3]), h = +(m[2] || m[4]);
    return `${(b * h) / 2} cm²`;
  }
  if ((m = t.match(/cuboid is (\d+) cm by (\d+) cm by (\d+) cm/))) return `${+m[1] * +m[2] * +m[3]} cm³`;
  if ((m = t.match(/^(\d+)n \+ (\d+) = (\d+)\.  What is n\?$/))) return String((+m[3] - +m[2]) / +m[1]);
  if ((m = t.match(/If n = (\d+), what is (\d+)n - (\d+)\?$/))) return String(+m[2] * +m[1] - +m[3]);
  if ((m = t.match(/^Find the mean of ([\d, ]+)\.$/))) {
    const v = m[1].split(',').map(Number);
    return String(v.reduce((a, b) => a + b, 0) / v.length);
  }
  if ((m = t.match(/^What is the range of ([\d, ]+)\?$/))) {
    const v = m[1].split(',').map(Number);
    return String(Math.max(...v) - Math.min(...v));
  }
  if ((m = t.match(/^How many minutes are there in (\d+) hours and (\d+) minutes\?$/))) {
    return String(+m[1] * 60 + +m[2]);
  }
  if ((m = t.match(/^How many metres are the same as ([\d.]+) km\?$/))) {
    return `${Math.round(Number(m[1]) * 1000)} m`;
  }
  return null;
}

let checked = 0;
const wrong = [];
const unparsed = {};
for (const t of TOPICS) {
  for (let i = 0; i < 3000; i++) {
    const q = t.gen();
    const expected = solve(q);
    if (expected === null) { unparsed[t.id] = unparsed[t.id] || q.q; continue; }
    checked++;
    if (String(q.opts[q.ans]).trim() !== String(expected).trim()) {
      wrong.push(`${t.id}: "${q.q}" marked "${q.opts[q.ans]}" but the text gives "${expected}"`);
      if (wrong.length > 8) break;
    }
  }
  if (wrong.length > 8) break;
}

console.log(`\nre-derived ${checked} answers from the printed question text`);
if (wrong.length) { console.log('WRONG:'); wrong.forEach((w) => console.log(' -', w)); process.exit(1); }
if (problems.length) { console.log('\nPROBLEMS:'); problems.slice(0, 20).forEach((p) => console.log(' -', p)); process.exit(1); }
if (globalThis.__Y56_SYNTH) {
  console.log('\nA generator ran out of distinct wrong answers ' + globalThis.__Y56_SYNTH +
    ' times, last on: ' + globalThis.__Y56_SYNTH_Q);
  console.log('Give that generator more distractors rather than leaning on the fallback.');
  process.exit(1);
}
console.log('every one matched, and all ' + TOPICS.length + ' topics have a rule, 4 points and a worked example.');
console.log('no generator ever ran short of distinct wrong answers.');
console.log('\nnot machine-checkable, read by eye:');
for (const [k, v] of Object.entries(unparsed)) console.log('  ' + k.padEnd(14) + ' e.g. ' + v);
