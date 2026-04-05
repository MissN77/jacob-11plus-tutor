// ── COLLOCATIONS QUIZ SECTION ─────────────────────────────────────────────
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderHeader, renderQuizProgress, renderScore } from '../ui.js';

const QUIZ_LENGTH = 10;
const DATA_URL = 'data/collocations.json';

let allCategories = [];
let quizQueue = [];
let currentIndex = 0;
let results = [];
let consecutiveCorrect = 0;
let answered = false;
let selectedCategory = '';

/** Fetch the collocations data (cached after first load). */
async function loadData() {
  if (allCategories.length) return allCategories;
  const res = await fetch(DATA_URL);
  allCategories = await res.json();
  return allCategories;
}

/** Pick n random items from an array (Fisher-Yates sample). */
function pickRandom(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

/** Build a quiz queue from question pools across categories. */
function buildQuiz(categories) {
  // Collect all questions, tagging each with its category
  const allQuestions = [];
  for (const cat of categories) {
    for (const q of cat.questions) {
      allQuestions.push({ ...q, category: cat.category });
    }
  }
  return pickRandom(allQuestions, QUIZ_LENGTH);
}

// ── Rendering ──────────────────────────────────────────────────────────────

/** Section landing / home page. */
function renderHome(container) {
  const state = Store.get();
  const sec = state.sections.collocations || { completed: 0, correct: 0, total: 0 };
  const pct = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;

  const catOptions = allCategories.map((c) =>
    `<option value="${c.category}" ${selectedCategory === c.category ? 'selected' : ''}>${c.category}</option>`
  ).join('');

  // Show a passage preview from the first (or selected) category
  const previewCat = selectedCategory
    ? allCategories.find((c) => c.category === selectedCategory)
    : allCategories[0];

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Collocations</span>
    </div>
    <div class="section-home">
      <div class="section-home-icon">\u{1F517}</div>
      <h2>Collocations</h2>
      <p>Word pairs that naturally go together. Spot the combination that sounds right in English.</p>

      <div class="section-stats">
        <div class="stat-card">
          <div class="stat-value">${sec.completed}</div>
          <div class="stat-label">Quizzes done</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${pct}%</div>
          <div class="stat-label">Accuracy</div>
        </div>
      </div>

      ${previewCat ? `
        <div class="passage-box">
          <p>${previewCat.passage}</p>
          <p style="margin-top:8px;font-size:0.8rem;color:var(--text-muted);font-style:normal;">\u2014 ${previewCat.source}</p>
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">Collocations: ${previewCat.collocations.map(c => `<strong>${c}</strong>`).join(', ')}</p>
      ` : ''}

      <label class="filter-label" for="colloc-cat-filter">Filter by type</label>
      <select id="colloc-cat-filter" class="book-filter" data-action="filter-category">
        <option value="">All types</option>
        ${catOptions}
      </select>

      <button class="btn btn-primary start-btn" data-action="start-colloc">Start Practice</button>
    </div>`;
}

/** Render the current question. */
function renderQuestion(container) {
  const q = quizQueue[currentIndex];

  const optionBtns = q.options.map((opt, i) =>
    `<button class="option-btn" data-action="answer" data-index="${i}">${opt}</button>`
  ).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/collocations" data-action="back-to-section">\u2190</a>
      <span class="quiz-title">Collocations</span>
      <span class="quiz-counter">${currentIndex + 1}/${quizQueue.length}</span>
    </div>
    ${renderQuizProgress(currentIndex, quizQueue.length, results)}
    <div class="question-area">
      <p class="question-text">${q.stem}</p>
      ${q.category ? `<p style="font-size:0.75rem;color:var(--text-muted);margin-top:8px;">${q.category}</p>` : ''}
    </div>
    <div class="options-grid">${optionBtns}</div>`;
}

/** Show the end-of-quiz score. */
function renderScoreScreen(container) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz('collocations', xpData.correct, xpData.total, xpData.totalXP);

  const sec = Store.get().sections.collocations || { completed: 0, correct: 0, total: 0 };
  Store.updateSection('collocations', {
    completed: sec.completed + 1,
    correct: sec.correct + xpData.correct,
    total: sec.total + xpData.total
  });

  container.innerHTML = renderScore(results, 'Collocations', xpData.totalXP);

  if (window.__showXPToast) {
    window.__showXPToast(`+${xpData.totalXP} XP`);
  }
}

// ── Quiz flow logic ────────────────────────────────────────────────────────

function handleAnswer(container, idx) {
  if (answered) return;
  answered = true;

  const q = quizQueue[currentIndex];
  const isCorrect = idx === q.answer;
  results.push(isCorrect);

  const buttons = container.querySelectorAll('.option-btn');
  const state = Store.get();

  if (isCorrect) {
    consecutiveCorrect++;
    buttons[idx].classList.add('correct');
    if (state.settings.soundOn) playSound(true);
  } else {
    consecutiveCorrect = 0;
    buttons[idx].classList.add('wrong');
    buttons[q.answer].classList.add('correct');
    if (state.settings.soundOn) playSound(false);
  }

  // Pause then advance
  const delay = isCorrect ? 2500 : 5000;
  setTimeout(() => {
    currentIndex++;
    answered = false;
    if (currentIndex >= quizQueue.length) {
      renderScoreScreen(container);
    } else {
      renderQuestion(container);
    }
  }, delay);
}

// ── Public init (called by app.js) ─────────────────────────────────────────

export async function init(container) {
  await loadData();

  // Reset quiz state
  currentIndex = 0;
  results = [];
  consecutiveCorrect = 0;
  answered = false;

  // Show the section home page
  renderHome(container);

  // Delegated event handling
  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;

    if (action === 'filter-category') {
      selectedCategory = el.value;
      // Update passage preview
      renderHome(container);
    }

    if (action === 'start-colloc') {
      const cats = selectedCategory
        ? allCategories.filter((c) => c.category === selectedCategory)
        : allCategories;

      quizQueue = buildQuiz(cats);

      currentIndex = 0;
      results = [];
      consecutiveCorrect = 0;
      answered = false;
      renderQuestion(container);
    }

    if (action === 'answer') {
      const idx = parseInt(el.dataset.index, 10);
      handleAnswer(container, idx);
    }

    if (action === 'retry') {
      init(container);
    }

    if (action === 'back-to-section') {
      e.preventDefault();
      renderHome(container);
    }
  };

  // Remove previous listener if re-initialised
  container.removeEventListener('click', container._collocHandler);
  container._collocHandler = handler;
  container.addEventListener('click', handler);

  // Also listen for select change
  container.removeEventListener('change', container._collocChangeHandler);
  const changeHandler = (e) => {
    if (e.target.dataset.action === 'filter-category') {
      selectedCategory = e.target.value;
      renderHome(container);
    }
  };
  container._collocChangeHandler = changeHandler;
  container.addEventListener('change', changeHandler);
}

export default init;
