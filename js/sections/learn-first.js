// ── LEARN FIRST: Vocabulary teaching mode ──────────────────────────────────
// Teach Jacob the words BEFORE asking questions. ASD-aware design.
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { renderScore } from '../ui.js';

const DATA_URL = 'data/vocab-lessons.json';
const PROGRESS_KEY = 'learn-first';

let lessonsData = null;
let currentLesson = null;
let cardIndex = 0;
let checkIndex = 0;
let checkResults = [];
let checkAnswered = false;

/** Fetch the lesson data (cached). */
async function loadData() {
  if (lessonsData) return lessonsData;
  const res = await fetch(DATA_URL);
  lessonsData = await res.json();
  return lessonsData;
}

/** Get completed lesson ids from the store. */
function getCompleted() {
  const state = Store.get();
  const sec = state.sections[PROGRESS_KEY] || {};
  return sec.completedLessons || [];
}

/** Mark a lesson complete. */
function markComplete(lessonId, correct, total) {
  const state = Store.get();
  if (!state.sections[PROGRESS_KEY]) {
    state.sections[PROGRESS_KEY] = { completed: 0, correct: 0, total: 0, completedLessons: [] };
  }
  const sec = state.sections[PROGRESS_KEY];
  if (!sec.completedLessons) sec.completedLessons = [];
  if (!sec.completedLessons.includes(lessonId)) {
    sec.completedLessons.push(lessonId);
  }
  sec.completed = (sec.completed || 0) + 1;
  sec.correct = (sec.correct || 0) + correct;
  sec.total = (sec.total || 0) + total;
  Store.save(state);
}

// ── Rendering ──────────────────────────────────────────────────────────────

/** Lesson menu home. */
function renderMenu(container) {
  const completed = getCompleted();
  const lessons = lessonsData.lessons;

  const lessonCards = lessons.map((lesson) => {
    const isDone = completed.includes(lesson.id);
    const doneClass = isDone ? 'learn-lesson-card--done' : '';
    const tick = isDone ? '<span class="learn-tick">\u2713</span>' : '';
    const firstEmoji = lesson.words[0].emoji;
    return `
      <a class="learn-lesson-card ${doneClass}" href="#/learn-first/${lesson.id}" data-action="open-lesson" data-lesson="${lesson.id}">
        <span class="learn-lesson-emoji">${firstEmoji}</span>
        <span class="learn-lesson-title">${lesson.title}</span>
        <span class="learn-lesson-theme">${lesson.theme}</span>
        ${tick}
      </a>`;
  }).join('');

  const doneCount = completed.length;
  const totalCount = lessons.length;

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Learn New Words</span>
    </div>
    <div class="learn-home">
      <div class="learn-home-icon">\u{1F4D6}</div>
      <h2 class="learn-home-heading">Learn First, Practise Later</h2>
      <p class="learn-home-intro">Five new words. Read each card. Then a quick check.</p>
      <div class="learn-home-progress">
        <strong>${doneCount}</strong> of ${totalCount} lessons done
      </div>
      <div class="learn-lesson-grid">${lessonCards}</div>
    </div>`;
}

/** Render one teaching card. */
function renderCard(container) {
  const lesson = currentLesson;
  const word = lesson.words[cardIndex];
  const total = lesson.words.length;

  const dots = [];
  for (let i = 0; i < total; i++) {
    const cls = i < cardIndex ? 'done' : i === cardIndex ? 'current' : '';
    dots.push(`<div class="lesson-progress-dot ${cls}"></div>`);
  }

  const synPills = word.synonyms.map((s) => `<span class="pill pill-syn">${s}</span>`).join('');
  const antPills = word.antonyms.map((a) => `<span class="pill pill-ant">${a}</span>`).join('');
  const famPills = word.family.map((f) => `<span class="pill pill-fam">${f}</span>`).join('');

  const isLast = cardIndex === total - 1;
  const nextLabel = isLast ? 'Start Quick Check \u2192' : 'Next Word \u2192';
  const prevBtn = cardIndex > 0
    ? `<button class="btn btn-secondary" data-action="prev-card">\u2190 Back</button>`
    : `<span></span>`;

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/learn-first" data-action="back-to-menu">\u2190</a>
      <span class="quiz-title">${lesson.title}</span>
      <span class="quiz-counter">${cardIndex + 1}/${total}</span>
    </div>
    <div class="lesson-progress-dots">${dots.join('')}</div>
    <div class="lesson-card">
      <div class="word-emoji">${word.emoji}</div>
      <h2 class="word-title">${word.word}</h2>
      <p class="word-syllables">${word.syllables}</p>
      <p class="word-definition">${word.definition}</p>
      <p class="word-example">"${word.example}"</p>
      <div class="word-think">
        <span class="word-think-label">Think of it like</span>
        ${word.thinkOfIt}
      </div>
      <div class="word-pills-row">
        <div class="word-pills-group">
          <span class="word-pills-label">Similar</span>
          <div class="word-family-pills">${synPills}</div>
        </div>
        <div class="word-pills-group">
          <span class="word-pills-label">Opposite</span>
          <div class="word-family-pills">${antPills}</div>
        </div>
        <div class="word-pills-group">
          <span class="word-pills-label">Word family</span>
          <div class="word-family-pills">${famPills}</div>
        </div>
      </div>
    </div>
    <div class="lesson-card-actions">
      ${prevBtn}
      <button class="btn btn-primary" data-action="next-card">${nextLabel}</button>
    </div>`;
}

/** Render a quick-check question. */
function renderCheck(container) {
  const lesson = currentLesson;
  const q = lesson.quickCheck[checkIndex];
  const total = lesson.quickCheck.length;

  const optionBtns = q.options.map((opt, i) =>
    `<button class="option-btn" data-action="check-answer" data-index="${i}">${opt}</button>`
  ).join('');

  const dots = [];
  for (let i = 0; i < total; i++) {
    let cls = '';
    if (i < checkResults.length) cls = checkResults[i] ? 'correct' : 'wrong';
    else if (i === checkIndex) cls = 'current';
    dots.push(`<div class="quiz-progress-dot ${cls}"></div>`);
  }

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/learn-first" data-action="back-to-menu">\u2190</a>
      <span class="quiz-title">Quick Check</span>
      <span class="quiz-counter">${checkIndex + 1}/${total}</span>
    </div>
    <div class="quiz-progress-bar">${dots.join('')}</div>
    <div class="question-area">
      <p class="question-text">${q.question}</p>
    </div>
    <div class="options-grid">${optionBtns}</div>`;
}

/** End screen. */
function renderComplete(container) {
  const lesson = currentLesson;
  const correct = checkResults.filter(Boolean).length;
  const total = checkResults.length;

  // Award XP: 10 per correct + 30 bonus for finishing
  const xpEarned = correct * 10 + 30;
  Store.addXP(xpEarned);
  Store.recordQuiz('learn-first', correct, total, xpEarned, lesson.id);
  markComplete(lesson.id, correct, total);

  let title = 'Great remembering!';
  let emoji = '\uD83D\uDC4D';
  if (correct === total) { title = 'Perfect! All five!'; emoji = '\uD83C\uDF1F'; }
  else if (correct === 4) { title = 'Brilliant! Four out of five!'; emoji = '\uD83C\uDF89'; }
  else if (correct === 3) { title = 'Good job! Three out of five!'; emoji = '\uD83D\uDCAA'; }

  // Words to review (those they got wrong)
  const reviewWords = [];
  lesson.quickCheck.forEach((q, i) => {
    if (!checkResults[i]) {
      const wordName = q.options[q.correct];
      const wordObj = lesson.words.find((w) => w.word === wordName);
      if (wordObj) reviewWords.push(wordObj);
    }
  });

  const wordsList = lesson.words.map((w) =>
    `<div class="learn-word-summary">
      <span class="learn-word-summary-emoji">${w.emoji}</span>
      <div class="learn-word-summary-text">
        <strong>${w.word}</strong>
        <span>${w.definition}</span>
      </div>
    </div>`
  ).join('');

  const reviewSection = reviewWords.length > 0
    ? `<div class="learn-review-box">
        <h3>Words to review</h3>
        <p>These are the ones to have another look at later.</p>
        ${reviewWords.map((w) =>
          `<div class="learn-review-item"><span>${w.emoji}</span> <strong>${w.word}</strong>: ${w.definition}</div>`
        ).join('')}
      </div>`
    : '';

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/learn-first" data-action="back-to-menu">\u2190</a>
      <span class="quiz-title">Lesson Complete</span>
    </div>
    <div class="learn-complete">
      <div class="learn-complete-emoji">${emoji}</div>
      <h2 class="learn-complete-title">${title}</h2>
      <p class="learn-complete-score">You got ${correct} out of ${total} right</p>
      <p class="learn-complete-xp">+${xpEarned} XP earned</p>
      <h3 class="learn-complete-subhead">You learned 5 new words! \uD83C\uDF89</h3>
      <div class="learn-words-list">${wordsList}</div>
      ${reviewSection}
      <div class="learn-complete-actions">
        <button class="btn btn-secondary" data-action="review-cards">Review cards again</button>
        <a class="btn btn-primary" href="#/learn-first" data-action="back-to-menu">Back to lessons</a>
      </div>
    </div>`;
}

// ── Flow logic ─────────────────────────────────────────────────────────────

function startLesson(container, lessonId) {
  const lesson = lessonsData.lessons.find((l) => l.id === lessonId);
  if (!lesson) { renderMenu(container); return; }
  currentLesson = lesson;
  cardIndex = 0;
  checkIndex = 0;
  checkResults = [];
  checkAnswered = false;
  renderCard(container);
}

function nextCard(container) {
  if (cardIndex < currentLesson.words.length - 1) {
    cardIndex++;
    renderCard(container);
  } else {
    // Start quick check
    checkIndex = 0;
    checkResults = [];
    checkAnswered = false;
    renderCheck(container);
  }
}

function prevCard(container) {
  if (cardIndex > 0) {
    cardIndex--;
    renderCard(container);
  }
}

function handleCheckAnswer(container, idx) {
  if (checkAnswered) return;
  checkAnswered = true;

  const q = currentLesson.quickCheck[checkIndex];
  const isCorrect = idx === q.correct;
  checkResults.push(isCorrect);

  const buttons = container.querySelectorAll('.option-btn');
  const state = Store.get();

  if (isCorrect) {
    buttons[idx].classList.add('correct');
    if (state.settings.soundOn) playSound(true);
  } else {
    buttons[idx].classList.add('wrong');
    buttons[q.correct].classList.add('correct');
    if (state.settings.soundOn) playSound(false);
  }

  const delay = isCorrect ? 900 : 1600;
  setTimeout(() => {
    checkIndex++;
    checkAnswered = false;
    if (checkIndex >= currentLesson.quickCheck.length) {
      renderComplete(container);
    } else {
      renderCheck(container);
    }
  }, delay);
}

// ── Public init ────────────────────────────────────────────────────────────

export async function init(container) {
  await loadData();

  // Check route for a specific lesson id
  const hash = location.hash.replace('#/', '');
  const parts = hash.split('/');
  const lessonId = parts[1];

  if (lessonId) {
    startLesson(container, lessonId);
  } else {
    renderMenu(container);
  }

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'open-lesson') {
      e.preventDefault();
      const id = el.dataset.lesson;
      location.hash = `#/learn-first/${id}`;
    }

    if (action === 'next-card') {
      nextCard(container);
    }

    if (action === 'prev-card') {
      prevCard(container);
    }

    if (action === 'check-answer') {
      const idx = parseInt(el.dataset.index, 10);
      handleCheckAnswer(container, idx);
    }

    if (action === 'review-cards') {
      cardIndex = 0;
      renderCard(container);
    }

    if (action === 'back-to-menu') {
      e.preventDefault();
      location.hash = '#/learn-first';
    }
  };

  container.removeEventListener('click', container._learnFirstHandler);
  container._learnFirstHandler = handler;
  container.addEventListener('click', handler);
}

export default init;
