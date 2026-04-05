// ── TWINKL NVR SECTION MODULE ────────────────────────────────────────────
// Shows real exam practice questions from the Twinkl NVR Ultimate Practice Pack.
// One question at a time with immediate feedback, then a final score summary.
import { Store } from '../store.js';
import { playSound } from '../audio.js';
import { calculateQuizXP } from '../xp.js';
import { renderScore } from '../ui.js';

const MANIFEST_URL = 'data/twinkl-nvr/manifest.json';
const IMG_BASE = 'data/twinkl-nvr/';
const OPTION_LABELS = ['a', 'b', 'c', 'd', 'e'];

let manifest = null;
let _loading = null;

async function loadManifest() {
  if (manifest) return manifest;
  if (_loading) return _loading;
  _loading = fetch(MANIFEST_URL)
    .then(r => r.json())
    .then(d => { manifest = d; return manifest; })
    .catch(err => { console.error('Failed to load Twinkl manifest:', err); manifest = null; return null; });
  return _loading;
}

// ── Module state ─────────────────────────────────────────────────────────
let currentSectionIdx = null;
let currentQuestionIdx = 0;     // 0-based into section.questions
let results = [];               // array of booleans
let answered = false;           // whether current question has been answered

// ── Menu ─────────────────────────────────────────────────────────────────

function renderMenu(container) {
  if (!manifest) {
    container.innerHTML = `<div class="quiz-header"><a class="quiz-back" href="#/">\u2190</a><span class="quiz-title">Twinkl NVR</span></div><div class="section-home"><p>Could not load the Twinkl pack.</p></div>`;
    return;
  }

  const state = Store.get();
  const twinkl = state.sections['twinkl-nvr'] || {};

  const cards = manifest.sections.map((s, i) => {
    const prog = twinkl[s.typeId] || { completed: 0, bestScore: 0 };
    const pct = prog.bestScore ? Math.round((prog.bestScore / s.questionCount) * 100) : 0;
    return `
      <a class="nvr-type-card" href="#/twinkl-nvr/${i}" data-action="select-twinkl-section" data-idx="${i}">
        <span class="nvr-type-icon">\u{1F4D6}</span>
        <span class="nvr-type-name">${s.name}</span>
        <div class="card-progress-bg">
          <div class="card-progress-fill" style="width: ${pct}%"></div>
        </div>
        <span class="nvr-type-count">${prog.completed} done${prog.bestScore ? ' | best ' + prog.bestScore + '/' + s.questionCount : ''}</span>
      </a>`;
  }).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Exam Practice (Twinkl)</span>
    </div>
    <div class="section-home">
      <div class="section-home-icon">\u{1F48E}</div>
      <h2>Twinkl NVR Practice</h2>
      <p>Real 11+ paper from the Twinkl Ultimate Practice Pack. 7 sections, 6 questions each.</p>
      <div class="nvr-type-grid">${cards}</div>
    </div>`;
}

// ── Question flow ────────────────────────────────────────────────────────

function startSection(container, sectionIdx) {
  currentSectionIdx = sectionIdx;
  currentQuestionIdx = 0;
  results = [];
  answered = false;
  renderQuestion(container);
}

function renderQuestion(container) {
  const section = manifest.sections[currentSectionIdx];
  if (!section) { renderMenu(container); return; }
  const q = section.questions[currentQuestionIdx];
  const total = section.questions.length;
  answered = false;

  const optButtons = OPTION_LABELS.map(lbl => `
    <button class="twinkl-opt-btn" data-action="twinkl-answer" data-opt="${lbl}">${lbl}</button>
  `).join('');

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/twinkl-nvr" data-action="twinkl-back-menu">\u2190</a>
      <span class="quiz-title">${section.name}</span>
    </div>
    <div class="twinkl-practice">
      <div class="twinkl-progress">Question ${currentQuestionIdx + 1} of ${total}</div>
      <p class="twinkl-instruction">${section.instruction}</p>
      <img class="twinkl-q-img" src="${IMG_BASE}${q.image}" alt="Question ${q.number}" />
      <div class="twinkl-opts twinkl-opts-big">${optButtons}</div>
      <div class="twinkl-feedback" data-feedback></div>
      <button class="btn btn-primary twinkl-next-btn" data-action="twinkl-next" style="display:none">Next</button>
    </div>`;
}

function handleAnswerClick(container, optLabel) {
  if (answered) return;
  answered = true;
  const section = manifest.sections[currentSectionIdx];
  const q = section.questions[currentQuestionIdx];
  const correctAnswer = q.answer;
  const isCorrect = optLabel === correctAnswer;
  results.push(isCorrect);

  // Visual feedback on all option buttons
  const btns = container.querySelectorAll('.twinkl-opt-btn');
  btns.forEach(b => {
    b.disabled = true;
    if (b.dataset.opt === correctAnswer) {
      b.classList.add('twinkl-opt-correct');
    }
    if (b.dataset.opt === optLabel && !isCorrect) {
      b.classList.add('twinkl-opt-wrong');
    }
  });

  const fb = container.querySelector('[data-feedback]');
  if (fb) {
    fb.innerHTML = isCorrect
      ? `<span class="twinkl-fb-correct">\u2713 Correct</span>`
      : `<span class="twinkl-fb-wrong">\u2717 Answer was <strong>${correctAnswer}</strong></span>`;
  }

  const state = Store.get();
  if (state.settings.soundOn) playSound(isCorrect);

  // Show Next button
  const nextBtn = container.querySelector('.twinkl-next-btn');
  if (nextBtn) {
    const isLast = currentQuestionIdx >= section.questions.length - 1;
    nextBtn.textContent = isLast ? 'See results' : 'Next';
    nextBtn.style.display = 'inline-block';
  }
}

function handleNext(container) {
  const section = manifest.sections[currentSectionIdx];
  if (currentQuestionIdx >= section.questions.length - 1) {
    renderResults(container);
    return;
  }
  currentQuestionIdx++;
  renderQuestion(container);
}

function renderResults(container) {
  const section = manifest.sections[currentSectionIdx];
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz('twinkl-nvr', xpData.correct, xpData.total, xpData.totalXP, section.typeId);

  // Update progress
  const state = Store.get();
  const twinkl = state.sections['twinkl-nvr'] || {};
  const prev = twinkl[section.typeId] || { completed: 0, bestScore: 0 };
  const newBest = Math.max(prev.bestScore, xpData.correct);
  Store.updateSection('twinkl-nvr', {
    [section.typeId]: { completed: prev.completed + 1, bestScore: newBest }
  });

  // Per-question review
  const rows = section.questions.map((q, i) => {
    const got = results[i];
    return `
      <tr class="${got ? 'twinkl-r-correct' : 'twinkl-r-wrong'}">
        <td>Q${q.number}</td>
        <td>Correct answer: <strong>${q.answer}</strong></td>
        <td>${got ? '\u2713' : '\u2717'}</td>
      </tr>`;
  }).join('');

  container.innerHTML = renderScore(results, section.name, xpData.totalXP) + `
    <div class="twinkl-review">
      <h3>Review</h3>
      <table class="twinkl-review-table">${rows}</table>
    </div>`;

  const scoreActions = container.querySelector('.score-actions');
  if (scoreActions) {
    scoreActions.innerHTML = `
      <button class="btn btn-primary" data-action="twinkl-retry" data-idx="${currentSectionIdx}">Try again</button>
      <a class="btn btn-secondary" href="#/twinkl-nvr" data-action="twinkl-back-menu">All sections</a>
      <a class="btn btn-secondary" href="#/">Home</a>`;
  }

  if (window.__showXPToast) window.__showXPToast(`+${xpData.totalXP} XP`);
}

// ── Route handling ───────────────────────────────────────────────────────

function routeFromHash() {
  const hash = location.hash.replace('#/', '').replace('#', '');
  const parts = hash.split('/');
  if (parts[0] !== 'twinkl-nvr') return { screen: 'menu' };
  if (!parts[1]) return { screen: 'menu' };
  const idx = parseInt(parts[1], 10);
  if (isNaN(idx)) return { screen: 'menu' };
  return { screen: 'practice', idx };
}

// ── Public init ──────────────────────────────────────────────────────────

export async function init(container) {
  container.innerHTML = `<div class="quiz-header"><a class="quiz-back" href="#/">\u2190</a><span class="quiz-title">Twinkl NVR</span></div><div class="section-home"><p>Loading pack\u2026</p></div>`;
  await loadManifest();

  const route = routeFromHash();

  if (route.screen === 'practice' && manifest) {
    startSection(container, route.idx);
  } else {
    renderMenu(container);
  }

  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'select-twinkl-section') {
      e.preventDefault();
      const idx = parseInt(el.dataset.idx, 10);
      location.hash = `#/twinkl-nvr/${idx}`;
      startSection(container, idx);
    }

    if (action === 'twinkl-back-menu') {
      e.preventDefault();
      location.hash = '#/twinkl-nvr';
      renderMenu(container);
    }

    if (action === 'twinkl-answer') {
      handleAnswerClick(container, el.dataset.opt);
    }

    if (action === 'twinkl-next') {
      handleNext(container);
    }

    if (action === 'twinkl-retry') {
      const idx = parseInt(el.dataset.idx, 10);
      startSection(container, idx);
    }
  };

  container.removeEventListener('click', container._twinklHandler);
  container._twinklHandler = handler;
  container.addEventListener('click', handler);

  const hashHandler = () => {
    const hash = location.hash.replace('#/', '').replace('#', '');
    if (!hash.startsWith('twinkl-nvr')) {
      container.removeEventListener('click', container._twinklHandler);
      window.removeEventListener('hashchange', hashHandler);
    }
  };
  window.addEventListener('hashchange', hashHandler);
}

export default init;
