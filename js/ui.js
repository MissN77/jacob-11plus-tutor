import { xpPercent, xpInCurrentLevel } from './xp.js';

const XP_PER_LEVEL = 200;

const SECTIONS = [
  { id: 'learn-first',         name: 'Learn New Words',      icon: '\u{1F4D6}' },
  { id: 'vocabulary',          name: 'Vocabulary',           icon: '\u{1F4DA}' },
  { id: 'inference',           name: 'Inference',            icon: '\u{1F50D}' },
  { id: 'spelling',            name: 'Spelling',             icon: '\u{270F}\uFE0F' },
  { id: 'punctuation',         name: 'Punctuation',          icon: '.,!?' },
  { id: 'sentence-completion', name: 'Sentence Completion',  icon: '\u{1F4DD}' },
  { id: 'verbal-reasoning',    name: 'Verbal Reasoning',     icon: '\u{1F524}' },
  { id: 'maths',               name: 'Maths',                icon: '\u{1F522}' },
  { id: 'nvr',                 name: 'NVR Foundations',      icon: '\u{1F532}' },
  { id: 'twinkl-nvr',          name: 'Exam Practice (Twinkl)', icon: '\u{1F48E}' },
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

// ── Bexley 20-Week Study Plan ────────────────────────────────────────────

const DEFAULT_START_DATE = '2027-04-19';
const START_DATE_KEY = 'j11_start_date';
let _bexleyPlan = null;

/** Map Bexley plan subject keys to app section ids. */
const SUBJECT_TO_SECTION = {
  english: 'inference',
  verbalReasoning: 'verbal-reasoning',
  maths: 'maths',
  nonVerbalReasoning: 'nvr'
};

const SUBJECT_LABELS = {
  english: 'English',
  verbalReasoning: 'Verbal Reasoning',
  maths: 'Maths',
  nonVerbalReasoning: 'Non-Verbal Reasoning'
};

/** Get user's configured start date (or default). */
export function getStartDate() {
  try {
    return localStorage.getItem(START_DATE_KEY) || DEFAULT_START_DATE;
  } catch {
    return DEFAULT_START_DATE;
  }
}

/** Save user's start date. */
export function setStartDate(dateStr) {
  try {
    localStorage.setItem(START_DATE_KEY, dateStr || DEFAULT_START_DATE);
  } catch {}
}

/** Load the Bexley plan JSON (cached). */
export async function loadBexleyPlan() {
  if (_bexleyPlan) return _bexleyPlan;
  try {
    const res = await fetch('data/bexley-20-week-plan.json');
    _bexleyPlan = await res.json();
  } catch (e) {
    console.error('Failed to load Bexley plan:', e);
    _bexleyPlan = { weeks: [], totalWeeks: 20 };
  }
  return _bexleyPlan;
}

/** Current week number (1-based) relative to START_DATE. 0 = before start, >20 = after end. */
export function getCurrentBexleyWeek() {
  const start = new Date(getStartDate() + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = now - start;
  if (diffMs < 0) return 0;
  const weekNum = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1;
  return weekNum;
}

export { DEFAULT_START_DATE };

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

/** Format a YYYY-MM-DD date as DD Mon YYYY. */
function fmtDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/** Render the Bexley 20-week study plan for current week. */
export function renderBexleyPlan(planData) {
  const weekNum = getCurrentBexleyWeek();
  const startDate = getStartDate();

  // Before plan starts
  if (weekNum === 0) {
    return `
      <div class="weekly-plan">
        <h2 class="weekly-title">Bexley 20-Week Plan</h2>
        <p class="weekly-subtitle">Plan starts ${fmtDate(startDate)}</p>
        <p class="weekly-subtitle">20 weeks of focused prep before the GL assessment.</p>
      </div>`;
  }

  // After plan ends
  if (weekNum > 20) {
    return `
      <div class="weekly-plan">
        <h2 class="weekly-title">Exam week \u2014 good luck Jacob!</h2>
        <p class="weekly-subtitle">You've done the work. Trust your practice.</p>
      </div>`;
  }

  const weeks = (planData && planData.weeks) || [];
  const week = weeks.find((w) => w.week === weekNum);
  if (!week) {
    return `
      <div class="weekly-plan">
        <h2 class="weekly-title">Week ${weekNum} of 20</h2>
      </div>`;
  }

  const isCheckpoint = !!week.checkpoint;

  const subjectKeys = ['english', 'verbalReasoning', 'maths', 'nonVerbalReasoning'];
  const focusCards = subjectKeys.map((key) => {
    const secId = SUBJECT_TO_SECTION[key];
    const sec = SECTIONS.find((s) => s.id === secId);
    const icon = sec ? sec.icon : '\u{1F4D6}';
    const label = SUBJECT_LABELS[key];
    const text = week[key] || '';
    const done = wasPracticedThisWeek(secId);
    const doneClass = done ? 'weekly-card--done' : '';

    return `
      <a class="weekly-focus-card ${doneClass}" href="#/${secId}">
        <span class="weekly-card-icon">${icon}</span>
        <span class="weekly-card-name">${label}</span>
        <span class="weekly-card-target">${text}</span>
        ${done ? '<span class="weekly-card-tick">\u2713</span>' : ''}
      </a>`;
  }).join('');

  const checkpointBanner = isCheckpoint
    ? `<div class="weekly-checkpoint">\u{1F3AF} Checkpoint week \u2014 full mock!</div>`
    : '';

  const homework = week.homework
    ? `<div class="weekly-homework"><strong>Homework:</strong> ${week.homework}</div>`
    : '';

  return `
    <div class="weekly-plan ${isCheckpoint ? 'weekly-plan--checkpoint' : ''}">
      <h2 class="weekly-title">This Week</h2>
      <p class="weekly-subtitle">Week ${weekNum} of 20 \u2014 Bexley plan</p>
      ${checkpointBanner}
      <div class="weekly-focus-grid">${focusCards}</div>
      ${homework}
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
      <a class="settings-icon" href="#/settings" title="Settings" aria-label="Settings">\u2699\uFE0F</a>
    </div>`;
}

/** Render the 9-section home grid. Async so it can load the Bexley plan. */
export async function renderHome(state) {
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

  const planData = await loadBexleyPlan();

  // Weekly Robux progress
  const weeklyXP = state.weekStartXP !== undefined ? state.xp - state.weekStartXP : 0;
  const robuxEarned = Math.max(0, Math.min(weeklyXP, 400));
  const robuxPct = Math.min(robuxEarned / 400, 1);
  const robuxBar = `
    <div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <span style="font-weight:700;font-size:0.9rem;">💰 Weekly Robux</span>
        <span style="font-weight:900;font-size:1.1rem;color:${robuxPct>=1?'#10b981':'#1B2A4A'};">${robuxEarned} / 400</span>
      </div>
      <div style="height:10px;border-radius:5px;background:#f0ebe3;overflow:hidden;">
        <div style="height:100%;border-radius:5px;width:${robuxPct*100}%;background:${robuxPct>=1?'linear-gradient(90deg,#10b981,#06b6d4)':'linear-gradient(90deg,#1A8A7D,#2d8659)'};transition:width 0.5s;"></div>
      </div>
      ${robuxPct >= 1 ? '<div style="text-align:center;margin-top:8px;color:#10b981;font-weight:700;font-size:0.85rem;">🎉 Target reached! Show mum!</div>' : ''}
      <div style="text-align:center;margin-top:6px;font-size:0.75rem;color:#888;">Score 90%+ on quizzes to earn XP towards Robux</div>
    </div>`;

  return `
    ${renderHeader(state)}
    <h1 class="app-title">Jacob's 11 Plus Tutor</h1>
    <p class="app-subtitle">Choose a subject to practise</p>
    ${robuxBar}
    ${renderCountdown()}
    ${renderBexleyPlan(planData)}
    <div class="section-grid">${cards}</div>`;
}

// ── Settings Page ─────────────────────────────────────────────────────────

const GL_DATE_STR = '18 September 2027';

/** Render the settings page. */
export function renderSettings() {
  const startDate = getStartDate();
  return `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Settings</span>
    </div>
    <div class="settings-page">
      <div class="settings-section">
        <h3>20-Week Plan Start Date</h3>
        <p class="settings-hint">The Bexley 20-week plan begins on this date. Default is 20 weeks before the GL assessment.</p>
        <input type="date" id="settings-start-date" class="settings-input" value="${startDate}">
        <button class="btn btn-primary" data-action="save-start-date">Save</button>
        <button class="btn btn-secondary" data-action="reset-start-date">Reset to default</button>
      </div>

      <div class="settings-section">
        <h3>GL Assessment</h3>
        <p class="settings-readonly">${GL_DATE_STR}</p>
      </div>

      <div class="settings-section">
        <h3>Progress</h3>
        <p class="settings-hint">Clear all XP, streaks and activity. Settings are kept.</p>
        <button class="btn btn-danger" data-action="reset-progress">Reset progress</button>
      </div>

      <div class="settings-section">
        <h3>Parent Dashboard</h3>
        <a class="btn btn-secondary" href="dashboard.html">Open parent dashboard</a>
      </div>

      <div class="settings-section">
        <h3>Lock app</h3>
        <p class="settings-hint">Sign out and require the password on the next visit.</p>
        <button class="btn btn-secondary" data-action="lock-app">Lock app</button>
      </div>
    </div>`;
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
