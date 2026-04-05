// ── NVR SECTION MODULE ────────────────────────────────────────────────────
// Wires the extracted NVR shapes, questions and renderers into the app.
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderQuizProgress, renderScore } from '../ui.js';
import { TYPES, TEACH } from '../nvr/questions.js';
import { renderQArea, renderOpts } from '../nvr/renderers.js';

const QUIZ_LENGTH = 10;

// Question bank loaded from nvr-questions.json on demand
let Q = null;
let _loading = null;

async function loadQuestions() {
  if (Q) return Q;
  if (_loading) return _loading;
  _loading = fetch('data/nvr-questions.json')
    .then(r => r.json())
    .then(d => { Q = d.questions || {}; return Q; })
    .catch(err => { console.error('Failed to load NVR questions:', err); Q = {}; return Q; });
  return _loading;
}

// ── Module state ─────────────────────────────────────────────────────────
let currentType = null;   // e.g. 'ooo'
let quizQueue = [];
let currentIndex = 0;
let results = [];
let consecutiveCorrect = 0;
let answered = false;
let timerStart = 0;

// ── Helpers ──────────────────────────────────────────────────────────────

function pickRandom(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

/** Format elapsed seconds as m:ss */
function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/** Get NVR sub-section progress from the Store. */
function getTypeProgress(typeId) {
  const state = Store.get();
  const nvr = state.sections.nvr || {};
  return nvr[typeId] || { completed: 0, bestScore: 0 };
}

// ── Screens ──────────────────────────────────────────────────────────────

/** 1. Type selection grid */
function renderTypeGrid(container) {
  const state = Store.get();
  const nvr = state.sections.nvr || {};

  const cards = TYPES.map(t => {
    const prog = nvr[t.id] || { completed: 0, bestScore: 0 };
    const pct = prog.bestScore || 0;
    return `
      <a class="nvr-type-card" href="#/nvr/${t.id}" data-action="select-type" data-type="${t.id}">
        <span class="nvr-type-icon">${t.icon}</span>
        <span class="nvr-type-name">${t.name}</span>
        <div class="card-progress-bg">
          <div class="card-progress-fill" style="width: ${pct * 10}%"></div>
        </div>
        <span class="nvr-type-count">${prog.completed} done${pct ? ' | best ' + pct + '/10' : ''}</span>
      </a>`;
  }).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">NVR</span>
    </div>
    <div class="section-home">
      <div class="section-home-icon">\u{1F532}</div>
      <h2>Non-Verbal Reasoning</h2>
      <p>10 question types to sharpen your pattern skills.</p>
      <div class="nvr-type-grid">${cards}</div>
    </div>`;
}

/** 2. Teach screen for a selected type */
function renderTeachScreen(container, typeId) {
  const t = TYPES.find(x => x.id === typeId);
  const teach = TEACH[typeId];
  if (!t || !teach) { renderTypeGrid(container); return; }

  const prog = getTypeProgress(typeId);
  const steps = teach.steps.map((s, i) =>
    `<li>${s}</li>`
  ).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/nvr" data-action="back-to-grid">\u2190</a>
      <span class="quiz-title">${t.name}</span>
    </div>
    <div class="nvr-teach">
      <div class="nvr-teach-icon">${t.icon}</div>
      <h2>${t.name}</h2>

      <div class="nvr-teach-card">
        <h3>What is it?</h3>
        <p>${teach.what}</p>
      </div>

      <div class="nvr-teach-card">
        <h3>How to approach it</h3>
        <ol class="nvr-teach-steps">${steps}</ol>
      </div>

      <div class="nvr-teach-card nvr-teach-tip">
        <h3>Top tip</h3>
        <p>${teach.tip}</p>
      </div>

      ${prog.completed > 0 ? `<p class="nvr-teach-stats">You've done ${prog.completed} quiz${prog.completed > 1 ? 'zes' : ''} | Best: ${prog.bestScore}/10</p>` : ''}

      <button class="btn btn-primary start-btn" data-action="start-practice" data-type="${typeId}">Start Practice</button>
    </div>`;
}

/** 3. Practice / quiz screen */
function renderQuestionScreen(container) {
  const q = quizQueue[currentIndex];
  const t = TYPES.find(x => x.id === currentType);

  const qArea = renderQArea(currentType, q);
  const opts = renderOpts(currentType, q);

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/nvr/${currentType}" data-action="back-to-teach">\u2190</a>
      <span class="quiz-title">${t ? t.name : 'NVR'}</span>
      <span class="quiz-counter">${currentIndex + 1}/${QUIZ_LENGTH}</span>
    </div>
    ${renderQuizProgress(currentIndex, QUIZ_LENGTH, results)}
    <div class="nvr-timer" id="nvr-timer"></div>
    <div class="nvr-question-area">${qArea}</div>
    <div class="nvr-options-grid">${opts}</div>
    <div class="nvr-explanation" id="nvr-explanation" style="display:none;"></div>`;

  updateTimer();
}

/** Update the timer display */
function updateTimer() {
  const el = document.getElementById('nvr-timer');
  if (!el) return;
  const elapsed = Date.now() - timerStart;
  el.textContent = fmtTime(elapsed);
}

/** 4. Score screen */
function renderScoreScreen(container) {
  const elapsed = Date.now() - timerStart;
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz('nvr', xpData.correct, xpData.total, xpData.totalXP, currentType);

  // Update NVR sub-section progress
  const state = Store.get();
  const nvr = state.sections.nvr || {};
  const prev = nvr[currentType] || { completed: 0, bestScore: 0 };
  const newBest = Math.max(prev.bestScore, xpData.correct);

  Store.updateSection('nvr', {
    [currentType]: { completed: prev.completed + 1, bestScore: newBest }
  });

  const t = TYPES.find(x => x.id === currentType);
  const typeName = t ? t.name : 'NVR';

  container.innerHTML = renderScore(results, typeName, xpData.totalXP);

  // Add time and NVR-specific actions below the standard score
  const scoreActions = container.querySelector('.score-actions');
  if (scoreActions) {
    // Replace the default retry and home buttons with NVR-specific ones
    scoreActions.innerHTML = `
      <div class="nvr-score-time">Time: ${fmtTime(elapsed)}</div>
      <button class="btn btn-primary" data-action="retry-nvr" data-type="${currentType}">Try again</button>
      <a class="btn btn-secondary" href="#/nvr/${currentType}" data-action="back-to-teach">Back to ${typeName}</a>
      <a class="btn btn-secondary" href="#/nvr" data-action="back-to-grid">All NVR types</a>`;
  }

  if (window.__showXPToast) {
    window.__showXPToast(`+${xpData.totalXP} XP`);
  }
}

// ── Quiz flow ────────────────────────────────────────────────────────────

function startQuiz(typeId) {
  currentType = typeId;
  const bank = (Q && Q[typeId]) || [];
  if (!bank.length) return;

  quizQueue = pickRandom(bank, Math.min(QUIZ_LENGTH, bank.length));
  currentIndex = 0;
  results = [];
  consecutiveCorrect = 0;
  answered = false;
  timerStart = Date.now();
}

function handleAnswer(container, idx) {
  if (answered) return;
  answered = true;

  const q = quizQueue[currentIndex];
  const isCorrect = idx === q.a;
  results.push(isCorrect);

  // Highlight correct/wrong on the option buttons
  const buttons = container.querySelectorAll('.nvr-options-grid [data-action="answer"]');
  const state = Store.get();

  if (isCorrect) {
    consecutiveCorrect++;
    buttons[idx].classList.add('correct');
    if (state.settings.soundOn) playSound(true);
  } else {
    consecutiveCorrect = 0;
    buttons[idx].classList.add('wrong');
    buttons[q.a].classList.add('correct');
    if (state.settings.soundOn) playSound(false);
  }

  // Show explanation if present
  if (q.e) {
    const expEl = document.getElementById('nvr-explanation');
    if (expEl) {
      expEl.innerHTML = q.e;
      expEl.style.display = 'block';
      expEl.className = `nvr-explanation ${isCorrect ? 'nvr-exp-correct' : 'nvr-exp-wrong'}`;
    }
  }

  // Pause then advance
  const delay = isCorrect ? 3000 : 5000;
  setTimeout(() => {
    currentIndex++;
    answered = false;
    if (currentIndex >= quizQueue.length) {
      renderScoreScreen(container);
    } else {
      renderQuestionScreen(container);
    }
  }, delay);
}

// ── Route handling ───────────────────────────────────────────────────────

function routeFromHash() {
  const hash = location.hash.replace('#/', '').replace('#', '');
  const parts = hash.split('/');
  // Expected: nvr, nvr/ooo, nvr/ooo/practice
  if (parts[0] !== 'nvr') return { screen: 'grid' };
  if (!parts[1]) return { screen: 'grid' };
  if (parts[2] === 'practice') return { screen: 'practice', typeId: parts[1] };
  return { screen: 'teach', typeId: parts[1] };
}

// ── Public init ──────────────────────────────────────────────────────────

export async function init(container) {
  // Show a quick loading state while we fetch the question bank
  container.innerHTML = `<div class="quiz-header"><a class="quiz-back" href="#/">\u2190</a><span class="quiz-title">NVR</span></div><div class="section-home"><p>Loading questions\u2026</p></div>`;
  await loadQuestions();

  const route = routeFromHash();

  if (route.screen === 'practice' && route.typeId) {
    startQuiz(route.typeId);
    renderQuestionScreen(container);
  } else if (route.screen === 'teach' && route.typeId) {
    currentType = route.typeId;
    renderTeachScreen(container, route.typeId);
  } else {
    renderTypeGrid(container);
  }

  // Timer interval (updates display every second during quiz)
  let timerInterval = null;

  function startTimerInterval() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  function stopTimerInterval() {
    clearInterval(timerInterval);
  }

  if (route.screen === 'practice') {
    startTimerInterval();
  }

  // Delegated click handler
  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;

    if (action === 'select-type') {
      e.preventDefault();
      const typeId = el.dataset.type;
      currentType = typeId;
      location.hash = `#/nvr/${typeId}`;
      renderTeachScreen(container, typeId);
    }

    if (action === 'back-to-grid') {
      e.preventDefault();
      stopTimerInterval();
      location.hash = '#/nvr';
      renderTypeGrid(container);
    }

    if (action === 'back-to-teach') {
      e.preventDefault();
      stopTimerInterval();
      location.hash = `#/nvr/${currentType}`;
      renderTeachScreen(container, currentType);
    }

    if (action === 'start-practice') {
      const typeId = el.dataset.type;
      startQuiz(typeId);
      location.hash = `#/nvr/${typeId}/practice`;
      startTimerInterval();
      renderQuestionScreen(container);
    }

    if (action === 'answer') {
      const idx = parseInt(el.dataset.value, 10);
      handleAnswer(container, idx);
    }

    if (action === 'retry-nvr') {
      const typeId = el.dataset.type;
      startQuiz(typeId);
      startTimerInterval();
      renderQuestionScreen(container);
    }
  };

  // Remove previous listener if re-initialised
  container.removeEventListener('click', container._nvrHandler);
  container._nvrHandler = handler;
  container.addEventListener('click', handler);

  // Clean up timer on hash change away from NVR
  const hashHandler = () => {
    const hash = location.hash.replace('#/', '').replace('#', '');
    if (!hash.startsWith('nvr')) {
      stopTimerInterval();
      container.removeEventListener('click', container._nvrHandler);
      window.removeEventListener('hashchange', hashHandler);
    }
  };
  window.addEventListener('hashchange', hashHandler);
}

export default init;
