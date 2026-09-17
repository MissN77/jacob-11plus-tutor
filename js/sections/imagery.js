// ── READING BETWEEN THE LINES ────────────────────────────────────────────────
// Inference broken into named skills, each taught explicitly before it is
// tested. Every question shows a short extract, then asks one thing about it,
// and the explanation always names the clue in the text.
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';

const SECTION_ID = 'imagery';

let skillId = null;
let questions = [];
let index = 0;
let results = [];
let answered = false;

function bank() {
  return (typeof window !== 'undefined' && window.Y56_IMAGERY) || null;
}

function esc(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

const PROGRESS_KEY = 'j11_imagery_progress';
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; }
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
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function header(title) {
  return `<div class="quiz-header">
    <a class="quiz-back" href="#/" data-action="img-home">←</a>
    <span class="quiz-title">${esc(title)}</span>
  </div>`;
}

function renderMenu(app) {
  const B = bank();
  if (!B) {
    app.innerHTML = `${header('Reading Between the Lines')}
      <div class="section-home"><h2>Not loaded</h2><p>Tell Mum.</p></div>`;
    return;
  }
  const prog = loadProgress();
  const tiles = B.SKILLS.map((s) => {
    const p = prog[s.id];
    const done = p && p.total
      ? `<span class="nvr-type-count">best ${p.best}/${p.total}</span>`
      : '<span class="nvr-type-count">not tried yet</span>';
    return `<a class="nvr-type-card" href="#/imagery/${s.id}" data-action="img-skill" data-skill="${s.id}">
      <span class="nvr-type-icon">${s.icon}</span>
      <span class="nvr-type-name">${esc(s.name)}</span>
      ${done}
    </a>`;
  }).join('');

  app.innerHTML = `${header('Reading Between the Lines')}
    <div class="section-home">
      <div class="section-home-icon">\u{1F50E}</div>
      <h2>Reading Between the Lines</h2>
      <p>Writers hide meaning in colours, weather, the exact word they pick and
         what a person's body does. None of it is guessing. There is always a
         clue on the page, and every answer here shows you which one it was.</p>
      <a class="btn btn-primary" href="#/imagery/mixed" data-action="img-skill" data-skill="mixed"
         style="display:block;margin:0 0 16px;">\u{1F500} Mixed, 10 questions</a>
      <div class="nvr-type-grid">${tiles}</div>
    </div>`;
}

function renderTeach(app) {
  const s = bank().SKILLS.find((x) => x.id === skillId);
  if (!s) { renderMenu(app); return; }
  const ex = s.example;

  app.innerHTML = `${header(s.name)}
    <div class="nvr-teach">
      <div class="maths-practice-step">Step 1 of 2 · Learn it</div>
      <div class="nvr-teach-icon">${s.icon}</div>
      <h2>${esc(s.name)}</h2>

      <div class="nvr-teach-card">
        <h3>The rule</h3>
        <p>${esc(s.rule)}</p>
        <ol class="nvr-teach-steps">${s.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ol>
      </div>

      <div class="nvr-teach-card nvr-teach-tip">
        <h3>Worked example</h3>
        <p style="font-style:italic;">${esc(ex.text)}</p>
        <p><strong>${esc(ex.q)}</strong></p>
        <ol class="nvr-teach-steps">${ex.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
        <p><strong>Answer: ${esc(ex.a)}</strong></p>
      </div>

      <button class="btn btn-primary start-btn" data-action="img-start">Ready! Start the questions →</button>
    </div>`;
}

function renderQuestion(app) {
  const q = questions[index];
  const B = bank();
  const s = B.SKILLS.find((x) => x.id === skillId);
  const title = s ? s.name : 'Mixed';

  app.innerHTML = `${header(title)}
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 14px;">
      <span style="font-size:13px;font-weight:700;color:#1A8A7D;text-transform:uppercase;">
        ${q.skill ? esc(q.skill) : 'Step 2 of 2 · Practice'}</span>
      <span style="font-size:13px;color:#8A8A8A;">Question ${index + 1} of ${questions.length}</span>
    </div>
    <div class="nvr-question-area" style="display:block;padding:18px;">
      <div style="font-style:italic;font-size:17px;line-height:1.6;padding:12px 14px;
                  border-left:4px solid #1A8A7D;background:rgba(26,138,125,0.08);border-radius:6px;">
        ${esc(q.text)}
      </div>
      <div style="font-size:17px;font-weight:700;margin-top:14px;">${esc(q.q)}</div>
    </div>
    <div class="nvr-options-grid">
      ${q.opts.map((o, i) => `<button class="opt" data-action="img-answer" data-value="${i}">
        <div class="lbl">${'ABCD'[i]}</div>
        <div style="padding:8px;font-size:15px;">${esc(o)}</div>
      </button>`).join('')}
    </div>
    <div class="nvr-explanation" id="img-exp" style="display:none;"></div>`;
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

  const exp = document.getElementById('img-exp');
  exp.className = `nvr-explanation ${right ? 'nvr-exp-correct' : 'nvr-exp-wrong'}`;
  exp.style.display = 'block';
  exp.innerHTML = `<p><strong>${right ? '✅ Yes.' : '❌ Not quite.'}</strong> ${esc(q.why)}</p>
    <button class="btn btn-primary" data-action="img-next" style="margin-top:10px;">
      ${index + 1 < questions.length ? 'Next →' : 'See how you did'}</button>`;
}

function renderDone(app) {
  const B = bank();
  const s = B.SKILLS.find((x) => x.id === skillId);
  const score = results.filter(Boolean).length;
  const pct = Math.round((score / questions.length) * 100);
  Store.recordQuiz(SECTION_ID, score, questions.length, calculateQuizXP(results), skillId, null);
  saveBest(skillId, score, questions.length);

  app.innerHTML = `${header(s ? s.name : 'Mixed')}
    <div class="section-home">
      <div class="section-home-icon">${pct >= 80 ? '\u{1F31F}' : '\u{1F50E}'}</div>
      <h2>${score} out of ${questions.length}</h2>
      <p>${pct}%</p>
      <p style="font-size:0.9rem;color:#666;max-width:420px;margin:10px auto;">
        If you got one wrong, go back and find the clue in the extract. There is
        always one. That is the whole skill.</p>
      <button class="btn btn-primary" data-action="img-again">Try again →</button>
      <a class="btn btn-secondary" href="#/imagery" data-action="img-menu"
         style="display:block;margin-top:10px;">All skills</a>
    </div>`;
}

function startQuiz(app) {
  const B = bank();
  questions = skillId === 'mixed' ? B.makeMixed(10) : B.questionsFor(skillId);
  index = 0;
  results = [];
  renderQuestion(app);
}

export function init(app) {
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  skillId = parts[1] || null;

  if (skillId === 'mixed') startQuiz(app);
  else if (skillId && bank() && bank().SKILLS.some((s) => s.id === skillId)) renderTeach(app);
  else { skillId = null; renderMenu(app); }

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'img-skill') {
      e.preventDefault();
      skillId = el.dataset.skill;
      location.hash = `#/imagery/${skillId}`;
      if (skillId === 'mixed') startQuiz(app); else renderTeach(app);
      return;
    }
    if (action === 'img-start') { e.preventDefault(); startQuiz(app); return; }
    if (action === 'img-answer') {
      e.preventDefault();
      showAnswer(app, parseInt(el.dataset.value, 10));
      return;
    }
    if (action === 'img-next') {
      e.preventDefault();
      if (index + 1 < questions.length) { index++; renderQuestion(app); }
      else renderDone(app);
      return;
    }
    if (action === 'img-again') { e.preventDefault(); startQuiz(app); return; }
    if (action === 'img-menu') {
      e.preventDefault();
      skillId = null;
      location.hash = '#/imagery';
      renderMenu(app);
      return;
    }
  };

  app._imageryHandler = handler;
  app.addEventListener('click', handler);
}
