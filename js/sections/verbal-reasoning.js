// ── VERBAL REASONING SECTION ─────────────────────────────────────────────────
// Loads verbal-reasoning.json with 13 question types for Bexley GL prep.

import { Store } from '../store.js';
import { renderQuizProgress, renderScore as renderScoreUI } from '../ui.js';
import { calculateQuizXP } from '../xp.js';
import { playSound } from '../audio.js';

const SECTION_ID = 'verbal-reasoning';

// Icons per type id (matches JSON ids)
const TYPE_ICONS = {
  'synonyms': '\u{1F91D}',
  'antonyms': '\u2194\uFE0F',
  'homonyms': '\u{1F500}',
  'adjectives': '\u{1F3A8}',
  'adverbs': '\u{1F3C3}',
  'analogies': '\u{1F517}',
  'letter-codes': '\u{1F510}',
  'letter-sequences': '\u{1F520}',
  'anagrams': '\u{1F501}',
  'hidden-words': '\u{1F50E}',
  'odd-one-out': '\u{1F440}',
  'cloze': '\u{1F4DD}',
  'word-class': '\u{1F524}'
};

// ── Module state ─────────────────────────────────────────────────────────
let DATA = null;
let _loading = null;

let currentTypeId = null;
let currentMode = null;           // 'practice' | 'traps' | 'words'
let questions = [];
let currentIndex = 0;
let results = [];
let answered = false;

async function loadData() {
  if (DATA) return DATA;
  if (_loading) return _loading;
  _loading = fetch('data/verbal-reasoning.json')
    .then(r => r.json())
    .then(d => { DATA = d; return DATA; })
    .catch(err => { console.error('Failed to load VR data:', err); DATA = { questionTypes: [] }; return DATA; });
  return _loading;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function findType(id) {
  return (DATA.questionTypes || []).find(t => t.id === id);
}

// ── Screens ──────────────────────────────────────────────────────────────

function renderMenu(app) {
  const state = Store.get();
  const data = state.sections[SECTION_ID] || { completed: 0, correct: 0, total: 0 };

  const types = DATA.questionTypes || [];
  const cards = types.map(t => {
    const icon = TYPE_ICONS[t.id] || '\u{1F4D6}';
    return `
      <button class="section-card" data-action="pick-type" data-type="${t.id}" style="cursor:pointer;border:none;">
        <span class="card-icon">${icon}</span>
        <span class="card-name">${t.title}</span>
      </button>`;
  }).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Verbal Reasoning</span>
    </div>
    <div class="section-home">
      <p class="section-desc">13 Bexley-style VR question types. Pick one to practise.</p>
      <div class="score-stats" style="margin-bottom:20px;">
        <div class="stat-card">
          <div class="stat-value">${data.completed || 0}</div>
          <div class="stat-label">Quizzes done</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0}%</div>
          <div class="stat-label">Accuracy</div>
        </div>
      </div>
      <div class="section-grid">${cards}</div>
    </div>`;
}

function renderTypeOverview(app, typeId) {
  const t = findType(typeId);
  if (!t) { renderMenu(app); return; }

  const examplesHtml = (t.examples || []).map(e => `<li>${e}</li>`).join('');
  const icon = TYPE_ICONS[t.id] || '\u{1F4D6}';

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/${SECTION_ID}" data-action="back-to-menu">\u2190</a>
      <span class="quiz-title">${t.title}</span>
    </div>
    <div class="nvr-teach">
      <div class="nvr-teach-icon">${icon}</div>
      <h2>${t.title}</h2>

      <div class="nvr-teach-card">
        <h3>Rule</h3>
        <p>${t.rule || ''}</p>
      </div>

      <div class="nvr-teach-card">
        <h3>Examples</h3>
        <ul class="nvr-teach-steps">${examplesHtml}</ul>
      </div>

      <div class="nvr-teach-card nvr-teach-tip">
        <h3>Exam technique</h3>
        <p>${t.examTechnique || ''}</p>
      </div>

      <div class="vr-mode-buttons">
        <button class="btn btn-primary" data-action="start-practice" data-type="${t.id}">Practice (${(t.practiceQuestions || []).length})</button>
        <button class="btn btn-coral" data-action="start-traps" data-type="${t.id}">Traps (${(t.traps || []).length})</button>
        <button class="btn btn-secondary" data-action="show-words" data-type="${t.id}">Words to know</button>
      </div>
    </div>`;
}

function renderWordsToKnow(app, typeId) {
  const t = findType(typeId);
  if (!t) { renderMenu(app); return; }
  const hfw = t.highFrequencyWords || {};
  const classes = hfw.classes || [];
  const rows = classes.map(c => `
    <div class="nvr-teach-card">
      <h3>${c.name}</h3>
      <p>${c.examples}</p>
    </div>`).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/${SECTION_ID}/${typeId}" data-action="back-to-type" data-type="${typeId}">\u2190</a>
      <span class="quiz-title">Words to know</span>
    </div>
    <div class="nvr-teach">
      <h2>${hfw.title || t.title + ' — Words'}</h2>
      ${rows || '<p>No reference words for this type.</p>'}
      <button class="btn btn-secondary" data-action="back-to-type" data-type="${typeId}">Back</button>
    </div>`;
}

function renderQuestion(app) {
  if (currentIndex >= questions.length) {
    renderScoreScreen(app);
    return;
  }

  const item = questions[currentIndex];
  const q = item.q;
  answered = false;

  const optionBtns = (q.options || []).map((opt, i) =>
    `<button class="option-btn" data-action="answer" data-index="${i}">${opt}</button>`
  ).join('');

  const t = findType(currentTypeId);
  const modeLabel = currentMode === 'traps' ? 'Traps' : 'Practice';

  const trapHeading = item.heading
    ? `<p style="text-align:center;font-size:0.85rem;font-weight:700;color:var(--accent-coral, #C05545);margin-bottom:6px;">${item.heading}</p>`
    : '';

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/${SECTION_ID}/${currentTypeId}" data-action="back-to-type" data-type="${currentTypeId}">\u2190</a>
      <span class="quiz-title">${t ? t.title : 'VR'} \u00B7 ${modeLabel}</span>
      <span class="quiz-count">${currentIndex + 1}/${questions.length}</span>
    </div>
    ${renderQuizProgress(currentIndex, questions.length, results)}
    <div class="question-area">
      ${trapHeading}
      <p class="question-text">${q.stem}</p>
    </div>
    <div class="options-grid">${optionBtns}</div>`;
}

function renderScoreScreen(app) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz(SECTION_ID, xpData.correct, xpData.total, xpData.totalXP, currentTypeId);

  const sectionData = Store.get().sections[SECTION_ID] || { completed: 0, correct: 0, total: 0 };
  Store.updateSection(SECTION_ID, {
    completed: (sectionData.completed || 0) + 1,
    correct: (sectionData.correct || 0) + xpData.correct,
    total: (sectionData.total || 0) + xpData.total
  });

  const t = findType(currentTypeId);
  const title = (t ? t.title : 'Verbal Reasoning') + (currentMode === 'traps' ? ' — Traps' : '');
  app.innerHTML = renderScoreUI(results, title, xpData.totalXP);

  // Replace score actions with VR-specific buttons
  const scoreActions = app.querySelector('.score-actions');
  if (scoreActions) {
    scoreActions.innerHTML = `
      <button class="btn btn-primary" data-action="retry-mode">Try again</button>
      <button class="btn btn-secondary" data-action="back-to-type" data-type="${currentTypeId}">Back to ${t ? t.title : 'type'}</button>
      <a class="btn btn-secondary" href="#/${SECTION_ID}" data-action="back-to-menu">All VR types</a>`;
  }

  if (window.__showXPToast) window.__showXPToast(`+${xpData.totalXP} XP`);
}

// ── Quiz flow ────────────────────────────────────────────────────────────

function startPractice(typeId) {
  const t = findType(typeId);
  if (!t) return false;
  currentTypeId = typeId;
  currentMode = 'practice';
  questions = shuffle((t.practiceQuestions || []).map(q => ({
    q: {
      stem: q.stem,
      options: q.options,
      answer: q.correct,
      explanation: q.explanation || ''
    }
  })));
  currentIndex = 0;
  results = [];
  answered = false;
  return questions.length > 0;
}

function startTraps(typeId) {
  const t = findType(typeId);
  if (!t) return false;
  currentTypeId = typeId;
  currentMode = 'traps';
  questions = (t.traps || []).map(trap => ({
    heading: trap.heading,
    q: {
      stem: trap.practiceQuestion.stem,
      options: trap.practiceQuestion.options,
      answer: trap.practiceQuestion.correct,
      explanation: trap.explanation || ''
    }
  }));
  currentIndex = 0;
  results = [];
  answered = false;
  return questions.length > 0;
}

function handleAnswer(app, index) {
  if (answered) return;
  answered = true;

  const item = questions[currentIndex];
  const q = item.q;
  const isCorrect = index === q.answer;
  results.push(isCorrect);

  const state = Store.get();
  if (state.settings && state.settings.soundOn !== false) {
    playSound(isCorrect);
  }

  const buttons = app.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  if (q.explanation) {
    const tip = document.createElement('div');
    tip.style.cssText = 'margin-top:16px;padding:12px 16px;background:var(--white);border-radius:var(--radius);font-size:0.9rem;color:var(--text-muted);';
    tip.textContent = q.explanation;
    const grid = app.querySelector('.options-grid');
    if (grid) grid.after(tip);
  }

  const delay = currentMode === 'traps' ? 6000 : 4000;
  setTimeout(() => {
    currentIndex++;
    renderQuestion(app);
  }, delay);
}

// ── Route handling ───────────────────────────────────────────────────────

function routeFromHash() {
  const hash = location.hash.replace('#/', '').replace('#', '');
  const parts = hash.split('/');
  if (parts[0] !== SECTION_ID) return { screen: 'menu' };
  if (!parts[1]) return { screen: 'menu' };
  return { screen: 'type', typeId: parts[1] };
}

// ── Init ──

export default async function init(app) {
  // Show loading state
  app.innerHTML = `<div class="quiz-header"><a class="quiz-back" href="#/">\u2190</a><span class="quiz-title">Verbal Reasoning</span></div><div class="section-home"><p>Loading\u2026</p></div>`;
  await loadData();

  const route = routeFromHash();
  if (route.screen === 'type' && route.typeId) {
    renderTypeOverview(app, route.typeId);
  } else {
    renderMenu(app);
  }

  // Remove previous handler
  if (app._vrHandler) app.removeEventListener('click', app._vrHandler);

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'pick-type') {
      e.preventDefault();
      const typeId = el.dataset.type;
      location.hash = `#/${SECTION_ID}/${typeId}`;
      renderTypeOverview(app, typeId);
    }

    if (action === 'back-to-menu') {
      e.preventDefault();
      location.hash = `#/${SECTION_ID}`;
      renderMenu(app);
    }

    if (action === 'back-to-type') {
      e.preventDefault();
      const typeId = el.dataset.type || currentTypeId;
      location.hash = `#/${SECTION_ID}/${typeId}`;
      renderTypeOverview(app, typeId);
    }

    if (action === 'start-practice') {
      const typeId = el.dataset.type;
      if (startPractice(typeId)) renderQuestion(app);
    }

    if (action === 'start-traps') {
      const typeId = el.dataset.type;
      if (startTraps(typeId)) renderQuestion(app);
    }

    if (action === 'show-words') {
      const typeId = el.dataset.type;
      renderWordsToKnow(app, typeId);
    }

    if (action === 'answer') {
      handleAnswer(app, parseInt(el.dataset.index, 10));
    }

    if (action === 'retry-mode') {
      if (currentMode === 'traps') {
        startTraps(currentTypeId);
      } else {
        startPractice(currentTypeId);
      }
      renderQuestion(app);
    }
  };

  app._vrHandler = handler;
  app.addEventListener('click', handler);
}

export { init };
