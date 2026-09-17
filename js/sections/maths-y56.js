// ── YEAR 5 AND 6 MATHS SECTION ───────────────────────────────────────────────
// Jacob is Year 5 and sits the Bexley test at the start of Year 6, so this is
// the level he needs now. The Year 4 maths section stays where it is for
// anything he wants to go back over.
//
// Every question comes from js/y56/maths.js and is generated, so the bank never
// runs out. Each topic teaches first: rule, points, worked example, and then
// ten questions.
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';

const SECTION_ID = 'maths-y56';
const QUIZ_LENGTH = 10;

let view = 'menu';        // menu | teach | quiz | done
let topicId = null;
let questions = [];
let index = 0;
let results = [];
let answered = false;

function bank() {
  return (typeof window !== 'undefined' && window.Y56_MATHS) || null;
}

function esc(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function progressKey() { return 'j11_y56_progress'; }
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(progressKey()) || '{}'); } catch { return {}; }
}
function saveBest(id, score, total) {
  const p = loadProgress();
  const prev = p[id] || { best: 0, total: 0, attempts: 0 };
  const better = total > 0 && score / total > (prev.total ? prev.best / prev.total : 0);
  p[id] = {
    attempts: prev.attempts + 1,
    best: better ? score : prev.best,
    total: better ? total : prev.total
  };
  localStorage.setItem(progressKey(), JSON.stringify(p));
}

// ── Screens ─────────────────────────────────────────────────────────────────

function header(title) {
  return `<div class="quiz-header">
    <a class="quiz-back" href="#/" data-action="y56-home">←</a>
    <span class="quiz-title">${esc(title)}</span>
  </div>`;
}

function renderMenu(app) {
  const B = bank();
  if (!B) {
    app.innerHTML = `${header('Year 5 & 6 Maths')}
      <div class="section-home"><h2>Not loaded</h2>
      <p>The Year 5 and 6 question bank did not load. Tell Mum.</p></div>`;
    return;
  }
  const prog = loadProgress();
  const tiles = B.TOPICS.map((t) => {
    const p = prog[t.id];
    const done = p && p.total
      ? `<span class="nvr-type-count">best ${p.best}/${p.total} · ${p.attempts} go${p.attempts === 1 ? '' : 'es'}</span>`
      : '<span class="nvr-type-count">not tried yet</span>';
    return `<a class="nvr-type-card" href="#/maths-y56/${t.id}" data-action="y56-topic" data-topic="${t.id}">
      <span class="nvr-type-icon">${t.icon}</span>
      <span class="nvr-type-name">${esc(t.name)}</span>
      ${done}
    </a>`;
  }).join('');

  app.innerHTML = `${header('Year 5 & 6 Maths')}
    <div class="section-home">
      <div class="section-home-icon">\u{1F393}</div>
      <h2>Year 5 and 6 Maths</h2>
      <p>Your actual year, and the level the Bexley paper is set at.
         Every topic teaches you the method first, then gives you ten questions.
         The questions are made fresh each time, so you will never get the same
         ten twice.</p>
      <a class="btn btn-primary" href="#/maths-y56/mixed" data-action="y56-topic" data-topic="mixed"
         style="display:block;margin:0 0 16px;">\u{1F500} Mixed paper, 10 questions</a>
      <div class="nvr-type-grid">${tiles}</div>
    </div>`;
}

function renderTeach(app) {
  const B = bank();
  const t = B.TOPICS.find((x) => x.id === topicId);
  if (!t) { view = 'menu'; renderMenu(app); return; }

  app.innerHTML = `${header(t.name)}
    <div class="nvr-teach">
      <div class="maths-practice-step">Step 1 of 2 · Learn it</div>
      <div class="nvr-teach-icon">${t.icon}</div>
      <h2>${esc(t.name)}</h2>

      <div class="nvr-teach-card">
        <h3>The rule</h3>
        <p>${esc(t.rule)}</p>
        <ol class="nvr-teach-steps">${t.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
      </div>

      <div class="nvr-teach-card nvr-teach-tip">
        <h3>Worked example</h3>
        <p><strong>${esc(t.example.q)}</strong></p>
        <ol class="nvr-teach-steps">${t.example.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
        <p><strong>Answer: ${esc(t.example.a)}</strong></p>
      </div>

      <button class="btn btn-primary start-btn" data-action="y56-start">Ready! Start the questions →</button>
    </div>`;
}

function renderQuestion(app) {
  const q = questions[index];
  const B = bank();
  const t = B.TOPICS.find((x) => x.id === topicId);
  const title = t ? t.name : 'Mixed paper';

  app.innerHTML = `${header(title)}
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 14px;">
      <span style="font-size:13px;font-weight:700;color:#1A8A7D;text-transform:uppercase;">Step 2 of 2 · Practice</span>
      <span style="font-size:13px;color:#8A8A8A;">Question ${index + 1} of ${questions.length}</span>
    </div>
    <div class="nvr-question-area" style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px;">
      <div style="font-size:18px;font-weight:700;text-align:center;">${esc(q.q)}</div>
    </div>
    <div class="nvr-options-grid">
      ${q.opts.map((o, i) => `<button class="opt" data-action="y56-answer" data-value="${i}">
        <div class="lbl">${'ABCD'[i]}</div>
        <div style="padding:8px;font-size:16px;font-weight:600;">${esc(o)}</div>
      </button>`).join('')}
    </div>
    <div class="nvr-explanation" id="y56-exp" style="display:none;"></div>`;
  answered = false;
}

function showAnswer(app, chosen) {
  if (answered) return;
  answered = true;
  const q = questions[index];
  const right = chosen === q.ans;
  results.push(right);
  playSound(right);

  app.querySelectorAll('.nvr-options-grid .opt').forEach((b, i) => {
    if (i === q.ans) b.classList.add('correct');
    else if (i === chosen) b.classList.add('wrong');
    b.disabled = true;
  });

  const exp = document.getElementById('y56-exp');
  exp.className = `nvr-explanation ${right ? 'nvr-exp-correct' : 'nvr-exp-wrong'}`;
  exp.style.display = 'block';
  exp.innerHTML = `<p>${right ? '✅ ' : '❌ '}${esc(q.why)}</p>
    <button class="btn btn-primary" data-action="y56-next" style="margin-top:10px;">
      ${index + 1 < questions.length ? 'Next →' : 'See how you did'}</button>`;
}

function renderDone(app) {
  const B = bank();
  const t = B.TOPICS.find((x) => x.id === topicId);
  const score = results.filter(Boolean).length;
  const pct = Math.round((score / questions.length) * 100);
  const xp = calculateQuizXP(results);
  Store.recordQuiz(SECTION_ID, score, questions.length, xp, topicId, null);
  saveBest(topicId, score, questions.length);

  app.innerHTML = `${header(t ? t.name : 'Mixed paper')}
    <div class="section-home">
      <div class="section-home-icon">${pct >= 80 ? '\u{1F31F}' : '\u{1F4CA}'}</div>
      <h2>${score} out of ${questions.length}</h2>
      <p>${pct}%${pct >= 90 ? ' · that counts towards your Robux' : ''}</p>
      <button class="btn btn-primary" data-action="y56-again">Another ten →</button>
      <a class="btn btn-secondary" href="#/maths-y56" data-action="y56-menu"
         style="display:block;margin-top:10px;">All topics</a>
    </div>`;
}

function startQuiz(app) {
  const B = bank();
  questions = topicId === 'mixed' ? B.makeMixed(QUIZ_LENGTH) : B.makeSet(topicId, QUIZ_LENGTH);
  index = 0;
  results = [];
  view = 'quiz';
  renderQuestion(app);
}

// ── Public init ─────────────────────────────────────────────────────────────

export function init(app) {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  topicId = parts[1] || null;

  if (topicId === 'mixed') {
    // A mixed paper is revision of things already taught, so it skips the
    // teaching and goes straight in.
    startQuiz(app);
  } else if (topicId && bank() && bank().TOPICS.some((t) => t.id === topicId)) {
    view = 'teach';
    renderTeach(app);
  } else {
    topicId = null;
    view = 'menu';
    renderMenu(app);
  }

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'y56-topic') {
      e.preventDefault();
      topicId = el.dataset.topic;
      location.hash = `#/maths-y56/${topicId}`;
      if (topicId === 'mixed') startQuiz(app);
      else { view = 'teach'; renderTeach(app); }
      return;
    }
    if (action === 'y56-start') {
      e.preventDefault();
      startQuiz(app);
      return;
    }
    if (action === 'y56-answer') {
      e.preventDefault();
      showAnswer(app, parseInt(el.dataset.value, 10));
      return;
    }
    if (action === 'y56-next') {
      e.preventDefault();
      if (index + 1 < questions.length) { index++; renderQuestion(app); }
      else { view = 'done'; renderDone(app); }
      return;
    }
    if (action === 'y56-again') {
      e.preventDefault();
      startQuiz(app);
      return;
    }
    if (action === 'y56-menu') {
      e.preventDefault();
      topicId = null;
      location.hash = '#/maths-y56';
      view = 'menu';
      renderMenu(app);
      return;
    }
  };

  app._y56Handler = handler;
  app.addEventListener('click', handler);
}
