// ── TWINKL NVR SECTION MODULE ────────────────────────────────────────────
// Shows real exam practice pages from the Twinkl NVR Ultimate Practice Pack.
// Each section = one image with 6 questions, answered via a-e option buttons.
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
let currentSectionIdx = null; // index into manifest.sections
let currentAnswers = {};      // { "1": "c", ... }
let timerStart = 0;

function pad(n) { return String(n).padStart(3, '0'); }

function pageImagePath(pageNum) {
  return `${IMG_BASE}page_${pad(pageNum)}.png`;
}

function getProgress(typeId) {
  const state = Store.get();
  const twinkl = state.sections['twinkl-nvr'] || {};
  return twinkl[typeId] || { completed: 0, bestScore: 0 };
}

// ── Screens ──────────────────────────────────────────────────────────────

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

function renderPractice(container, sectionIdx) {
  const section = manifest.sections[sectionIdx];
  if (!section) { renderMenu(container); return; }

  const img = pageImagePath(section.startPage);
  currentAnswers = {};
  timerStart = Date.now();

  const rows = [];
  for (let q = 1; q <= section.questionCount; q++) {
    const opts = OPTION_LABELS.map(lbl => `
      <button class="twinkl-opt-btn" data-action="twinkl-answer" data-q="${q}" data-opt="${lbl}">${lbl}</button>
    `).join('');
    rows.push(`
      <div class="twinkl-row" data-row="${q}">
        <span class="twinkl-row-label">Q${q}</span>
        <div class="twinkl-opts">${opts}</div>
      </div>`);
  }

  container.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/twinkl-nvr" data-action="twinkl-back-menu">\u2190</a>
      <span class="quiz-title">${section.name}</span>
    </div>
    <div class="twinkl-practice">
      <p class="twinkl-instruction">${section.instruction}</p>
      <img class="twinkl-page-img" src="${img}" alt="${section.name} page" />
      <div class="twinkl-rows">${rows.join('')}</div>
      <button class="btn btn-primary" data-action="twinkl-submit" disabled>Submit (0/${section.questionCount})</button>
    </div>`;
}

function updateSubmitState(container, section) {
  const answered = Object.keys(currentAnswers).length;
  const btn = container.querySelector('[data-action="twinkl-submit"]');
  if (!btn) return;
  btn.textContent = `Submit (${answered}/${section.questionCount})`;
  btn.disabled = answered < section.questionCount;
}

function handleOptionClick(container, qNum, optLabel) {
  const section = manifest.sections[currentSectionIdx];
  currentAnswers[String(qNum)] = optLabel;
  // Visual: highlight selected, clear siblings
  const row = container.querySelector(`.twinkl-row[data-row="${qNum}"]`);
  if (row) {
    row.querySelectorAll('.twinkl-opt-btn').forEach(b => {
      b.classList.toggle('selected', b.dataset.opt === optLabel);
    });
  }
  updateSubmitState(container, section);
}

function renderResults(container, sectionIdx) {
  const section = manifest.sections[sectionIdx];
  const pageNum = String(section.startPage);
  const key = manifest.answerKey.byQuestionPage[pageNum];
  const correctAnswers = key ? key.answers : {};

  const results = [];
  const rows = [];
  for (let q = 1; q <= section.questionCount; q++) {
    const given = currentAnswers[String(q)] || '-';
    const correct = correctAnswers[String(q)] || '?';
    const isCorrect = given === correct;
    results.push(isCorrect);
    rows.push(`
      <tr class="${isCorrect ? 'twinkl-r-correct' : 'twinkl-r-wrong'}">
        <td>Q${q}</td>
        <td>Your answer: <strong>${given}</strong></td>
        <td>Correct: <strong>${correct}</strong></td>
        <td>${isCorrect ? '\u2713' : '\u2717'}</td>
      </tr>`);
  }

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

  if (state.settings.soundOn) {
    playSound(xpData.correct >= Math.ceil(xpData.total / 2));
  }

  container.innerHTML = renderScore(results, section.name, xpData.totalXP) + `
    <div class="twinkl-review">
      <h3>Answers</h3>
      <table class="twinkl-review-table">${rows.join('')}</table>
    </div>`;

  // Replace score action buttons
  const scoreActions = container.querySelector('.score-actions');
  if (scoreActions) {
    scoreActions.innerHTML = `
      <button class="btn btn-primary" data-action="twinkl-retry" data-idx="${sectionIdx}">Try again</button>
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
    currentSectionIdx = route.idx;
    renderPractice(container, route.idx);
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
      currentSectionIdx = idx;
      location.hash = `#/twinkl-nvr/${idx}`;
      renderPractice(container, idx);
    }

    if (action === 'twinkl-back-menu') {
      e.preventDefault();
      location.hash = '#/twinkl-nvr';
      renderMenu(container);
    }

    if (action === 'twinkl-answer') {
      const q = parseInt(el.dataset.q, 10);
      const opt = el.dataset.opt;
      handleOptionClick(container, q, opt);
    }

    if (action === 'twinkl-submit') {
      if (el.disabled) return;
      renderResults(container, currentSectionIdx);
    }

    if (action === 'twinkl-retry') {
      const idx = parseInt(el.dataset.idx, 10);
      currentSectionIdx = idx;
      renderPractice(container, idx);
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
