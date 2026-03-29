// ── SPELLING QUIZ SECTION ──────────────────────────────────────────────────
// "Look, Cover, Write, Check" method
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderQuizProgress, renderScore } from '../ui.js';

const QUIZ_LENGTH = 10;
const DATA_URL = 'data/spelling.json';
const LOOK_TIME = 4000; // ms to show the word before hiding

let allWords = [];
let quizQueue = [];
let currentIndex = 0;
let results = [];
let attempt = 0;       // 0 = first, 1 = second (after seeing it again)
let phase = 'look';    // look | cover | check | retry-look | retry-cover
let selectedBook = '';
let countdownTimer = null;

async function loadData() {
  if (allWords.length) return allWords;
  const res = await fetch(DATA_URL);
  allWords = await res.json();
  return allWords;
}

function getBooks() {
  const set = new Set(allWords.map((w) => w.book));
  return [...set].sort();
}

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
      <p>Look at the word carefully, then write it from memory.<br><strong>Look. Cover. Write. Check.</strong></p>

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

/** LOOK phase: show the word, definition, and a countdown */
function renderLook(container, isRetry) {
  if (countdownTimer) clearInterval(countdownTimer);

  const q = quizQueue[currentIndex];
  const label = isRetry ? 'Look again carefully!' : 'Study this word';
  const time = isRetry ? 5 : 4;
  let remaining = time;

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/spelling" data-action="back-to-section">\u2190</a>
      <span class="quiz-title">Spelling</span>
      <span class="quiz-counter">${currentIndex + 1}/${QUIZ_LENGTH}</span>
    </div>
    ${renderQuizProgress(currentIndex, QUIZ_LENGTH, results)}
    <div class="question-area">
      <p class="spelling-phase-label">${label}</p>
      <p class="spelling-show-word">${q.word}</p>
      <p class="spelling-definition">${q.definition}</p>
      <div class="spelling-countdown">
        <div class="countdown-bar" id="countdown-bar"></div>
      </div>
      <p class="spelling-timer-text" id="countdown-text">${remaining}s</p>
      <button class="btn btn-secondary" data-action="ready-early">I'm ready</button>
    </div>`;

  const bar = container.querySelector('#countdown-bar');
  const text = container.querySelector('#countdown-text');

  // Animate countdown
  if (bar) bar.style.width = '100%';
  const startTime = Date.now();
  const totalMs = time * 1000;

  countdownTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const pct = Math.max(0, 1 - elapsed / totalMs);
    if (bar) bar.style.width = `${pct * 100}%`;
    remaining = Math.ceil((totalMs - elapsed) / 1000);
    if (text) text.textContent = `${Math.max(0, remaining)}s`;

    if (elapsed >= totalMs) {
      clearInterval(countdownTimer);
      renderCover(container);
    }
  }, 100);
}

/** COVER phase: word is hidden, type it from memory */
function renderCover(container) {
  if (countdownTimer) clearInterval(countdownTimer);

  const q = quizQueue[currentIndex];
  const isRetry = attempt > 0;
  const label = isRetry ? 'Try again! Type the word:' : 'Now spell it from memory:';
  const letterCount = q.word.length;

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/spelling" data-action="back-to-section">\u2190</a>
      <span class="quiz-title">Spelling</span>
      <span class="quiz-counter">${currentIndex + 1}/${QUIZ_LENGTH}</span>
    </div>
    ${renderQuizProgress(currentIndex, QUIZ_LENGTH, results)}
    <div class="question-area">
      <p class="spelling-phase-label">${label}</p>
      <p class="spelling-definition">${q.definition}</p>
      <p class="spelling-letter-count">${letterCount} letters</p>
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

  setTimeout(() => {
    const input = container.querySelector('#spelling-answer');
    if (input) input.focus();
  }, 50);
}

/** CHECK: compare the answer */
function checkSpelling(container) {
  const q = quizQueue[currentIndex];
  const input = container.querySelector('#spelling-answer');
  const feedback = container.querySelector('.spelling-feedback');
  const guess = (input.value || '').trim();
  const state = Store.get();

  if (!guess) {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
    return;
  }

  const isCorrect = guess.toLowerCase() === q.word.toLowerCase();

  if (isCorrect) {
    // Correct!
    if (attempt === 0) results.push(true);  // first-time correct
    input.classList.add('input-correct');
    feedback.innerHTML = `<p class="feedback-correct">\u2705 Correct! Well done.</p>`;
    if (state.settings.soundOn) playSound(true);

    setTimeout(() => advance(container), 1200);

  } else if (attempt === 0) {
    // Wrong on first attempt - show the word again
    results.push(false);
    attempt = 1;
    if (state.settings.soundOn) playSound(false);

    input.classList.add('input-wrong');
    feedback.innerHTML = `
      <p class="feedback-wrong">Not quite. The correct spelling is:</p>
      <p class="spelling-show-word spelling-show-word--correction">${q.word}</p>
      <p class="feedback-try-again">Look carefully, then you'll get another go.</p>
      <button class="btn btn-secondary" data-action="retry-look">Show me again</button>`;

  } else {
    // Wrong on second attempt - show answer and move on
    if (state.settings.soundOn) playSound(false);
    input.classList.add('input-wrong');
    feedback.innerHTML = `
      <p class="feedback-wrong">The correct spelling is:</p>
      <p class="spelling-show-word spelling-show-word--correction">${q.word}</p>
      <p class="feedback-try-again">Keep practising this one!</p>`;

    setTimeout(() => advance(container), 3000);
  }
}

function advance(container) {
  currentIndex++;
  attempt = 0;
  if (currentIndex >= QUIZ_LENGTH) {
    renderScoreScreen(container);
  } else {
    renderLook(container, false);
  }
}

function renderScoreScreen(container) {
  if (countdownTimer) clearInterval(countdownTimer);

  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz('spelling', xpData.correct, xpData.total, xpData.totalXP);

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
  attempt = 0;
  phase = 'look';
  if (countdownTimer) clearInterval(countdownTimer);

  renderHome(container);

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'start-spelling') {
      const pool = selectedBook
        ? allWords.filter((w) => w.book === selectedBook)
        : allWords;
      const count = Math.min(QUIZ_LENGTH, pool.length);
      quizQueue = pickRandom(pool, count);
      currentIndex = 0;
      results = [];
      attempt = 0;
      renderLook(container, false);
    }

    if (action === 'ready-early') {
      renderCover(container);
    }

    if (action === 'check-spelling') {
      checkSpelling(container);
    }

    if (action === 'retry-look') {
      renderLook(container, true);
    }

    if (action === 'retry') {
      init(container);
    }

    if (action === 'back-to-section') {
      e.preventDefault();
      if (countdownTimer) clearInterval(countdownTimer);
      renderHome(container);
    }
  };

  container.removeEventListener('click', container._spellingHandler);
  container._spellingHandler = handler;
  container.addEventListener('click', handler);

  container.removeEventListener('keydown', container._spellingKeyHandler);
  const keyHandler = (e) => {
    if (e.key === 'Enter' && e.target.id === 'spelling-answer') {
      checkSpelling(container);
    }
  };
  container._spellingKeyHandler = keyHandler;
  container.addEventListener('keydown', keyHandler);

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
