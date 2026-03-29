// ── INFERENCE QUIZ SECTION ─────────────────────────────────────────────────
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderQuizProgress, renderScore } from '../ui.js';

const QUIZ_LENGTH = 10;
const DATA_URL = 'data/inference.json';

let allQuestions = [];
let quizQueue = [];
let currentIndex = 0;
let results = [];
let consecutiveCorrect = 0;
let answered = false;
let selectedBook = '';

/** Fetch the inference data (cached after first load). */
async function loadData() {
  if (allQuestions.length) return allQuestions;
  const res = await fetch(DATA_URL);
  allQuestions = await res.json();
  return allQuestions;
}

/** Get unique book names. */
function getBooks() {
  const set = new Set(allQuestions.map((q) => q.book));
  return [...set].sort();
}

/** Pick n random items from an array. */
function pickRandom(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length) {
    const i = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(i, 1)[0]);
  }
  return out;
}

// ── Rendering ──────────────────────────────────────────────────────────────

/** Section landing page. */
function renderHome(container) {
  const state = Store.get();
  const sec = state.sections.inference || { completed: 0, correct: 0, total: 0 };
  const pct = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;

  const books = getBooks();
  const bookOptions = books.map((b) =>
    `<option value="${b}" ${selectedBook === b ? 'selected' : ''}>${b}</option>`
  ).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Inference</span>
    </div>
    <div class="section-home">
      <div class="section-home-icon">\u{1F50D}</div>
      <h2>Inference Questions</h2>
      <p>Read a passage and work out what the author really means.</p>

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

      <label class="filter-label" for="inf-book-filter">Filter by book</label>
      <select id="inf-book-filter" class="book-filter" data-action="filter-book">
        <option value="">All books</option>
        ${bookOptions}
      </select>

      <button class="btn btn-primary start-btn" data-action="start-inference">Start Practice</button>
    </div>`;
}

/** Render the current inference question. */
function renderQuestion(container) {
  const q = quizQueue[currentIndex];

  const optionBtns = q.options.map((opt, i) =>
    `<button class="option-btn" data-action="answer" data-index="${i}">${opt}</button>`
  ).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/inference" data-action="back-to-section">\u2190</a>
      <span class="quiz-title">Inference</span>
      <span class="quiz-counter">${currentIndex + 1}/${QUIZ_LENGTH}</span>
    </div>
    ${renderQuizProgress(currentIndex, QUIZ_LENGTH, results)}
    <div class="question-area">
      ${q.passage ? `<blockquote class="passage-box">${q.passage}</blockquote>` : ''}
      <p class="question-text">${q.question}</p>
    </div>
    <div class="options-grid options-grid--stacked">${optionBtns}</div>`;
}

/** Show explanation after answering. */
function showExplanation(container, q, isCorrect, chosenIdx) {
  const buttons = container.querySelectorAll('.option-btn');

  if (isCorrect) {
    buttons[chosenIdx].classList.add('correct');
  } else {
    buttons[chosenIdx].classList.add('wrong');
    buttons[q.answer].classList.add('correct');
  }

  // Show explanation if available
  if (q.explanation) {
    const questionArea = container.querySelector('.question-area');
    const explEl = document.createElement('div');
    explEl.className = 'explanation-box';
    explEl.innerHTML = `<strong>Explanation:</strong> ${q.explanation}`;
    questionArea.appendChild(explEl);
  }

  // Show next button
  const grid = container.querySelector('.options-grid');
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-primary next-btn';
  nextBtn.textContent = currentIndex + 1 >= QUIZ_LENGTH ? 'See results' : 'Next';
  nextBtn.dataset.action = 'next-question';
  grid.insertAdjacentElement('afterend', nextBtn);
}

// ── Quiz flow logic ────────────────────────────────────────────────────────

function handleAnswer(container, idx) {
  if (answered) return;
  answered = true;

  const q = quizQueue[currentIndex];
  const isCorrect = idx === q.answer;
  results.push(isCorrect);

  const state = Store.get();

  if (isCorrect) {
    consecutiveCorrect++;
    if (state.settings.soundOn) playSound(true);
  } else {
    consecutiveCorrect = 0;
    if (state.settings.soundOn) playSound(false);
  }

  showExplanation(container, q, isCorrect, idx);
}

function advanceQuestion(container) {
  currentIndex++;
  answered = false;

  if (currentIndex >= QUIZ_LENGTH) {
    renderScoreScreen(container);
  } else {
    renderQuestion(container);
  }
}

function renderScoreScreen(container) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz('inference', xpData.correct, xpData.total, xpData.totalXP);

  const sec = Store.get().sections.inference || { completed: 0, correct: 0, total: 0 };
  Store.updateSection('inference', {
    completed: sec.completed + 1,
    correct: sec.correct + xpData.correct,
    total: sec.total + xpData.total
  });

  container.innerHTML = renderScore(results, 'Inference', xpData.totalXP);

  if (window.__showXPToast) {
    window.__showXPToast(`+${xpData.totalXP} XP`);
  }
}

// ── Public init ────────────────────────────────────────────────────────────

export async function init(container) {
  await loadData();

  currentIndex = 0;
  results = [];
  consecutiveCorrect = 0;
  answered = false;

  renderHome(container);

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;

    if (action === 'filter-book') {
      selectedBook = el.value;
    }

    if (action === 'start-inference') {
      const pool = selectedBook
        ? allQuestions.filter((q) => q.book === selectedBook)
        : allQuestions;

      const count = Math.min(QUIZ_LENGTH, pool.length);
      quizQueue = pickRandom(pool, count);

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

    if (action === 'next-question') {
      advanceQuestion(container);
    }

    if (action === 'retry') {
      init(container);
    }

    if (action === 'back-to-section') {
      e.preventDefault();
      renderHome(container);
    }
  };

  container.removeEventListener('click', container._inferenceHandler);
  container._inferenceHandler = handler;
  container.addEventListener('click', handler);

  container.removeEventListener('change', container._inferenceChangeHandler);
  const changeHandler = (e) => {
    if (e.target.dataset.action === 'filter-book') {
      selectedBook = e.target.value;
    }
  };
  container._inferenceChangeHandler = changeHandler;
  container.addEventListener('change', changeHandler);
}

export default init;
