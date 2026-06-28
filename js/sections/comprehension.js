// ── COMPREHENSION SECTION MODULE ─────────────────────────────────────────
// GL / Bexley reading-comprehension activities. Each activity is a reading
// passage plus 10 multiple-choice questions. One attempt per activity
// ("one go"): the pupil answers all 10, submits once, the activity locks and
// the score is saved to Supabase (via Store.recordQuiz) like every other
// section. Options are shuffled at display time so the correct answer is not
// always in the same position.
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderScore } from '../ui.js';

const DATA_URL = 'data/comprehension.json';
const SECTION_ID = 'comprehension';

let activities = null;          // array of activity objects
let _loading = null;

async function loadData() {
  if (activities) return activities;
  if (_loading) return _loading;
  _loading = fetch(DATA_URL)
    .then(r => r.json())
    .then(d => { activities = (d && d.activities) || []; return activities; })
    .catch(err => { console.error('Failed to load comprehension data:', err); activities = []; return activities; });
  return _loading;
}

function findActivity(id) {
  return (activities || []).find(a => a.id === id) || null;
}

/** Saved completion record for an activity (or null if not done). */
function savedResult(id) {
  const state = Store.get();
  const sec = state.sections[SECTION_ID] || {};
  return sec[id] || null;
}

// ── In-progress attempt state ────────────────────────────────────────────
// order[qi]      = shuffled array of original option indices for question qi
// correctPos[qi] = display position of the correct option after shuffling
// selected[qi]   = display position the pupil has chosen (or null)
let attempt = null;

function buildAttempt(activity) {
  const order = [], correctPos = [], selected = [];
  activity.questions.forEach((q) => {
    const idx = q.options.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {           // Fisher-Yates
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    order.push(idx);
    correctPos.push(idx.indexOf(q.correctIndex));
    selected.push(null);
  });
  attempt = { activity, order, correctPos, selected, submitted: false };
}

// ── Rendering helpers ────────────────────────────────────────────────────

function passageHtml(activity) {
  const p = activity.passage || {};
  const paras = (p.paragraphs || []).map(t => `<p>${t}</p>`).join('');
  const subtitle = p.subtitle ? `<p class="comp-passage-subtitle">${p.subtitle}</p>` : '';
  return `
    <div class="comp-passage">
      <h3 class="comp-passage-title">${p.title || activity.title}</h3>
      ${subtitle}
      <div class="comp-passage-body">${paras}</div>
    </div>`;
}

function vocabHtml(activity) {
  const vocab = activity.vocabulary || [];
  if (!vocab.length) return '';
  const items = vocab.map(v => `<li><strong>${v.word}</strong> &mdash; ${v.meaning}</li>`).join('');
  return `
    <div class="comp-vocab">
      <h3>Words from the passage</h3>
      <ul>${items}</ul>
    </div>`;
}

function header(title) {
  return `
    <div class="quiz-header">
      <a class="quiz-back" href="#/comprehension" data-action="comp-back-menu">←</a>
      <span class="quiz-title">${title}</span>
    </div>`;
}

// ── Menu ─────────────────────────────────────────────────────────────────

function renderMenu(container) {
  if (!activities || !activities.length) {
    container.innerHTML = `${header('Comprehension')}<div class="section-home"><p>Could not load the comprehension activities.</p></div>`;
    return;
  }

  const doneCount = activities.filter(a => savedResult(a.id)).length;

  const cards = activities.map(a => {
    const res = savedResult(a.id);
    const done = !!res;
    const meta = done
      ? `<span class="comp-card-score">Score ${res.score}/${res.total}</span>`
      : `<span class="comp-card-meta">${(a.questions || []).length} questions</span>`;
    return `
      <a class="comp-card ${done ? 'comp-card--done' : ''}" href="#/comprehension/${a.id}" data-action="comp-open" data-id="${a.id}">
        <span class="comp-card-icon">${done ? '✅' : '\u{1F4D6}'}</span>
        <span class="comp-card-title">${a.title}</span>
        ${meta}
        ${done ? '<span class="comp-card-lock">One go done</span>' : ''}
      </a>`;
  }).join('');

  container.innerHTML = `
    ${header('Comprehension')}
    <div class="section-home">
      <div class="section-home-icon">\u{1F4D6}</div>
      <h2>Reading Comprehension</h2>
      <p>20 reading passages, each with 10 questions. You get <strong>one go</strong> at each, just like the real exam, so read carefully before you answer. (${doneCount}/${activities.length} done)</p>
      <div class="comp-grid">${cards}</div>
    </div>`;
}

// ── Live attempt ─────────────────────────────────────────────────────────

function renderActivity(container, activity) {
  buildAttempt(activity);

  const questionsHtml = activity.questions.map((q, qi) => {
    const opts = attempt.order[qi].map((origIdx, pos) =>
      `<button class="option-btn comp-opt" data-action="comp-select" data-q="${qi}" data-pos="${pos}">${q.options[origIdx]}</button>`
    ).join('');
    const lineRef = q.lineRef ? `<span class="comp-lineref">${q.lineRef}</span>` : '';
    return `
      <div class="comp-q" data-qcard="${qi}">
        <p class="comp-q-prompt"><span class="comp-q-num">${qi + 1}</span> ${q.prompt} ${lineRef}</p>
        <div class="options-grid comp-options">${opts}</div>
      </div>`;
  }).join('');

  container.innerHTML = `
    ${header(activity.title)}
    <div class="comp-activity">
      ${passageHtml(activity)}
      <div class="comp-questions">${questionsHtml}</div>
      <div class="comp-submit-bar">
        <button class="btn btn-primary comp-submit" data-action="comp-submit" disabled>Answer all 10 to submit (0/10)</button>
      </div>
    </div>`;
}

function updateSubmitState(container) {
  const answered = attempt.selected.filter(s => s !== null).length;
  const btn = container.querySelector('.comp-submit');
  if (!btn) return;
  const total = attempt.activity.questions.length;
  if (answered >= total) {
    btn.disabled = false;
    btn.textContent = 'Submit answers';
  } else {
    btn.disabled = true;
    btn.textContent = `Answer all ${total} to submit (${answered}/${total})`;
  }
}

function handleSelect(container, qi, pos) {
  if (attempt.submitted) return;
  attempt.selected[qi] = pos;
  // Update visual selection within this question only
  const card = container.querySelector(`[data-qcard="${qi}"]`);
  if (card) {
    card.querySelectorAll('.comp-opt').forEach(b => {
      b.classList.toggle('selected', parseInt(b.dataset.pos, 10) === pos);
    });
  }
  updateSubmitState(container);
}

function handleSubmit(container) {
  if (attempt.submitted) return;
  const activity = attempt.activity;
  const total = activity.questions.length;
  if (attempt.selected.filter(s => s !== null).length < total) return;
  attempt.submitted = true;

  // Grade and reveal
  const results = [];
  const wrongDetails = [];
  activity.questions.forEach((q, qi) => {
    const chosenPos = attempt.selected[qi];
    const correctPos = attempt.correctPos[qi];
    const isCorrect = chosenPos === correctPos;
    results.push(isCorrect);

    const card = container.querySelector(`[data-qcard="${qi}"]`);
    if (card) {
      card.querySelectorAll('.comp-opt').forEach(b => {
        const pos = parseInt(b.dataset.pos, 10);
        b.disabled = true;
        if (pos === correctPos) b.classList.add('correct');
        if (pos === chosenPos && !isCorrect) b.classList.add('wrong');
      });
      const exp = document.createElement('div');
      exp.className = `comp-explain ${isCorrect ? 'comp-explain--right' : 'comp-explain--wrong'}`;
      exp.innerHTML = `${isCorrect ? '✓ Correct.' : '✗ Answer: <strong>' + q.answer + '</strong>.'} ${q.explanation || ''}`;
      card.appendChild(exp);
    }

    if (!isCorrect) {
      wrongDetails.push({
        q: q.prompt,
        given: chosenPos !== null ? q.options[attempt.order[qi][chosenPos]] : '(no answer)',
        correct: q.answer
      });
    }
  });

  // Score, XP and persistence
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz(SECTION_ID, xpData.correct, xpData.total, xpData.totalXP, activity.id, wrongDetails);
  Store.updateSection(SECTION_ID, {
    [activity.id]: { completed: 1, score: xpData.correct, total: xpData.total, done: true }
  });

  const state = Store.get();
  if (state.settings.soundOn) playSound(xpData.correct >= Math.ceil(total * 0.6));

  // Score summary at the top, plus vocabulary to review. No "Try again" (one go).
  const summary = document.createElement('div');
  summary.innerHTML = renderScore(results, activity.title, xpData.totalXP) + vocabHtml(activity);
  const actions = summary.querySelector('.score-actions');
  if (actions) {
    actions.innerHTML = `
      <a class="btn btn-primary" href="#/comprehension" data-action="comp-back-menu">More passages</a>
      <a class="btn btn-secondary" href="#/">Home</a>`;
  }
  const activityEl = container.querySelector('.comp-activity');
  const submitBar = container.querySelector('.comp-submit-bar');
  if (submitBar) submitBar.remove();
  if (activityEl) activityEl.insertBefore(summary, activityEl.firstChild);

  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (window.__showXPToast) window.__showXPToast(`+${xpData.totalXP} XP`);
}

// ── Locked review (after the one go) ─────────────────────────────────────

function renderReview(container, activity, res) {
  const questionsHtml = activity.questions.map((q, qi) => {
    const opts = q.options.map((opt, i) =>
      `<button class="option-btn comp-opt ${i === q.correctIndex ? 'correct' : ''}" disabled>${opt}</button>`
    ).join('');
    const lineRef = q.lineRef ? `<span class="comp-lineref">${q.lineRef}</span>` : '';
    return `
      <div class="comp-q">
        <p class="comp-q-prompt"><span class="comp-q-num">${qi + 1}</span> ${q.prompt} ${lineRef}</p>
        <div class="options-grid comp-options">${opts}</div>
        <div class="comp-explain comp-explain--right">Answer: <strong>${q.answer}</strong>. ${q.explanation || ''}</div>
      </div>`;
  }).join('');

  container.innerHTML = `
    ${header(activity.title)}
    <div class="comp-activity">
      <div class="comp-locked-banner">\u{1F512} One go done &middot; score ${res.score}/${res.total}. Answers are shown below to review.</div>
      ${passageHtml(activity)}
      <div class="comp-questions">${questionsHtml}</div>
      ${vocabHtml(activity)}
      <div class="comp-submit-bar">
        <a class="btn btn-secondary" href="#/comprehension" data-action="comp-back-menu">More passages</a>
        <a class="btn btn-secondary" href="#/">Home</a>
      </div>
    </div>`;
}

function openActivity(container, id) {
  const activity = findActivity(id);
  if (!activity) { renderMenu(container); return; }
  const res = savedResult(id);
  if (res && res.done) {
    renderReview(container, activity, res);     // locked: one go only
  } else {
    renderActivity(container, activity);
  }
}

// ── Route handling ───────────────────────────────────────────────────────

function routeFromHash() {
  const hash = location.hash.replace('#/', '').replace('#', '');
  const parts = hash.split('/');
  if (parts[0] !== SECTION_ID) return { screen: 'menu' };
  if (!parts[1]) return { screen: 'menu' };
  return { screen: 'activity', id: parts[1] };
}

// ── Public init ──────────────────────────────────────────────────────────

export async function init(container) {
  container.innerHTML = `${header('Comprehension')}<div class="section-home"><p>Loading passages…</p></div>`;
  await loadData();

  const route = routeFromHash();
  if (route.screen === 'activity') {
    openActivity(container, route.id);
  } else {
    renderMenu(container);
  }

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'comp-open') {
      e.preventDefault();
      const id = el.dataset.id;
      location.hash = `#/comprehension/${id}`;
      openActivity(container, id);
    }

    if (action === 'comp-back-menu') {
      e.preventDefault();
      location.hash = '#/comprehension';
      renderMenu(container);
    }

    if (action === 'comp-select') {
      handleSelect(container, parseInt(el.dataset.q, 10), parseInt(el.dataset.pos, 10));
    }

    if (action === 'comp-submit') {
      handleSubmit(container);
    }
  };

  container.removeEventListener('click', container._compHandler);
  container._compHandler = handler;
  container.addEventListener('click', handler);

  const hashHandler = () => {
    const hash = location.hash.replace('#/', '').replace('#', '');
    if (!hash.startsWith(SECTION_ID)) {
      container.removeEventListener('click', container._compHandler);
      window.removeEventListener('hashchange', hashHandler);
    }
  };
  window.addEventListener('hashchange', hashHandler);
}

export default init;
