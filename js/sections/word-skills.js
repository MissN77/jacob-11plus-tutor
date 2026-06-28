// ── WORD SKILLS SECTION ────────────────────────────────────────────────────
// A hub of 11+ verbal-reasoning word drills: synonyms, antonyms, odd-one-out,
// analogies, homophones, multiple-meaning words, prefixes/suffixes, word
// classes (incl. adverbs) and connectives. Each drill is a 10-question MCQ quiz
// with options shuffled at display time (answer never fixed), immediate
// feedback + explanation, and progress saved to Supabase (sub_section = drill).
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderQuizProgress, renderScore } from '../ui.js';

const SECTION_ID = 'word-skills';
const QUIZ_LENGTH = 10;
const DATA_URL = 'data/word-skills.json';

// Drill definitions (order shown in the menu). `key` matches the data file.
const DRILLS = [
  { id: 'synonyms',         key: 'synonyms',         name: 'Synonyms',          icon: '\u{1F91D}' },
  { id: 'antonyms',         key: 'antonyms',         name: 'Antonyms',          icon: '↔️' },
  { id: 'odd-one-out',      key: 'odd-one-out',      name: 'Odd One Out',       icon: '\u{1F50D}' },
  { id: 'analogies',        key: 'analogies',        name: 'Analogies',         icon: '\u{1F517}' },
  { id: 'homophones',       key: 'homophones',       name: 'Homophones',        icon: '\u{1F509}' },
  { id: 'multiple-meaning', key: 'multiple-meaning', name: 'Two Meanings',      icon: '\u{1F500}' },
  { id: 'affixes',          key: 'affixes',          name: 'Prefixes & Suffixes', icon: '\u{1F9E9}' },
  { id: 'word-classes',     key: 'word-classes',     name: 'Word Classes',      icon: '\u{1F3F7}️' },
  { id: 'connectives',      key: 'connectives',      name: 'Connectives',       icon: '\u{1F517}' }
];

let bank = null;       // the loaded data object
let _loading = null;

let quizQueue = [];
let currentIndex = 0;
let results = [];
let answered = false;
let currentDrill = null;

async function loadData() {
  if (bank) return bank;
  if (_loading) return _loading;
  _loading = fetch(DATA_URL)
    .then(r => r.json())
    .then(d => { bank = d || {}; return bank; })
    .catch(err => { console.error('Failed to load word-skills data:', err); bank = {}; return bank; });
  return _loading;
}

function drillById(id) { return DRILLS.find(d => d.id === id) || null; }

function pickRandom(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

// ── Menu ───────────────────────────────────────────────────────────────────

function renderMenu(container) {
  const state = Store.get();
  const sec = state.sections[SECTION_ID] || {};

  const cards = DRILLS.map(d => {
    const count = (bank && bank[d.key]) ? bank[d.key].length : 0;
    const prog = sec[d.id] || { bestScore: 0 };
    const best = prog.bestScore ? ` | best ${prog.bestScore}/10` : '';
    return `
      <a class="ws-card" href="#/word-skills/${d.id}" data-action="ws-open" data-id="${d.id}">
        <span class="ws-card-icon">${d.icon}</span>
        <span class="ws-card-name">${d.name}</span>
        <span class="ws-card-meta">${count} questions${best}</span>
      </a>`;
  }).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">←</a>
      <span class="quiz-title">Word Skills</span>
    </div>
    <div class="section-home">
      <div class="section-home-icon">\u{1F524}</div>
      <h2>Word Skills</h2>
      <p>The vocabulary and verbal-reasoning word drills the 11+ tests. Pick one and do 10 questions.</p>
      <div class="ws-grid">${cards}</div>
    </div>`;
}

// ── Quiz flow ────────────────────────────────────────────────────────────────

function startDrill(container, drill) {
  currentDrill = drill;
  const pool = (bank && bank[drill.key]) || [];
  quizQueue = pickRandom(pool, Math.min(QUIZ_LENGTH, pool.length));
  currentIndex = 0;
  results = [];
  answered = false;
  renderQuestion(container);
}

function renderQuestion(container) {
  const q = quizQueue[currentIndex];
  answered = false;

  if (!q._shuffled) {
    const idx = q.options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    q._shuffledOptions = idx.map(i => q.options[i]);
    q._shuffledAnswer = idx.indexOf(q.answer);
    q._shuffled = true;
  }

  const optionBtns = q._shuffledOptions.map((opt, i) =>
    `<button class="option-btn" data-action="ws-answer" data-index="${i}">${opt}</button>`
  ).join('');

  const stemHtml = String(q.stem).replace(/\n/g, '<br>');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/word-skills" data-action="ws-back-menu">←</a>
      <span class="quiz-title">${currentDrill.name}</span>
      <span class="quiz-counter">${currentIndex + 1}/${quizQueue.length}</span>
    </div>
    ${renderQuizProgress(currentIndex, quizQueue.length, results)}
    <div class="question-area">
      <p class="question-text ws-stem">${stemHtml}</p>
    </div>
    <div class="options-grid options-grid--stacked">${optionBtns}</div>`;
}

function handleAnswer(container, idx) {
  if (answered) return;
  answered = true;

  const q = quizQueue[currentIndex];
  const correctIdx = q._shuffledAnswer;
  const isCorrect = idx === correctIdx;
  results.push(isCorrect);

  const buttons = container.querySelectorAll('.option-btn');
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === correctIdx) b.classList.add('correct');
    if (i === idx && !isCorrect) b.classList.add('wrong');
  });

  const state = Store.get();
  if (state.settings.soundOn) playSound(isCorrect);

  // Explanation + Next
  const area = container.querySelector('.question-area');
  if (area && q.explanation) {
    const ex = document.createElement('div');
    ex.className = 'explanation-box';
    ex.innerHTML = `${isCorrect ? '✓ ' : '✗ '}${q.explanation}`;
    area.appendChild(ex);
  }
  const grid = container.querySelector('.options-grid');
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary next-btn';
  nextBtn.textContent = currentIndex + 1 >= quizQueue.length ? 'See results' : 'Next';
  nextBtn.dataset.action = 'ws-next';
  grid.insertAdjacentElement('afterend', nextBtn);
}

function advance(container) {
  currentIndex++;
  answered = false;
  if (currentIndex >= quizQueue.length) {
    renderScoreScreen(container);
  } else {
    renderQuestion(container);
  }
}

function renderScoreScreen(container) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz(SECTION_ID, xpData.correct, xpData.total, xpData.totalXP, currentDrill.id);

  // Track best score per drill
  const sec = Store.get().sections[SECTION_ID] || {};
  const prev = sec[currentDrill.id] || { completed: 0, bestScore: 0 };
  Store.updateSection(SECTION_ID, {
    [currentDrill.id]: { completed: prev.completed + 1, bestScore: Math.max(prev.bestScore, xpData.correct) }
  });

  container.innerHTML = renderScore(results, currentDrill.name, xpData.totalXP);
  const actions = container.querySelector('.score-actions');
  if (actions) {
    actions.innerHTML = `
      <button class="btn btn-primary" data-action="ws-retry" data-id="${currentDrill.id}">Try again</button>
      <a class="btn btn-secondary" href="#/word-skills" data-action="ws-back-menu">All drills</a>
      <a class="btn btn-secondary" href="#/">Home</a>`;
  }
  if (window.__showXPToast) window.__showXPToast(`+${xpData.totalXP} XP`);
}

// ── Route handling ───────────────────────────────────────────────────────────

function routeFromHash() {
  const hash = location.hash.replace('#/', '').replace('#', '');
  const parts = hash.split('/');
  if (parts[0] !== SECTION_ID || !parts[1]) return { screen: 'menu' };
  return { screen: 'drill', id: parts[1] };
}

// ── Public init ──────────────────────────────────────────────────────────────

export async function init(container) {
  container.innerHTML = `<div class="quiz-header"><a class="quiz-back" href="#/">←</a><span class="quiz-title">Word Skills</span></div><div class="section-home"><p>Loading…</p></div>`;
  await loadData();

  const route = routeFromHash();
  const drill = route.screen === 'drill' ? drillById(route.id) : null;
  if (drill && bank[drill.key] && bank[drill.key].length) {
    startDrill(container, drill);
  } else {
    renderMenu(container);
  }

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'ws-open') {
      e.preventDefault();
      const d = drillById(el.dataset.id);
      if (!d) return;
      location.hash = `#/word-skills/${d.id}`;
      startDrill(container, d);
    }
    if (action === 'ws-back-menu') {
      e.preventDefault();
      location.hash = '#/word-skills';
      renderMenu(container);
    }
    if (action === 'ws-answer') {
      handleAnswer(container, parseInt(el.dataset.index, 10));
    }
    if (action === 'ws-next') {
      advance(container);
    }
    if (action === 'ws-retry') {
      const d = drillById(el.dataset.id);
      if (d) startDrill(container, d);
    }
  };

  container.removeEventListener('click', container._wsHandler);
  container._wsHandler = handler;
  container.addEventListener('click', handler);

  const hashHandler = () => {
    const hash = location.hash.replace('#/', '').replace('#', '');
    if (!hash.startsWith(SECTION_ID)) {
      container.removeEventListener('click', container._wsHandler);
      window.removeEventListener('hashchange', hashHandler);
    }
  };
  window.removeEventListener('hashchange', container._wsHashHandler);
  container._wsHashHandler = hashHandler;
  window.addEventListener('hashchange', hashHandler);
}

export default init;
