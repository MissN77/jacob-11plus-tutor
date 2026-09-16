// ── MOCK TEST ────────────────────────────────────────────────────────────────
// A 30-minute mixed paper drawn ONLY from work Jacob has already covered:
// maths topics from the curriculum, word skills, letter reasoning, and the
// seven NVR types he has practised.
//
// Two things make this different from every other section:
//   1. It is locked behind a TEST CODE, so he can only sit it when Mum says.
//   2. There is NO feedback during the paper. Marks and explanations come at
//      the end, like a real exam.
//
// To change the test code: open Settings in the app, or run this in the
// browser console:  localStorage.setItem('j11_test_code', 'newcode')

import { Store } from '../store.js';
import { renderQArea, renderOpts } from '../nvr/renderers.js';
import { TYPES as NVR_TYPES } from '../nvr/questions.js';
import { renderChart } from './maths.js';

const SECTION_ID = 'mock-test';
const DEFAULT_CODE = 'testday';
const TEST_MINUTES = 30;

// The NVR types Jacob has actually practised. Codes, nets and hidden shapes
// are deliberately left out of the paper until he has met them.
const NVR_IN_PAPER = ['seq', 'ooo', 'ref', 'ana', 'mat', 'sim', 'fol'];

// The paper: how many questions come from where.
const BLUEPRINT = [
  { part: 'Maths', n: 10 },
  { part: 'Word skills', n: 10 },
  { part: 'Letter reasoning', n: 4 },
  { part: 'Non-verbal reasoning', n: 8 },
];
const TOTAL_Q = BLUEPRINT.reduce((a, b) => a + b.n, 0);

// ── Module state ─────────────────────────────────────────────────────────────
let paper = [];          // [{part, kind, q, ...}]
let answers = [];        // index chosen, or null
let current = 0;
let deadline = 0;
let ticker = null;
let finished = false;

// ── Helpers ──────────────────────────────────────────────────────────────────

function getTestCode() {
  return (localStorage.getItem('j11_test_code') || DEFAULT_CODE).trim().toLowerCase();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Take up to n items, never more than one from the same group. */
function spread(groups, n) {
  const out = [];
  const pools = shuffle(groups.filter((g) => g.items.length));
  let i = 0;
  while (out.length < n && pools.length) {
    const pool = pools[i % pools.length];
    if (pool.items.length) {
      const pick = pool.items.splice(Math.floor(Math.random() * pool.items.length), 1)[0];
      out.push({ group: pool.name, item: pick });
    }
    if (!pool.items.length) pools.splice(i % pools.length, 1);
    else i++;
    if (!pools.length) break;
  }
  return out;
}

function fmtClock(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// ── Building the paper ───────────────────────────────────────────────────────

async function buildPaper() {
  const [maths, words, verbal, nvr] = await Promise.all([
    fetch('data/maths-curriculum.json').then((r) => r.json()),
    fetch('data/word-skills.json').then((r) => r.json()),
    fetch('data/verbal-reasoning.json').then((r) => r.json()),
    fetch('data/nvr-questions.json').then((r) => r.json()),
  ]);

  const out = [];

  // Maths: at most one question per subtopic, so the paper spans the course.
  const mathsGroups = [];
  for (const strand of maths.strands) {
    for (const sub of strand.subtopics) {
      mathsGroups.push({ name: sub.name, items: [...(sub.practice || [])] });
    }
  }
  for (const { group, item } of spread(mathsGroups, 10)) {
    out.push({
      part: 'Maths', kind: 'mc', topic: group,
      stem: item.question, options: item.options,
      answer: item.correct, explain: item.workingOut,
      // Statistics questions carry their own bar chart, pictogram or table.
      chart: item.chart || null,
    });
  }

  // Word skills: spread across its categories.
  const wordGroups = Object.entries(words).map(([name, items]) => ({
    name: name.replace(/-/g, ' '), items: [...items],
  }));
  for (const { group, item } of spread(wordGroups, 10)) {
    out.push({
      part: 'Word skills', kind: 'mc', topic: group,
      stem: item.stem, options: item.options,
      answer: item.answer, explain: item.explanation || '',
    });
  }

  // Letter reasoning: the four types word skills does not cover.
  const letterTypes = ['letter-codes', 'letter-sequences', 'anagrams', 'hidden-words'];
  const letterGroups = (verbal.questionTypes || [])
    .filter((t) => letterTypes.includes(t.id))
    .map((t) => ({ name: t.title, items: [...(t.practiceQuestions || [])] }));
  for (const { group, item } of spread(letterGroups, 4)) {
    out.push({
      part: 'Letter reasoning', kind: 'mc', topic: group,
      stem: item.stem, options: item.options,
      answer: item.correct, explain: '',
    });
  }

  // NVR: only the types he has practised, drawn evenly.
  const nvrGroups = NVR_IN_PAPER
    .filter((id) => (nvr.questions[id] || []).length)
    .map((id) => ({
      name: (NVR_TYPES.find((t) => t.id === id) || {}).name || id,
      items: (nvr.questions[id] || []).map((q) => ({ ...q, _type: id })),
    }));
  for (const { group, item } of spread(nvrGroups, 8)) {
    out.push({
      part: 'Non-verbal reasoning', kind: 'nvr', topic: group,
      nvrType: item._type, q: item, explain: item.e || '',
    });
  }

  // Keep the parts in blueprint order so the paper reads like a real one.
  const order = BLUEPRINT.map((b) => b.part);
  out.sort((a, b) => order.indexOf(a.part) - order.indexOf(b.part));
  return out;
}

// ── Screens ──────────────────────────────────────────────────────────────────

function header(title, right) {
  return `
    <div class="quiz-header">
      <a class="quiz-back" href="#/" data-action="leave-test">←</a>
      <span class="quiz-title">${title}</span>
      ${right || ''}
    </div>`;
}

function renderCodeScreen(app, wrong) {
  app.innerHTML = `
    ${header('Mock Test')}
    <div class="section-home">
      <div class="section-home-icon">\u{1F512}</div>
      <h2>30 minute mock test</h2>
      <p>${TOTAL_Q} questions: maths, word skills, letter puzzles and non-verbal
         reasoning. You get your marks at the end, not as you go.</p>
      <p><strong>Ask Mum for the test code.</strong></p>
      <div style="max-width:320px;margin:16px auto;">
        <input id="test-code" type="text" inputmode="text" autocomplete="off"
               placeholder="Test code"
               style="width:100%;padding:12px 14px;font-size:16px;border:2px solid #D8D2C8;border-radius:10px;text-align:center;">
        ${wrong ? '<p style="color:#A8443A;font-weight:600;margin-top:8px;">That code is not right. Try again.</p>' : ''}
        <button class="btn btn-primary" data-action="check-code"
                style="width:100%;margin-top:12px;">Unlock the test</button>
      </div>
    </div>`;
  const input = document.getElementById('test-code');
  if (input) {
    input.focus();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        app.querySelector('[data-action="check-code"]').click();
      }
    });
  }
}

function renderBriefScreen(app) {
  const rows = BLUEPRINT.map((b) => `<li>${b.part}: ${b.n} questions</li>`).join('');
  app.innerHTML = `
    ${header('Mock Test')}
    <div class="section-home">
      <div class="section-home-icon">\u{1F4DD}</div>
      <h2>Before you start</h2>
      <div class="nvr-teach-card" style="text-align:left;">
        <h3>What is in the paper</h3>
        <ul>${rows}</ul>
        <h3>How it works</h3>
        <ul>
          <li>You have <strong>${TEST_MINUTES} minutes</strong> for ${TOTAL_Q} questions.
              That is about a minute each.</li>
          <li>Tap an answer, then tap Next. You can go back and change an answer.</li>
          <li>If a question is taking too long, tap Next and come back to it.</li>
          <li>The clock stops the paper when it reaches zero, so answer something
              for every question.</li>
        </ul>
      </div>
      <button class="btn btn-primary" data-action="begin-test">Start the clock</button>
    </div>`;
}

function renderQuestion(app) {
  const item = paper[current];
  const chosen = answers[current];
  const clock = `<span class="quiz-counter" id="test-clock">${fmtClock(deadline - Date.now())}</span>`;

  let body = '';
  if (item.kind === 'nvr') {
    // renderOpts reshuffles the options every time it is called, which would
    // move the right answer under an answer he had already chosen. Render the
    // options ONCE, keep the HTML, and keep where the answer landed.
    if (!item._optsHTML) {
      item._optsHTML = renderOpts(item.nvrType, item.q);
      item._answerIdx = item.q._shuffledAnswer !== undefined
        ? item.q._shuffledAnswer : item.q.a;
    }
    body = `
      <div class="nvr-question-area">${renderQArea(item.nvrType, item.q)}</div>
      <div class="nvr-options-grid">${item._optsHTML}</div>`;
  } else {
    const opts = item.options.map((o, i) => `
      <button class="opt${chosen === i ? ' opt-chosen' : ''}" data-action="answer" data-value="${i}"
              style="${chosen === i ? 'border-color:#1A8A7D;background:#E8F4F1;' : ''}">
        <div class="lbl">${'ABCD'[i]}</div>
        <div style="padding:8px;font-size:15px;">${escapeHTML(o)}</div>
      </button>`).join('');
    body = `
      <div class="nvr-question-area"
           style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:14px;">
        <div style="font-size:17px;font-weight:600;text-align:center;">${escapeHTML(item.stem)}</div>
        ${item.chart ? renderChart(item.chart) : ''}
      </div>
      <div class="nvr-options-grid">${opts}</div>`;
  }

  const answeredCount = answers.filter((a) => a !== null).length;

  app.innerHTML = `
    ${header('Mock Test', clock)}
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 14px;">
      <span style="font-size:13px;font-weight:700;color:#1A8A7D;text-transform:uppercase;">
        ${item.part}</span>
      <span style="font-size:13px;color:#8A8A8A;">Question ${current + 1} of ${TOTAL_Q}
        &middot; ${answeredCount} answered</span>
    </div>
    ${body}
    <div id="test-nav" style="display:flex;gap:10px;padding:14px;">
      <button class="btn btn-secondary" data-action="prev-q"
              ${current === 0 ? 'disabled' : ''} style="flex:1;">← Back</button>
      ${current === TOTAL_Q - 1
        ? '<button class="btn btn-primary" data-action="finish-test" style="flex:2;">Finish and see marks</button>'
        : '<button class="btn btn-primary" data-action="next-q" style="flex:2;">Next →</button>'}
    </div>`;

  if (item.kind === 'nvr') markChosen(app, chosen);
}

/** Paint the chosen option without re-rendering (which would reshuffle NVR). */
function markChosen(app, chosen) {
  app.querySelectorAll('.nvr-options-grid .opt').forEach((b, i) => {
    b.style.borderColor = i === chosen ? '#1A8A7D' : '';
    b.style.background = i === chosen ? '#E8F4F1' : '';
  });
}

function renderResults(app, ranOut) {
  const byPart = {};
  const wrong = [];
  let correct = 0;

  paper.forEach((item, i) => {
    const key = item.part;
    byPart[key] = byPart[key] || { correct: 0, total: 0 };
    byPart[key].total++;
    const answerIdx = item.kind === 'nvr' ? item._answerIdx : item.answer;
    if (answers[i] !== null && answers[i] === answerIdx) {
      correct++;
      byPart[key].correct++;
    } else {
      wrong.push({ n: i + 1, item, skipped: answers[i] === null });
    }
  });

  const pct = Math.round((correct / TOTAL_Q) * 100);
  const rows = Object.entries(byPart).map(([part, s]) => `
    <tr>
      <td style="padding:6px 10px;">${part}</td>
      <td style="padding:6px 10px;text-align:right;font-weight:700;">${s.correct}/${s.total}</td>
      <td style="padding:6px 10px;text-align:right;color:#8A8A8A;">
        ${Math.round((s.correct / s.total) * 100)}%</td>
    </tr>`).join('');

  const wrongList = wrong.map((w) => `
    <div class="nvr-teach-card" style="text-align:left;">
      <h3>Question ${w.n} &middot; ${w.item.part}${w.item.topic ? ' &middot; ' + escapeHTML(w.item.topic) : ''}</h3>
      ${w.item.kind === 'nvr'
        ? '<p>Non-verbal question. Open that NVR type to practise more of them.</p>'
        : `<p><strong>${escapeHTML(w.item.stem)}</strong></p>
           ${w.item.chart ? renderChart(w.item.chart) : ''}
           <p>The answer was <strong>${escapeHTML(w.item.options[w.item.answer])}</strong>.</p>`}
      ${w.skipped ? '<p style="color:#A8443A;">You did not answer this one.</p>' : ''}
      ${w.item.explain ? `<p>${w.item.explain}</p>` : ''}
    </div>`).join('');

  app.innerHTML = `
    ${header('Mock Test')}
    <div class="section-home">
      <div class="section-home-icon">${pct >= 80 ? '\u{1F31F}' : '\u{1F4CA}'}</div>
      <h2>${correct} out of ${TOTAL_Q}</h2>
      <p>${pct}%${ranOut ? ' &middot; the clock ran out' : ''}</p>
      <table style="margin:14px auto;border-collapse:collapse;min-width:280px;background:white;border-radius:12px;overflow:hidden;">
        ${rows}
      </table>
      <h3 style="margin-top:20px;">${wrong.length ? 'What to look at again' : 'Nothing wrong. Every single one.'}</h3>
      ${wrongList}
      <a class="btn btn-secondary" href="#/" data-action="leave-test"
         style="margin-top:16px;">Back to the menu</a>
    </div>`;
}

// ── Running the paper ────────────────────────────────────────────────────────

function stopClock() {
  if (ticker) { clearInterval(ticker); ticker = null; }
}

function startClock(app) {
  stopClock();
  ticker = setInterval(() => {
    // If he has navigated out of the test, stop the clock rather than dropping
    // a results screen on top of whatever section he is in now.
    if (!location.hash.includes('mock-test')) { stopClock(); return; }
    const left = deadline - Date.now();
    const el = document.getElementById('test-clock');
    if (el) {
      el.textContent = fmtClock(left);
      el.style.color = left < 5 * 60 * 1000 ? '#A8443A' : '';
    }
    if (left <= 0) {
      stopClock();
      finishTest(app, true);
    }
  }, 1000);
}

function finishTest(app, ranOut) {
  if (finished) return;
  finished = true;
  stopClock();

  let correct = 0;
  const details = [];
  paper.forEach((item, i) => {
    const answerIdx = item.kind === 'nvr' ? item._answerIdx : item.answer;
    if (answers[i] !== null && answers[i] === answerIdx) correct++;
    else {
      details.push({
        n: i + 1, part: item.part, topic: item.topic || '',
        question: item.kind === 'nvr' ? `[${item.topic}]` : item.stem,
        skipped: answers[i] === null,
      });
    }
  });

  Store.recordQuiz(SECTION_ID, correct, TOTAL_Q, 0, ranOut ? 'timed-out' : 'completed',
    { wrong: details, minutes: TEST_MINUTES });

  renderResults(app, ranOut);
}

// ── Public init ──────────────────────────────────────────────────────────────

export async function init(app) {
  stopClock();
  finished = false;
  paper = [];
  answers = [];
  current = 0;

  renderCodeScreen(app, false);

  const handler = async (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'leave-test') {
      stopClock();
      return; // the href takes it home
    }

    if (action === 'check-code') {
      e.preventDefault();
      const input = document.getElementById('test-code');
      const given = (input ? input.value : '').trim().toLowerCase();
      if (given && given === getTestCode()) renderBriefScreen(app);
      else renderCodeScreen(app, true);
      return;
    }

    if (action === 'begin-test') {
      e.preventDefault();
      el.disabled = true;
      el.textContent = 'Getting the paper ready…';
      paper = await buildPaper();
      if (paper.length < TOTAL_Q) {
        app.innerHTML = `${header('Mock Test')}
          <div class="section-home"><h2>The paper is short</h2>
          <p>Only ${paper.length} of ${TOTAL_Q} questions could be found.
             Tell Mum before you sit it.</p></div>`;
        return;
      }
      answers = new Array(paper.length).fill(null);
      current = 0;
      deadline = Date.now() + TEST_MINUTES * 60 * 1000;
      renderQuestion(app);
      startClock(app);
      return;
    }

    if (action === 'answer') {
      e.preventDefault();
      answers[current] = parseInt(el.dataset.value, 10);
      // Re-render marks the choice, but re-rendering an NVR question reshuffles
      // its options, so only repaint the plain multiple-choice ones.
      if (paper[current].kind === 'nvr') markChosen(app, answers[current]);
      else renderQuestion(app);
      return;
    }

    if (action === 'next-q') {
      e.preventDefault();
      if (current < paper.length - 1) { current++; renderQuestion(app); }
      return;
    }

    if (action === 'prev-q') {
      e.preventDefault();
      if (current > 0) { current--; renderQuestion(app); }
      return;
    }

    if (action === 'finish-test') {
      e.preventDefault();
      finishTest(app, false);
      return;
    }
  };

  app._testHandler = handler;
  app.addEventListener('click', handler);
}
