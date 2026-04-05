// ── SENTENCE COMPLETION SECTION ──────────────────────────────────────────────
// GL Assessment style: cloze/sentence completion - pick the best word for the blank

import { Store } from '../store.js';
import { renderQuizProgress, renderScore as renderScoreUI } from '../ui.js';
import { calculateQuizXP } from '../xp.js';
import { playSound } from '../audio.js';

const SECTION_ID = 'sentence-completion';
const QUIZ_LENGTH = 10;

const ALL_QUESTIONS = [
  // ── Vocabulary in context ──
  { id: 1, sentence: "The detective was ___ that the clue had been overlooked.", options: ["convinced", "convulsed", "converted", "consumed"], answer: 0 },
  { id: 2, sentence: "The ancient castle stood on a ___ cliff overlooking the sea.", options: ["rugged", "ragged", "rigid", "rigged"], answer: 0 },
  { id: 3, sentence: "Her ___ manner put everyone at ease during the interview.", options: ["aggressive", "amiable", "anxious", "arrogant"], answer: 1 },
  { id: 4, sentence: "The explorers had to ___ through dense undergrowth to reach the river.", options: ["stagger", "stumble", "scramble", "stride"], answer: 2 },
  { id: 5, sentence: "The magician performed an ___ trick that left the audience speechless.", options: ["ordinary", "elaborate", "elementary", "enormous"], answer: 1 },
  { id: 6, sentence: "The teacher praised the pupil for her ___ behaviour during the assembly.", options: ["exceptional", "excessive", "exhausting", "external"], answer: 0 },
  { id: 7, sentence: "After the long drought, the farmers were ___ for rain.", options: ["delighted", "desperate", "determined", "devoted"], answer: 1 },
  { id: 8, sentence: "The old bridge was ___ and could collapse at any moment.", options: ["fragile", "feeble", "frantic", "futile"], answer: 0 },
  { id: 9, sentence: "The scientist made a ___ discovery that changed the world.", options: ["groundbreaking", "gruelling", "gracious", "grievous"], answer: 0 },
  { id: 10, sentence: "The children watched in ___ as the fireworks lit up the sky.", options: ["anger", "awe", "agony", "apathy"], answer: 1 },
  { id: 11, sentence: "The spy had to remain ___ to avoid being detected.", options: ["conspicuous", "cautious", "concealed", "conscious"], answer: 2 },
  { id: 12, sentence: "The gymnast displayed remarkable ___ during her routine.", options: ["agility", "ability", "activity", "anxiety"], answer: 0 },
  { id: 13, sentence: "The ___ pupil always finished her work before everyone else.", options: ["diligent", "defiant", "dormant", "distant"], answer: 0 },
  { id: 14, sentence: "The witness gave a ___ account of what she had seen.", options: ["vague", "vivid", "vacant", "valid"], answer: 1 },
  { id: 15, sentence: "The politician tried to ___ the angry crowd with calm words.", options: ["provoke", "pacify", "perplex", "prevent"], answer: 1 },

  // ── Grammar-based completion ──
  { id: 16, sentence: "Neither the teacher ___ the pupils were happy with the result.", options: ["or", "and", "nor", "but"], answer: 2 },
  { id: 17, sentence: "The team ___ training every morning since September.", options: ["has been", "have being", "has being", "have been"], answer: 3 },
  { id: 18, sentence: "If I ___ taller, I would reach the top shelf.", options: ["am", "was", "were", "be"], answer: 2 },
  { id: 19, sentence: "She ran ___ than anyone else in the race.", options: ["fastest", "more fast", "faster", "most fast"], answer: 2 },
  { id: 20, sentence: "The cake was shared ___ the three children.", options: ["between", "among", "within", "beside"], answer: 1 },
  { id: 21, sentence: "He could ___ believe his eyes when he saw the surprise.", options: ["hard", "harder", "hardly", "hardest"], answer: 2 },
  { id: 22, sentence: "The birds ___ south every autumn.", options: ["migrate", "migrates", "migrating", "migrated"], answer: 0 },
  { id: 23, sentence: "She asked me ___ I had finished my homework.", options: ["weather", "whether", "wether", "whither"], answer: 1 },
  { id: 24, sentence: "The audience ___ asked to remain seated.", options: ["was", "were", "is", "has"], answer: 1 },
  { id: 25, sentence: "Each of the children ___ given a certificate.", options: ["were", "are", "was", "have"], answer: 2 },
  { id: 26, sentence: "The dog lay ___ on the rug all afternoon.", options: ["quiet", "quite", "quietly", "quieter"], answer: 2 },
  { id: 27, sentence: "I would have come if you ___ told me earlier.", options: ["have", "has", "had", "having"], answer: 2 },
  { id: 28, sentence: "She is the ___ of the two sisters.", options: ["tallest", "taller", "more tall", "most tall"], answer: 1 },

  // ── Contextual meaning ──
  { id: 29, sentence: "The ___ of the river made it impossible to cross on foot.", options: ["depth", "length", "height", "width"], answer: 0 },
  { id: 30, sentence: "The captain showed great ___ by saving the passengers first.", options: ["cowardice", "courage", "curiosity", "caution"], answer: 1 },
  { id: 31, sentence: "After weeks of searching, they finally found a ___ explanation.", options: ["plausible", "playful", "pleasant", "plentiful"], answer: 0 },
  { id: 32, sentence: "The headteacher gave a ___ speech about the importance of kindness.", options: ["moving", "removing", "movable", "unmoved"], answer: 0 },
  { id: 33, sentence: "The old map was ___ to the treasure hunters.", options: ["invaluable", "invisible", "invincible", "inevitable"], answer: 0 },
  { id: 34, sentence: "The storm caused ___ damage to the coastal village.", options: ["extensive", "expensive", "exclusive", "excessive"], answer: 0 },
  { id: 35, sentence: "His ___ of the rules led to his disqualification.", options: ["observation", "violation", "celebration", "exploration"], answer: 1 },
  { id: 36, sentence: "The museum contained many ___ artefacts from ancient Egypt.", options: ["priceless", "worthless", "careless", "pointless"], answer: 0 },
  { id: 37, sentence: "The hikers felt a sense of ___ when they reached the summit.", options: ["disappointment", "accomplishment", "embarrassment", "abandonment"], answer: 1 },
  { id: 38, sentence: "The new evidence ___ the earlier theory about the fire.", options: ["contradicted", "contributed", "constructed", "contemplated"], answer: 0 },
  { id: 39, sentence: "It is ___ to wear a seatbelt when travelling by car.", options: ["optional", "occasional", "compulsory", "temporary"], answer: 2 },
  { id: 40, sentence: "The surgeon performed the operation with great ___.", options: ["precision", "decision", "collision", "division"], answer: 0 },
  { id: 41, sentence: "The ___ of the forest was broken only by birdsong.", options: ["silence", "violence", "patience", "absence"], answer: 0 },
  { id: 42, sentence: "The charity event raised a ___ amount of money for the hospital.", options: ["substantial", "suspicious", "superficial", "subsequent"], answer: 0 },
  { id: 43, sentence: "The climber felt ___ as she looked down from the narrow ledge.", options: ["courageous", "cautious", "vertigo", "victorious"], answer: 2 },
  { id: 44, sentence: "The teacher ___ the class for their excellent results.", options: ["condemned", "commended", "commanded", "commenced"], answer: 1 },
  { id: 45, sentence: "The refugees were forced to ___ their homes during the conflict.", options: ["abandon", "abolish", "absorb", "abstain"], answer: 0 },
  { id: 46, sentence: "The athlete's ___ to the sport was clear from her dedication.", options: ["commitment", "compartment", "compliment", "commandment"], answer: 0 },
  { id: 47, sentence: "The new rule was ___ across all schools in the borough.", options: ["implied", "imposed", "imported", "improved"], answer: 1 },
  { id: 48, sentence: "The artist's latest painting was ___ by critics everywhere.", options: ["accused", "acknowledged", "acclaimed", "acquired"], answer: 2 },
  { id: 49, sentence: "The soldiers showed great ___ in the face of danger.", options: ["reluctance", "resilience", "resemblance", "resistance"], answer: 1 },
  { id: 50, sentence: "The politician's promise turned out to be completely ___.", options: ["hollow", "hallowed", "harrowed", "followed"], answer: 0 },
  { id: 51, sentence: "The archaeologist was ___ to find the tomb undisturbed.", options: ["astonished", "abolished", "abstained", "absorbed"], answer: 0 },
  { id: 52, sentence: "The judge dismissed the case due to ___ evidence.", options: ["sufficient", "deficient", "efficient", "proficient"], answer: 1 },
  { id: 53, sentence: "The twins were ___ in appearance but very different in personality.", options: ["identical", "ideal", "idle", "illegal"], answer: 0 },
  { id: 54, sentence: "The rescue team worked ___ through the night to save the trapped miners.", options: ["tirelessly", "timelessly", "tastelessly", "thoughtlessly"], answer: 0 },
  { id: 55, sentence: "The rare butterfly is found ___ in the highlands of Scotland.", options: ["exclusively", "excessively", "extensively", "explosively"], answer: 0 },
  { id: 56, sentence: "The volcano had been ___ for centuries before it suddenly erupted.", options: ["dormant", "dominant", "domestic", "dramatic"], answer: 0 },
  { id: 57, sentence: "The young girl showed ___ maturity for her age.", options: ["reluctant", "remarkable", "redundant", "relentless"], answer: 1 },
  { id: 58, sentence: "The boat ___ gently on the calm lake.", options: ["bobbed", "bounded", "bolted", "blazed"], answer: 0 },
  { id: 59, sentence: "The council decided to ___ the old library and build a new one.", options: ["demolish", "diminish", "distinguish", "distribute"], answer: 0 },
  { id: 60, sentence: "The medicine helped to ___ the patient's pain.", options: ["aggravate", "accelerate", "alleviate", "accumulate"], answer: 2 },
];

// ── Quiz state ──
let questions = [];
let currentIndex = 0;
let results = [];
let answered = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  return shuffle(ALL_QUESTIONS).slice(0, QUIZ_LENGTH);
}

// ── Render functions ──

export function renderHome(app) {
  const state = Store.get();
  const data = state.sections[SECTION_ID] || { completed: 0, correct: 0, total: 0 };

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Sentence Completion</span>
    </div>
    <div class="section-home">
      <p class="section-desc">Read the sentence carefully and pick the best word to fill the gap. Think about meaning, grammar and context.</p>
      <div class="score-stats" style="margin-bottom:24px;">
        <div class="stat-card">
          <div class="stat-value">${data.completed || 0}</div>
          <div class="stat-label">Quizzes done</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0}%</div>
          <div class="stat-label">Accuracy</div>
        </div>
      </div>
      <button class="btn btn-primary" data-action="start-quiz">Start Quiz (${QUIZ_LENGTH} questions)</button>
    </div>`;
}

export function renderPractice(app) {
  if (currentIndex >= questions.length) {
    renderScoreScreen(app);
    return;
  }

  const q = questions[currentIndex];
  answered = false;

  // Replace ___ with a visible blank
  const displaySentence = q.sentence.replace('___', '<span style="border-bottom:2px solid var(--navy); padding:0 16px; margin:0 2px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');

  const optionBtns = q.options.map((opt, i) =>
    `<button class="option-btn" data-action="answer" data-index="${i}">${opt}</button>`
  ).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/${SECTION_ID}">\u2190</a>
      <span class="quiz-title">Sentence Completion</span>
      <span class="quiz-count">${currentIndex + 1}/${questions.length}</span>
    </div>
    ${renderQuizProgress(currentIndex, questions.length, results)}
    <div class="question-area">
      <p class="question-text">${displaySentence}</p>
    </div>
    <div class="options-grid">${optionBtns}</div>`;
}

function renderScoreScreen(app) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz('sentence-completion', xpData.correct, xpData.total, xpData.totalXP);

  const sectionData = Store.get().sections[SECTION_ID] || { completed: 0, correct: 0, total: 0 };
  Store.updateSection(SECTION_ID, {
    completed: (sectionData.completed || 0) + 1,
    correct: (sectionData.correct || 0) + xpData.correct,
    total: (sectionData.total || 0) + xpData.total
  });

  app.innerHTML = renderScoreUI(results, 'Sentence Completion', xpData.totalXP);
  if (window.__showXPToast) window.__showXPToast(`+${xpData.totalXP} XP`);
}

export function renderScore(app) {
  renderScoreScreen(app);
}

// ── Handle answers ──
function handleAnswer(index) {
  if (answered) return;
  answered = true;

  const q = questions[currentIndex];
  const isCorrect = index === q.answer;
  results.push(isCorrect);

  const state = Store.get();
  if (state.settings.soundOn !== false) {
    playSound(isCorrect);
  }

  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  // Show the completed sentence
  if (!isCorrect) {
    const filled = q.sentence.replace('___', `<strong>${q.options[q.answer]}</strong>`);
    const tip = document.createElement('div');
    tip.style.cssText = 'margin-top:16px; padding:12px 16px; background:var(--white); border-radius:var(--radius); font-size:0.9rem; color:var(--text-muted);';
    tip.innerHTML = filled;
    document.querySelector('.options-grid').after(tip);
  }

  setTimeout(() => {
    currentIndex++;
    renderPractice(document.getElementById('app'));
  }, 4000);
}

// ── Init ──
export function init(app) {
  questions = pickQuestions();
  currentIndex = 0;
  results = [];
  renderHome(app);
}

export default function(app) {
  init(app);

  if (app._sentCompHandler) {
    app.removeEventListener('click', app._sentCompHandler);
  }

  const handler = (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'start-quiz') {
      questions = pickQuestions();
      currentIndex = 0;
      results = [];
      renderPractice(app);
    }

    if (action === 'answer') {
      handleAnswer(parseInt(actionEl.dataset.index, 10));
    }

    if (action === 'retry') {
      questions = pickQuestions();
      currentIndex = 0;
      results = [];
      renderHome(app);
    }
  };

  app._sentCompHandler = handler;
  app.addEventListener('click', handler);
}
