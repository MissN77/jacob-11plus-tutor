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
  { id: 'writing',             name: 'Writing',              icon: '\u{270D}\uFE0F' },
  { id: 'collocations',        name: 'Collocations',         icon: '\u{1F517}' }
];

export { SECTIONS };

// ── GL Assessment Countdown ───────────────────────────────────────────────

const GL_DATE = new Date('2027-09-18T00:00:00');

/** Calculate days until GL Assessment. */
export function daysUntilGL() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = GL_DATE - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Get a motivational message based on days remaining. */
function glMessage(days) {
  if (days <= 0) return 'Good luck Jacob!';
  if (days < 50) return "Nearly there \u2014 you've got this!";
  if (days < 100) return 'Getting closer \u2014 stay focused!';
  if (days < 150) return "You're doing great \u2014 keep going!";
  return 'Plenty of time \u2014 keep building!';
}

/** Render the GL countdown banner. */
export function renderCountdown() {
  const days = daysUntilGL();
  const message = glMessage(days);
  const label = days <= 0 ? 'GL Assessment day!' : `day${days === 1 ? '' : 's'} until GL Assessment`;

  return `
    <div class="countdown-banner">
      <div class="countdown-days">${Math.max(days, 0)}</div>
      <div class="countdown-label">${label}</div>
      <div class="countdown-message">${message}</div>
    </div>`;
}

// ── Weekly Study Plan ─────────────────────────────────────────────────────

const WEEKLY_PLAN = [
  { sections: ['vocabulary', 'maths', 'spelling'], targets: { vocabulary: '10 words', maths: '15 questions', spelling: '10 words' } },
  { sections: ['inference', 'nvr', 'punctuation'], targets: { inference: '3 passages', nvr: '10 questions', punctuation: '10 questions' } },
  { sections: ['verbal-reasoning', 'writing', 'sentence-completion'], targets: { 'verbal-reasoning': '10 questions', writing: '1 prompt', 'sentence-completion': '10 questions' } },
  { sections: ['vocabulary', 'maths', 'spelling'], targets: { vocabulary: '15 words', maths: '20 questions', spelling: '15 words' } },
  { sections: ['inference', 'nvr', 'punctuation'], targets: { inference: '4 passages', nvr: '15 questions', punctuation: '15 questions' } },
  { sections: ['verbal-reasoning', 'writing', 'sentence-completion'], targets: { 'verbal-reasoning': '15 questions', writing: '1 prompt', 'sentence-completion': '15 questions' } },
  { sections: ['vocabulary', 'maths', 'spelling'], targets: { vocabulary: '20 words', maths: '25 questions', spelling: '20 words' } },
  { sections: ['inference', 'nvr', 'punctuation'], targets: { inference: '5 passages', nvr: '20 questions', punctuation: '20 questions' } },
  { sections: ['verbal-reasoning', 'writing', 'sentence-completion'], targets: { 'verbal-reasoning': '20 questions', writing: '2 prompts', 'sentence-completion': '20 questions' } },
  { sections: ['vocabulary', 'maths', 'spelling'], targets: { vocabulary: '20 words', maths: '30 questions', spelling: '20 words' } },
  { sections: ['inference', 'nvr', 'punctuation'], targets: { inference: '5 passages', nvr: '25 questions', punctuation: '20 questions' } },
  { sections: ['verbal-reasoning', 'writing', 'sentence-completion'], targets: { 'verbal-reasoning': '25 questions', writing: '2 prompts', 'sentence-completion': '20 questions' } },
  { sections: ['vocabulary', 'maths', 'spelling'], targets: { vocabulary: '25 words', maths: '30 questions', spelling: '25 words' } },
  { sections: ['inference', 'nvr', 'punctuation'], targets: { inference: '6 passages', nvr: '25 questions', punctuation: '25 questions' } },
  { sections: ['verbal-reasoning', 'writing', 'sentence-completion'], targets: { 'verbal-reasoning': '25 questions', writing: '2 prompts', 'sentence-completion': '25 questions' } },
  { sections: ['vocabulary', 'maths', 'spelling'], targets: { vocabulary: '25 words', maths: '35 questions', spelling: '25 words' } },
  { sections: ['inference', 'nvr', 'punctuation'], targets: { inference: '6 passages', nvr: '30 questions', punctuation: '25 questions' } },
  { sections: ['verbal-reasoning', 'writing', 'sentence-completion'], targets: { 'verbal-reasoning': '30 questions', writing: '3 prompts', 'sentence-completion': '25 questions' } },
  { sections: ['vocabulary', 'maths', 'spelling'], targets: { vocabulary: '30 words', maths: '40 questions', spelling: '30 words' } },
  { sections: ['inference', 'nvr', 'punctuation'], targets: { inference: '7 passages', nvr: '30 questions', punctuation: '30 questions' } },
  { sections: ['verbal-reasoning', 'writing', 'sentence-completion'], targets: { 'verbal-reasoning': '30 questions', writing: '3 prompts', 'sentence-completion': '30 questions' } },
  { sections: ['vocabulary', 'maths', 'spelling'], targets: { vocabulary: '30 words', maths: '40 questions', spelling: '30 words' } },
  { sections: ['inference', 'nvr', 'punctuation'], targets: { inference: '8 passages', nvr: '35 questions', punctuation: '30 questions' } },
  { sections: ['verbal-reasoning', 'writing', 'sentence-completion'], targets: { 'verbal-reasoning': '35 questions', writing: '3 prompts', 'sentence-completion': '30 questions' } }
];

/** Get the current week number (0-based) in the 24-week rotation. */
export function getCurrentWeekIndex() {
  // Use a fixed epoch (Monday 6 Jan 2025) so weeks are consistent
  const epoch = new Date('2025-01-06T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = now - epoch;
  const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  return ((diffWeeks % WEEKLY_PLAN.length) + WEEKLY_PLAN.length) % WEEKLY_PLAN.length;
}

/** Get the current week's plan. */
export function getCurrentWeekPlan() {
  return WEEKLY_PLAN[getCurrentWeekIndex()];
}

/** Check if a section was practised this week (by checking localStorage activity). */
function wasPracticedThisWeek(sectionId) {
  try {
    const raw = localStorage.getItem('j11_state');
    if (!raw) return false;
    const state = JSON.parse(raw);
    const activityLog = state.activityLog || [];
    // Get start of current week (Monday)
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1; // Monday = 0
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().slice(0, 10);

    return activityLog.some((entry) =>
      entry.section === sectionId && entry.date >= weekStartStr
    );
  } catch {
    return false;
  }
}

/** Render the weekly study plan. */
export function renderWeeklyPlan() {
  const weekIndex = getCurrentWeekIndex();
  const plan = WEEKLY_PLAN[weekIndex];

  const focusCards = plan.sections.map((secId) => {
    const sec = SECTIONS.find((s) => s.id === secId);
    if (!sec) return '';
    const target = plan.targets[secId] || '';
    const done = wasPracticedThisWeek(secId);
    const doneClass = done ? 'weekly-card--done' : '';

    return `
      <a class="weekly-focus-card ${doneClass}" href="#/${secId}">
        <span class="weekly-card-icon">${sec.icon}</span>
        <span class="weekly-card-name">${sec.name}</span>
        <span class="weekly-card-target">${target}</span>
        ${done ? '<span class="weekly-card-tick">\u2713</span>' : ''}
      </a>`;
  }).join('');

  return `
    <div class="weekly-plan">
      <h2 class="weekly-title">This Week</h2>
      <p class="weekly-subtitle">Week ${weekIndex + 1} of 24</p>
      <div class="weekly-focus-grid">${focusCards}</div>
    </div>`;
}

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
    ${renderCountdown()}
    ${renderWeeklyPlan()}
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
