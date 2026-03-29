// ── VOCABULARY QUIZ SECTION ────────────────────────────────────────────────
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderHeader, renderQuizProgress, renderScore } from '../ui.js';

const QUIZ_LENGTH = 10;
const DATA_URL = 'data/vocabulary.json';

let allWords = [];
let quizQueue = [];
let currentIndex = 0;
let results = [];
let consecutiveCorrect = 0;
let answered = false;
let selectedBook = '';

/** Fetch the vocabulary data (cached after first load). */
async function loadData() {
  if (allWords.length) return allWords;
  const res = await fetch(DATA_URL);
  allWords = await res.json();
  return allWords;
}

/** Get unique book names from the data. */
function getBooks() {
  const set = new Set(allWords.map((w) => w.book));
  return [...set].sort();
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

/** Build a quiz queue of {stem, options, answer} objects. */
function buildQuiz(words) {
  return words.map((w) => {
    const qt = w.questionTypes[Math.floor(Math.random() * w.questionTypes.length)];
    return { word: w.word, stem: qt.stem, options: qt.options, answer: qt.answer };
  });
}

// ── Rendering ──────────────────────────────────────────────────────────────

/** Section landing / home page. */
function renderHome(container) {
  const state = Store.get();
  const sec = state.sections.vocabulary || { completed: 0, correct: 0, total: 0 };
  const pct = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;

  const books = getBooks();
  const bookOptions = books.map((b) =>
    `<option value="${b}" ${selectedBook === b ? 'selected' : ''}>${b}</option>`
  ).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Vocabulary</span>
    </div>
    <div class="section-home">
      <div class="section-home-icon">\u{1F4DA}</div>
      <h2>Vocabulary Quiz</h2>
      <p>Test your knowledge of words from your reading books.</p>

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

      <label class="filter-label" for="vocab-book-filter">Filter by book</label>
      <select id="vocab-book-filter" class="book-filter" data-action="filter-book">
        <option value="">All books</option>
        ${bookOptions}
      </select>

      <button class="btn btn-primary start-btn" data-action="start-vocab">Start Practice</button>
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
      <a class="quiz-back" href="#/vocabulary" data-action="back-to-section">\u2190</a>
      <span class="quiz-title">Vocabulary</span>
      <span class="quiz-counter">${currentIndex + 1}/${QUIZ_LENGTH}</span>
    </div>
    ${renderQuizProgress(currentIndex, QUIZ_LENGTH, results)}
    <div class="question-area">
      <p class="question-word">${q.word}</p>
      <p class="question-text">${q.stem}</p>
    </div>
    <div class="options-grid">${optionBtns}</div>`;
}

/** Show the end-of-quiz score. */
function renderScoreScreen(container) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);

  const sec = Store.get().sections.vocabulary || { completed: 0, correct: 0, total: 0 };
  Store.updateSection('vocabulary', {
    completed: sec.completed + 1,
    correct: sec.correct + xpData.correct,
    total: sec.total + xpData.total
  });

  container.innerHTML = renderScore(results, 'Vocabulary', xpData.totalXP);

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
  const delay = isCorrect ? 800 : 1500;
  setTimeout(() => {
    currentIndex++;
    answered = false;
    if (currentIndex >= QUIZ_LENGTH) {
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

    if (action === 'filter-book') {
      selectedBook = el.value;
    }

    if (action === 'start-vocab') {
      const pool = selectedBook
        ? allWords.filter((w) => w.book === selectedBook)
        : allWords;

      if (pool.length < QUIZ_LENGTH) {
        quizQueue = buildQuiz(pickRandom(pool, pool.length));
      } else {
        quizQueue = buildQuiz(pickRandom(pool, QUIZ_LENGTH));
      }

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
  container.removeEventListener('click', container._vocabHandler);
  container._vocabHandler = handler;
  container.addEventListener('click', handler);

  // Also listen for select change
  container.removeEventListener('change', container._vocabChangeHandler);
  const changeHandler = (e) => {
    if (e.target.dataset.action === 'filter-book') {
      selectedBook = e.target.value;
    }
  };
  container._vocabChangeHandler = changeHandler;
  container.addEventListener('change', changeHandler);
}

export default init;
