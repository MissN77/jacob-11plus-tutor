// ── MATHS SECTION ────────────────────────────────────────────────────────────
// Learn-First maths for Jacob (Year 4, GL Assessment Bexley 11+ September 2027).
// Flow: Topic menu → Subtopic list → Teach card → Worked example → Practice → Complete
// ASD-aware: predictable structure, explicit rules, celebrate effort, gentle corrections.

import { Store } from '../store.js';
import { playSound } from '../audio.js';

const SECTION_ID = 'maths';
const PROGRESS_KEY = 'j11_maths_progress';
const CHALLENGE_THRESHOLD = 0.8;

let curriculum = null;

// ── Progress persistence ──────────────────────────────────────────────────

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function markSubtopicComplete(strandId, subtopicId, score, total) {
  const progress = loadProgress();
  const key = strandId + '/' + subtopicId;
  const existing = progress[key] || { bestScore: 0, bestTotal: 0, attempts: 0 };
  const newScore = score / total;
  const oldScore = existing.bestTotal > 0 ? existing.bestScore / existing.bestTotal : 0;
  progress[key] = {
    attempts: existing.attempts + 1,
    bestScore: newScore > oldScore ? score : existing.bestScore,
    bestTotal: newScore > oldScore ? total : existing.bestTotal,
    unlockedChallenge: (newScore >= CHALLENGE_THRESHOLD) || existing.unlockedChallenge
  };
  saveProgress(progress);
  return progress[key];
}

function getSubtopicProgress(strandId, subtopicId) {
  const progress = loadProgress();
  return progress[strandId + '/' + subtopicId] || null;
}

// ── Curriculum loader ─────────────────────────────────────────────────────

async function loadCurriculum() {
  if (curriculum) return curriculum;
  const res = await fetch('data/maths-curriculum.json');
  curriculum = await res.json();
  return curriculum;
}

// ── Shuffle helper ────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Router state ──────────────────────────────────────────────────────────

let currentState = {
  view: 'menu', // menu | strand | teach | worked | practice | complete
  strandId: null,
  subtopicId: null,
  questionIndex: 0,
  results: [],
  answered: false,
  questions: []
};

// ── Views ─────────────────────────────────────────────────────────────────

function renderMenu(app) {
  const strands = curriculum.strands.map((s) => {
    const subCount = s.subtopics.length;
    const progress = loadProgress();
    const doneCount = s.subtopics.filter((st) =>
      progress[s.id + '/' + st.id]
    ).length;
    return `
      <button class="maths-strand-card" data-action="strand" data-strand="${s.id}">
        <span class="maths-strand-icon">${s.icon}</span>
        <div class="maths-strand-text">
          <div class="maths-strand-name">${s.name}</div>
          <div class="maths-strand-meta">${s.level} · ${doneCount}/${subCount} topics</div>
          <div class="maths-strand-desc">${s.description}</div>
        </div>
      </button>`;
  }).join('');

  const comingSoon = (curriculum.comingSoon || []).map((c) => `
    <div class="maths-strand-card maths-topic-locked">
      <span class="maths-strand-icon">${c.icon}</span>
      <div class="maths-strand-text">
        <div class="maths-strand-name">${c.name}</div>
        <div class="maths-strand-meta">${c.level} · Coming soon!</div>
      </div>
    </div>`).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Maths</span>
    </div>
    <div class="maths-intro">
      <p class="section-desc">Pick a topic. Each one starts with a lesson, then a worked example, then practice. Learn first, practise after.</p>
    </div>
    <div class="maths-strand-list">${strands}</div>
    <h3 class="maths-future-heading">Later in the year</h3>
    <div class="maths-strand-list">${comingSoon}</div>`;
}

function renderStrand(app, strandId) {
  const strand = curriculum.strands.find((s) => s.id === strandId);
  if (!strand) { renderMenu(app); return; }

  const subs = strand.subtopics.map((st) => {
    const prog = getSubtopicProgress(strand.id, st.id);
    const done = !!prog;
    const pct = prog && prog.bestTotal > 0
      ? Math.round((prog.bestScore / prog.bestTotal) * 100)
      : 0;
    const tick = done ? '<span class="maths-sub-tick">\u2713</span>' : '';
    const scoreLine = done ? `<div class="maths-sub-score">Best: ${pct}%</div>` : '';

    return `
      <button class="maths-sub-card" data-action="teach" data-sub="${st.id}">
        ${tick}
        <div class="maths-sub-name">${st.name}</div>
        ${scoreLine}
      </button>`;
  }).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#" data-action="back-menu">\u2190</a>
      <span class="quiz-title">${strand.name}</span>
    </div>
    <p class="maths-strand-blurb">${strand.description}</p>
    <div class="maths-sub-list">${subs}</div>`;
}

function findSubtopic(strandId, subtopicId) {
  const strand = curriculum.strands.find((s) => s.id === strandId);
  if (!strand) return null;
  return strand.subtopics.find((st) => st.id === subtopicId);
}

function renderTeach(app, strandId, subtopicId) {
  const sub = findSubtopic(strandId, subtopicId);
  if (!sub) { renderMenu(app); return; }
  const t = sub.teach;

  const rules = t.rules.map((r) => `<li>${r}</li>`).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#" data-action="back-strand">\u2190</a>
      <span class="quiz-title">${sub.name}</span>
    </div>
    <div class="maths-teach-card">
      <div class="maths-teach-step">Step 1 of 3 · Learn it</div>
      <h2 class="maths-teach-title">\u{1F4DD} ${t.title}</h2>
      <p class="maths-teach-plain">${t.plain}</p>
      <h3 class="maths-teach-heading">Rules</h3>
      <ol class="maths-rules">${rules}</ol>
      <div class="maths-example-box">
        <div class="maths-box-label">Example</div>
        <div class="maths-box-body">${t.example}</div>
      </div>
      ${t.tryThis ? `
        <div class="maths-try-box">
          <div class="maths-box-label">Try one</div>
          <div class="maths-box-body">${t.tryThis}</div>
          <details class="maths-try-answer">
            <summary>Tap to see answer</summary>
            <div class="maths-box-body">${t.tryAnswer}</div>
          </details>
        </div>` : ''}
      <button class="btn btn-primary maths-next-btn" data-action="worked">Next: see a worked example \u2192</button>
    </div>`;
}

function renderWorked(app, strandId, subtopicId) {
  const sub = findSubtopic(strandId, subtopicId);
  if (!sub) { renderMenu(app); return; }
  const w = sub.workedExample;

  const steps = w.steps.map((s, i) => `<li><span class="maths-step-num">${i+1}</span>${s}</li>`).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#" data-action="back-strand">\u2190</a>
      <span class="quiz-title">${sub.name}</span>
    </div>
    <div class="maths-teach-card">
      <div class="maths-teach-step">Step 2 of 3 · Watch it done</div>
      <h2 class="maths-teach-title">\u{1F50D} Worked example</h2>
      <div class="maths-worked-question">${w.question}</div>
      <ol class="maths-worked-steps">${steps}</ol>
      <div class="maths-example-box maths-answer-box">
        <div class="maths-box-label">Answer</div>
        <div class="maths-box-body"><strong>${w.answer}</strong></div>
      </div>
      <button class="btn btn-primary maths-next-btn" data-action="practice">Ready! Start practice \u2192</button>
    </div>`;
}

function startPractice(app, strandId, subtopicId) {
  const sub = findSubtopic(strandId, subtopicId);
  if (!sub) { renderMenu(app); return; }
  const questions = shuffle(sub.practice).slice(0, Math.min(5, sub.practice.length));
  currentState.questions = questions;
  currentState.questionIndex = 0;
  currentState.results = [];
  currentState.answered = false;
  renderPracticeQuestion(app);
}

function renderPracticeQuestion(app) {
  const q = currentState.questions[currentState.questionIndex];
  const total = currentState.questions.length;
  currentState.answered = false;

  const dots = Array.from({ length: total }, (_, i) => {
    let cls = '';
    if (i < currentState.results.length) cls = currentState.results[i] ? 'correct' : 'wrong';
    else if (i === currentState.questionIndex) cls = 'current';
    return `<div class="quiz-progress-dot ${cls}"></div>`;
  }).join('');

  const sub = findSubtopic(currentState.strandId, currentState.subtopicId);

  let inputHtml = '';
  if (q.options) {
    inputHtml = '<div class="options-grid">' + q.options.map((opt, i) =>
      `<button class="option-btn" data-action="answer" data-index="${i}">${opt}</button>`
    ).join('') + '</div>';
  } else {
    // open-answer
    inputHtml = `
      <div class="maths-answer-wrap">
        <input type="text" class="maths-answer-input" id="maths-open-answer" placeholder="Type your answer" autocomplete="off">
        <button class="btn btn-primary" data-action="submit-open">Check answer</button>
      </div>`;
  }

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#" data-action="back-strand">\u2190</a>
      <span class="quiz-title">${sub.name}</span>
      <span class="quiz-count">${currentState.questionIndex + 1}/${total}</span>
    </div>
    <div class="quiz-progress-bar">${dots}</div>
    <div class="maths-practice-step">Step 3 of 3 · Practice</div>
    <div class="question-area">
      <p class="question-text">${q.question}</p>
    </div>
    ${inputHtml}`;

  const input = document.getElementById('maths-open-answer');
  if (input) {
    input.focus();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const btn = document.querySelector('[data-action="submit-open"]');
        if (btn) btn.click();
      }
    });
  }
}

function showFeedback(app, isCorrect, q) {
  const state = Store.get();
  if (state.settings.soundOn !== false) playSound(isCorrect);

  const praises = ['Brilliant!', 'Well spotted!', 'Nice one!', 'Great thinking!', 'Spot on!', 'Lovely working!'];
  const praise = praises[Math.floor(Math.random() * praises.length)];

  const feedbackHtml = isCorrect
    ? `<div class="maths-feedback maths-feedback--correct">
         <div class="maths-feedback-title">\u{2713} ${praise}</div>
         <div class="maths-working-out"><strong>Working out:</strong> ${q.workingOut || ''}</div>
       </div>`
    : `<div class="maths-feedback maths-feedback--wrong">
         <div class="maths-feedback-title">Not quite — here's the working out.</div>
         <div class="maths-working-out">${q.workingOut || ''}</div>
         ${q.options
           ? `<div class="maths-correct-answer">The answer was: <strong>${q.options[q.correct]}</strong></div>`
           : `<div class="maths-correct-answer">The answer was: <strong>${q.answer}</strong></div>`}
       </div>`;

  const container = document.createElement('div');
  container.innerHTML = feedbackHtml + `
    <button class="btn btn-primary maths-next-btn" data-action="next-q">Next question \u2192</button>`;

  // Clear any existing feedback
  const existing = document.querySelector('.maths-feedback');
  if (existing) existing.parentElement.removeChild(existing);
  const existingBtn = document.querySelector('.maths-next-btn');
  if (existingBtn) existingBtn.parentElement.removeChild(existingBtn);

  app.appendChild(container);
  container.querySelector('.maths-next-btn').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function handleMCAnswer(app, index) {
  if (currentState.answered) return;
  currentState.answered = true;

  const q = currentState.questions[currentState.questionIndex];
  const isCorrect = index === q.correct;
  currentState.results.push(isCorrect);

  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  showFeedback(app, isCorrect, q);
}

function handleOpenAnswer(app) {
  if (currentState.answered) return;
  const input = document.getElementById('maths-open-answer');
  if (!input || !input.value.trim()) return;
  currentState.answered = true;

  const q = currentState.questions[currentState.questionIndex];
  const given = input.value.trim().toLowerCase().replace(/\s+/g, '');
  const correct = String(q.answer).trim().toLowerCase().replace(/\s+/g, '');
  const isCorrect = given === correct;
  currentState.results.push(isCorrect);

  input.disabled = true;
  const submitBtn = document.querySelector('[data-action="submit-open"]');
  if (submitBtn) submitBtn.disabled = true;

  showFeedback(app, isCorrect, q);
}

function nextQuestion(app) {
  currentState.questionIndex++;
  if (currentState.questionIndex >= currentState.questions.length) {
    renderComplete(app);
  } else {
    renderPracticeQuestion(app);
  }
}

function renderComplete(app) {
  const correct = currentState.results.filter(Boolean).length;
  const total = currentState.results.length;
  const pct = Math.round((correct / total) * 100);
  const xpEarned = correct * 10;

  // Award XP and log progress
  Store.addXP(xpEarned);
  const sectionData = Store.get().sections[SECTION_ID] || { completed: 0, correct: 0, total: 0 };
  Store.updateSection(SECTION_ID, {
    completed: (sectionData.completed || 0) + 1,
    correct: (sectionData.correct || 0) + correct,
    total: (sectionData.total || 0) + total
  });
  Store.recordQuiz('maths', correct, total, xpEarned, currentState.subtopicId);
  if (window.__showXPToast) window.__showXPToast(`+${xpEarned} XP`);

  const progress = markSubtopicComplete(currentState.strandId, currentState.subtopicId, correct, total);

  let emoji = '\u{1F44D}';
  let title = 'Good effort!';
  if (pct === 100) { emoji = '\u{1F31F}'; title = 'Perfect! Every single one right.'; }
  else if (pct >= 80) { emoji = '\u{1F389}'; title = 'Brilliant work!'; }
  else if (pct >= 60) { emoji = '\u{1F4AA}'; title = 'Nice going!'; }
  else { emoji = '\u{1F4AD}'; title = 'Good try — lets look again.'; }

  const unlockedLine = progress.unlockedChallenge && pct >= 80
    ? '<div class="maths-unlock">\u{1F513} Challenge mode unlocked! Come back and try harder questions.</div>'
    : '';

  const sub = findSubtopic(currentState.strandId, currentState.subtopicId);

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#" data-action="back-strand">\u2190</a>
      <span class="quiz-title">${sub.name}</span>
    </div>
    <div class="score-screen">
      <div class="score-emoji">${emoji}</div>
      <h2 class="score-title">${title}</h2>
      <p class="score-subtitle">${sub.name}</p>
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
      ${unlockedLine}
      <div class="score-actions">
        <button class="btn btn-primary" data-action="retry-practice">Try again</button>
        <button class="btn btn-secondary" data-action="back-strand">Pick another topic</button>
      </div>
    </div>`;
}

// ── Init & router ─────────────────────────────────────────────────────────

export default async function(app) {
  try {
    await loadCurriculum();
  } catch (e) {
    app.innerHTML = `<div class="quiz-header"><a class="quiz-back" href="#/">\u2190</a><span class="quiz-title">Maths</span></div><p style="padding:24px;">Couldn't load the curriculum. Check you are online.</p>`;
    return;
  }

  currentState.view = 'menu';
  currentState.strandId = null;
  currentState.subtopicId = null;
  renderMenu(app);

  if (app._mathsHandler) app.removeEventListener('click', app._mathsHandler);

  const handler = (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'strand') {
      e.preventDefault();
      currentState.strandId = actionEl.dataset.strand;
      currentState.view = 'strand';
      renderStrand(app, currentState.strandId);
      return;
    }

    if (action === 'back-menu') {
      e.preventDefault();
      currentState.view = 'menu';
      renderMenu(app);
      return;
    }

    if (action === 'back-strand') {
      e.preventDefault();
      if (currentState.strandId) {
        currentState.view = 'strand';
        renderStrand(app, currentState.strandId);
      } else {
        renderMenu(app);
      }
      return;
    }

    if (action === 'teach') {
      e.preventDefault();
      currentState.subtopicId = actionEl.dataset.sub;
      currentState.view = 'teach';
      renderTeach(app, currentState.strandId, currentState.subtopicId);
      return;
    }

    if (action === 'worked') {
      e.preventDefault();
      currentState.view = 'worked';
      renderWorked(app, currentState.strandId, currentState.subtopicId);
      return;
    }

    if (action === 'practice') {
      e.preventDefault();
      currentState.view = 'practice';
      startPractice(app, currentState.strandId, currentState.subtopicId);
      return;
    }

    if (action === 'answer') {
      e.preventDefault();
      handleMCAnswer(app, parseInt(actionEl.dataset.index, 10));
      return;
    }

    if (action === 'submit-open') {
      e.preventDefault();
      handleOpenAnswer(app);
      return;
    }

    if (action === 'next-q') {
      e.preventDefault();
      nextQuestion(app);
      return;
    }

    if (action === 'retry-practice') {
      e.preventDefault();
      startPractice(app, currentState.strandId, currentState.subtopicId);
      return;
    }
  };

  app._mathsHandler = handler;
  app.addEventListener('click', handler);
}
