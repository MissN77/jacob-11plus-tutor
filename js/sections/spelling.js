// ── SPELLING QUIZ SECTION ──────────────────────────────────────────────────
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderQuizProgress, renderScore } from '../ui.js';

const QUIZ_LENGTH = 10;
const DATA_URL = 'data/spelling.json';

let allWords = [];
let quizQueue = [];
let currentIndex = 0;
let results = [];        // true = got it right first time
let firstAttempt = true;
let answered = false;
let selectedBook = '';

/** Fetch the spelling data (cached after first load). */
async function loadData() {
  if (allWords.length) return allWords;
  const res = await fetch(DATA_URL);
  allWords = await res.json();
  return allWords;
}

/** Get unique book names. */
function getBooks() {
  const set = new Set(allWords.map((w) => w.book));
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
  const sec = state.sections.spelling || { completed: 0, correct: 0, total: 0 };
  const pct = sec.total > 0 ? Math.round((sec.correct / sec.total) * 100) : 0;

  const books = getBooks();
  const bookOptions = books.map((b) =>
    `<option value="${b}" ${selectedBook === b ? 'selected' : ''}>${b}</option>`
  ).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Spelling</span>
    </div>
    <div class="section-home">
      <div class="section-home-icon">\u{270F}\uFE0F</div>
      <h2>Spelling Practice</h2>
      <p>Read the definition and hint, then spell the word correctly.</p>

      <div class="section-stats">
        <div class="stat-card">
          <div class="stat-value">${sec.completed}</div>
          <div class="stat-label">Quizzes done</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${pct}%</div>
          <div class="stat-label">First-time accuracy</div>
        </div>
      </div>

      <label class="filter-label" for="spell-book-filter">Filter by book</label>
      <select id="spell-book-filter" class="book-filter" data-action="filter-book">
        <option value="">All books</option>
        ${bookOptions}
      </select>

      <button class="btn btn-primary start-btn" data-action="start-spelling">Start Practice</button>
    </div>`;
}

/** Render the current spelling question. */
function renderQuestion(container) {
  const q = quizQueue[currentIndex];

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/spelling" data-action="back-to-section">\u2190</a>
      <span class="quiz-title">Spelling</span>
      <span class="quiz-counter">${currentIndex + 1}/${QUIZ_LENGTH}</span>
    </div>
    ${renderQuizProgress(currentIndex, QUIZ_LENGTH, results)}
    <div class="question-area">
      <p class="spelling-definition">${q.definition}</p>
      <p class="spelling-hint">${q.hint}</p>
    </div>
    <div class="spelling-input-area">
      <input type="text"
             class="spelling-input"
             id="spelling-answer"
             placeholder="Type the word..."
             autocomplete="off"
             autocapitalize="none"
             spellcheck="false" />
      <button class="btn btn-primary" data-action="check-spelling">Check</button>
    </div>
    <div class="spelling-feedback"></div>`;

  // Focus the input
  setTimeout(() => {
    const input = container.querySelector('#spelling-answer');
    if (input) input.focus();
  }, 50);
}

/** Handle the spelling check. */
function checkSpelling(container) {
  if (answered) return;

  const q = quizQueue[currentIndex];
  const input = container.querySelector('#spelling-answer');
  const feedback = container.querySelector('.spelling-feedback');
  const guess = (input.value || '').trim();

  if (!guess) {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
    return;
  }

  const isCorrect = guess.toLowerCase() === q.word.toLowerCase();
  const state = Store.get();

  if (isCorrect) {
    answered = true;
    if (firstAttempt) {
      results.push(true);
    }
    input.classList.add('input-correct');
    feedback.innerHTML = `<p class="feedback-correct">Correct!</p>`;
    if (state.settings.soundOn) playSound(true);

    setTimeout(() => {
      currentIndex++;
      firstAttempt = true;
      answered = false;
      if (currentIndex >= QUIZ_LENGTH) {
        renderScoreScreen(container);
      } else {
        renderQuestion(container);
      }
    }, 1000);
  } else {
    if (firstAttempt) {
      results.push(false);
      firstAttempt = false;
    }
    if (state.settings.soundOn) playSound(false);

    input.classList.add('input-wrong');
    feedback.innerHTML = `
      <p class="feedback-wrong">Not quite. The correct spelling is: <strong>${q.word}</strong></p>
      <p class="feedback-try-again">Have another go!</p>`;

    // Clear the input for another attempt
    setTimeout(() => {
      input.value = '';
      input.classList.remove('input-wrong');
      input.focus();
    }, 2000);
  }
}

function renderScoreScreen(container) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);

  const sec = Store.get().sections.spelling || { completed: 0, correct: 0, total: 0 };
  Store.updateSection('spelling', {
    completed: sec.completed + 1,
    correct: sec.correct + xpData.correct,
    total: sec.total + xpData.total
  });

  container.innerHTML = renderScore(results, 'Spelling', xpData.totalXP);

  if (window.__showXPToast) {
    window.__showXPToast(`+${xpData.totalXP} XP`);
  }
}

// ── Public init ────────────────────────────────────────────────────────────

export async function init(container) {
  await loadData();

  currentIndex = 0;
  results = [];
  firstAttempt = true;
  answered = false;

  renderHome(container);

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;

    if (action === 'filter-book') {
      selectedBook = el.value;
    }

    if (action === 'start-spelling') {
      const pool = selectedBook
        ? allWords.filter((w) => w.book === selectedBook)
        : allWords;

      const count = Math.min(QUIZ_LENGTH, pool.length);
      quizQueue = pickRandom(pool, count);

      currentIndex = 0;
      results = [];
      firstAttempt = true;
      answered = false;
      renderQuestion(container);
    }

    if (action === 'check-spelling') {
      checkSpelling(container);
    }

    if (action === 'retry') {
      init(container);
    }

    if (action === 'back-to-section') {
      e.preventDefault();
      renderHome(container);
    }
  };

  container.removeEventListener('click', container._spellingHandler);
  container._spellingHandler = handler;
  container.addEventListener('click', handler);

  // Handle Enter key in spelling input
  container.removeEventListener('keydown', container._spellingKeyHandler);
  const keyHandler = (e) => {
    if (e.key === 'Enter' && e.target.id === 'spelling-answer') {
      checkSpelling(container);
    }
  };
  container._spellingKeyHandler = keyHandler;
  container.addEventListener('keydown', keyHandler);

  // Handle select change
  container.removeEventListener('change', container._spellingChangeHandler);
  const changeHandler = (e) => {
    if (e.target.dataset.action === 'filter-book') {
      selectedBook = e.target.value;
    }
  };
  container._spellingChangeHandler = changeHandler;
  container.addEventListener('change', changeHandler);
}

export default init;
