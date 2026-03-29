import { xpPercent, xpInCurrentLevel } from './xp.js';

const XP_PER_LEVEL = 200;

const SECTIONS = [
  { id: 'vocabulary',          name: 'Vocabulary',           icon: '\u{1F4DA}' },
  { id: 'inference',           name: 'Inference',            icon: '\u{1F50D}' },
  { id: 'spelling',            name: 'Spelling',             icon: '\u{270F}\uFE0F' },
  { id: 'punctuation',         name: 'Punctuation',          icon: '.,!?' },
  { id: 'sentence-completion', name: 'Sentence Completion',  icon: '\u{1F4DD}' },
  { id: 'verbal-reasoning',    name: 'Verbal Reasoning',     icon: '\u{1F524}' },
  { id: 'maths',               name: 'Maths',                icon: '\u{1F522}' },
  { id: 'nvr',                 name: 'NVR',                  icon: '\u{1F532}' },
  { id: 'writing',             name: 'Writing',              icon: '\u{270D}\uFE0F' }
];

export { SECTIONS };

/** Render the sticky header with XP bar, level badge, and streak. */
export function renderHeader(state) {
  const pct = xpPercent(state.xp);
  const xpInLevel = xpInCurrentLevel(state.xp);
  const streak = state.streak.current || 0;

  return `
    <div class="header">
      <div class="level-badge" title="Level ${state.level}">${state.level}</div>
      <div class="xp-wrap">
        <span class="xp-label">${xpInLevel} / ${XP_PER_LEVEL} XP</span>
        <div class="xp-bar-bg">
          <div class="xp-bar-fill" style="width: ${pct}%"></div>
        </div>
      </div>
      <div class="streak-badge" title="${streak} day streak">
        <span class="streak-icon">\u{1F525}</span>
        <span>${streak}</span>
      </div>
    </div>`;
}

/** Render the 9-section home grid. */
export function renderHome(state) {
  const cards = SECTIONS.map((sec) => {
    const data = state.sections[sec.id] || { completed: 0, correct: 0, total: 0 };
    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

    return `
      <a class="section-card" href="#/${sec.id}" data-section="${sec.id}">
        <span class="card-icon">${sec.icon}</span>
        <span class="card-name">${sec.name}</span>
        <div class="card-progress-bg">
          <div class="card-progress-fill" style="width: ${pct}%"></div>
        </div>
        <span class="card-count">${data.completed || 0} completed</span>
      </a>`;
  }).join('');

  return `
    ${renderHeader(state)}
    <h1 class="app-title">Jacob's 11 Plus Tutor</h1>
    <p class="app-subtitle">Choose a subject to practise</p>
    <div class="section-grid">${cards}</div>`;
}

/** Progress dots for a quiz (coloured by result). */
export function renderQuizProgress(current, total, results) {
  const dots = [];
  for (let i = 0; i < total; i++) {
    let cls = '';
    if (i < results.length) {
      cls = results[i] ? 'correct' : 'wrong';
    } else if (i === current) {
      cls = 'current';
    }
    dots.push(`<div class="quiz-progress-dot ${cls}"></div>`);
  }
  return `<div class="quiz-progress-bar">${dots.join('')}</div>`;
}

/** Standard multiple-choice question layout. */
export function renderQuizQuestion(question, options, questionIndex, totalQuestions, results) {
  const optionBtns = options.map((opt, i) =>
    `<button class="option-btn" data-action="answer" data-index="${i}">${opt}</button>`
  ).join('');

  return `
    ${renderQuizProgress(questionIndex, totalQuestions, results)}
    <div class="question-area">
      <p class="question-text">${question}</p>
    </div>
    <div class="options-grid">${optionBtns}</div>`;
}

/** End-of-quiz score screen. */
export function renderScore(results, sectionName, xpEarned) {
  const correct = results.filter(Boolean).length;
  const total = results.length;
  const pct = Math.round((correct / total) * 100);

  let emoji = '\u{1F44D}';
  let title = 'Good effort!';
  if (pct === 100) { emoji = '\u{1F31F}'; title = 'Perfect score!'; }
  else if (pct >= 80) { emoji = '\u{1F389}'; title = 'Brilliant work!'; }
  else if (pct >= 60) { emoji = '\u{1F4AA}'; title = 'Nice going!'; }
  else if (pct < 40) { emoji = '\u{1F4AD}'; title = 'Keep practising!'; }

  return `
    <div class="score-screen">
      <div class="score-emoji">${emoji}</div>
      <h2 class="score-title">${title}</h2>
      <p class="score-subtitle">${sectionName}</p>
      <div class="score-stats">
        <div class="stat-card">
          <div class="stat-value">${correct}/${total}</div>
          <div class="stat-label">Correct</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${pct}%</div>
          <div class="stat-label">Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-value xp">+${xpEarned}</div>
          <div class="stat-label">XP earned</div>
        </div>
      </div>
      <div class="score-actions">
        <button class="btn btn-primary" data-action="retry">Try again</button>
        <a class="btn btn-secondary" href="#/">Home</a>
      </div>
    </div>`;
}

/** Coming-soon placeholder for sections not yet built. */
export function renderComingSoon(sectionId) {
  const sec = SECTIONS.find((s) => s.id === sectionId) || { icon: '\u{1F6A7}', name: sectionId };
  return `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">${sec.name}</span>
    </div>
    <div class="coming-soon">
      <div class="cs-icon">${sec.icon}</div>
      <h2>${sec.name}</h2>
      <p>Coming soon! This section is being built.</p>
      <a class="btn btn-secondary" href="#/">Back to Home</a>
    </div>`;
}
