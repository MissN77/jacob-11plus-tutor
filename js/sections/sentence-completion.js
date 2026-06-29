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

  // ── Vocabulary in context (extended set) ──
  { id: 61, sentence: "The journalist refused to ___ her sources, even under pressure.", options: ["reveal", "repeal", "repel", "relay"], answer: 0 },
  { id: 62, sentence: "The painting was so ___ that visitors stood in silence before it.", options: ["mediocre", "mundane", "majestic", "marginal"], answer: 2 },
  { id: 63, sentence: "The student's essay was praised for its ___ use of evidence.", options: ["arbitrary", "judicious", "reckless", "haphazard"], answer: 1 },
  { id: 64, sentence: "The noise from the construction site was ___ and impossible to ignore.", options: ["tranquil", "serene", "deafening", "muffled"], answer: 2 },
  { id: 65, sentence: "She was ___ in her efforts to help others, never taking a day off.", options: ["reluctant", "incessant", "tireless", "indifferent"], answer: 2 },
  { id: 66, sentence: "The river had ___ the valley over thousands of years.", options: ["elevated", "eroded", "erupted", "evaded"], answer: 1 },
  { id: 67, sentence: "The ambassador spoke with great ___, choosing every word carefully.", options: ["diplomacy", "democracy", "diligence", "dominance"], answer: 0 },
  { id: 68, sentence: "The charity was set up to ___ the suffering of homeless people.", options: ["amplify", "alleviate", "aggravate", "abolish"], answer: 1 },
  { id: 69, sentence: "His ___ attitude meant he never listened to anyone else's ideas.", options: ["humble", "arrogant", "timid", "generous"], answer: 1 },
  { id: 70, sentence: "The detective's ___ questioning eventually led to a confession.", options: ["persistent", "passive", "polite", "playful"], answer: 0 },
  { id: 71, sentence: "The landscape was ___, with rolling hills stretching to the horizon.", options: ["breathtaking", "threatening", "exhausting", "forgettable"], answer: 0 },
  { id: 72, sentence: "The new law was intended to ___ discrimination in the workplace.", options: ["encourage", "eradicate", "evaluate", "elaborate"], answer: 1 },
  { id: 73, sentence: "She ___ her achievements, never boasting despite her success.", options: ["exaggerated", "diminished", "understated", "celebrated"], answer: 2 },
  { id: 74, sentence: "The professor gave a ___ lecture that left students with more questions than answers.", options: ["stimulating", "boring", "confusing", "rehearsed"], answer: 0 },
  { id: 75, sentence: "The ancient ruins were a testament to the ___ of a great civilisation.", options: ["downfall", "grandeur", "mediocrity", "isolation"], answer: 1 },
  { id: 76, sentence: "The footballer showed great ___ after being unfairly sent off.", options: ["composure", "aggression", "indignation", "despair"], answer: 0 },
  { id: 77, sentence: "The government promised to ___ funds to schools in deprived areas.", options: ["withhold", "allocate", "confiscate", "deplete"], answer: 1 },
  { id: 78, sentence: "The young pianist gave a ___ performance that astonished the critics.", options: ["flawless", "amateur", "hesitant", "forgettable"], answer: 0 },
  { id: 79, sentence: "The explorers were ___ by the sheer size of the cave system.", options: ["bored", "overwhelmed", "underwhelmed", "irritated"], answer: 1 },
  { id: 80, sentence: "The author used ___ language to paint a vivid picture of the scene.", options: ["technical", "vague", "evocative", "minimal"], answer: 2 },

  // ── Double-meaning and precision ──
  { id: 81, sentence: "She had a ___ effect on everyone around her, lifting their spirits.", options: ["dismal", "toxic", "uplifting", "neutral"], answer: 2 },
  { id: 82, sentence: "The factory workers went on ___ to demand better pay.", options: ["strike", "stroke", "street", "stride"], answer: 0 },
  { id: 83, sentence: "The suspect had an ___ alibi for the night of the theft.", options: ["irrelevant", "unbreakable", "airtight", "questionable"], answer: 2 },
  { id: 84, sentence: "The weather forecast proved ___ when the sun appeared at noon.", options: ["accurate", "inaccurate", "irrelevant", "alarming"], answer: 0 },
  { id: 85, sentence: "Her argument was so ___ that nobody could find fault with it.", options: ["vague", "illogical", "compelling", "confusing"], answer: 2 },
  { id: 86, sentence: "The climbers faced ___ conditions near the summit.", options: ["tropical", "treacherous", "tranquil", "trivial"], answer: 1 },
  { id: 87, sentence: "The headteacher's decision to cancel the trip was highly ___.", options: ["popular", "controversial", "irrelevant", "trivial"], answer: 1 },
  { id: 88, sentence: "The scientist's findings were ___ by researchers across the world.", options: ["dismissed", "replicated", "ignored", "misunderstood"], answer: 1 },
  { id: 89, sentence: "She remained ___ under pressure, never showing a hint of fear.", options: ["composed", "frantic", "erratic", "hesitant"], answer: 0 },
  { id: 90, sentence: "The building had been ___ over many years and was now unsafe.", options: ["restored", "neglected", "renovated", "celebrated"], answer: 1 },

  // ── Grammar and syntax ──
  { id: 91, sentence: "By the time we arrived, the show ___ already started.", options: ["had", "has", "have", "having"], answer: 0 },
  { id: 92, sentence: "The council agreed that the park ___ be reopened immediately.", options: ["should", "would of", "will", "shall of"], answer: 0 },
  { id: 93, sentence: "Not only did she win the race, ___ she broke the record.", options: ["but also", "and also", "however", "despite"], answer: 0 },
  { id: 94, sentence: "The report was written ___ in order to mislead the public.", options: ["deliberate", "deliberately", "deliberating", "deliberation"], answer: 1 },
  { id: 95, sentence: "We will not leave ___ everyone has been accounted for.", options: ["since", "until", "whilst", "although"], answer: 1 },
  { id: 96, sentence: "She finished her homework before her brother ___ his.", options: ["finish", "finishing", "finished", "finishes"], answer: 2 },
  { id: 97, sentence: "The team performed well ___ the difficult conditions.", options: ["despite", "although", "however", "unless"], answer: 0 },
  { id: 98, sentence: "___ the rain, the match went ahead as planned.", options: ["Although", "Despite", "However", "Unless"], answer: 1 },
  { id: 99, sentence: "The more she practised, ___ she became.", options: ["the confident", "confident", "the more confident", "more confident"], answer: 2 },
  { id: 100, sentence: "He would have passed the test if he ___ harder.", options: ["study", "studies", "had studied", "was studying"], answer: 2 },

  // ── Academic vocabulary ──
  { id: 101, sentence: "The results of the experiment were ___, so the team repeated it.", options: ["definitive", "inconclusive", "irrelevant", "predictable"], answer: 1 },
  { id: 102, sentence: "The charity relied on ___ donations to fund its work.", options: ["voluntary", "mandatory", "compulsory", "obligatory"], answer: 0 },
  { id: 103, sentence: "The two sides reached a ___ after hours of negotiation.", options: ["confrontation", "compromise", "catastrophe", "contradiction"], answer: 1 },
  { id: 104, sentence: "The species is now ___ due to the destruction of its habitat.", options: ["thriving", "extinct", "dormant", "abundant"], answer: 1 },
  { id: 105, sentence: "The council voted to ___ the proposal by a large majority.", options: ["reject", "accept", "ignore", "delay"], answer: 1 },
  { id: 106, sentence: "The evidence ___ the defendant and he was acquitted.", options: ["incriminated", "exonerated", "convicted", "arrested"], answer: 1 },
  { id: 107, sentence: "Her speech was so ___ that many in the audience were moved to tears.", options: ["monotonous", "eloquent", "ambiguous", "technical"], answer: 1 },
  { id: 108, sentence: "The prime minister faced fierce ___ over the new tax policy.", options: ["praise", "opposition", "approval", "indifference"], answer: 1 },
  { id: 109, sentence: "The museum was able to ___ the stolen artefacts after years of negotiation.", options: ["duplicate", "repatriate", "confiscate", "reproduce"], answer: 1 },
  { id: 110, sentence: "The theory was ___ by a series of controlled experiments.", options: ["disproved", "validated", "overlooked", "simplified"], answer: 1 },

  // ── Figurative and idiomatic ──
  { id: 111, sentence: "She had a ___ memory and could recall every detail of the day.", options: ["photographic", "selective", "short-term", "hazy"], answer: 0 },
  { id: 112, sentence: "The news was a ___ for the grieving family, bringing some hope.", options: ["setback", "burden", "silver lining", "red herring"], answer: 2 },
  { id: 113, sentence: "The new employee quickly ___ and became an important part of the team.", options: ["stood out", "fell behind", "hit the ground running", "dropped the ball"], answer: 2 },
  { id: 114, sentence: "After the argument, the two friends decided to ___ their differences.", options: ["ignore", "bury", "celebrate", "exaggerate"], answer: 1 },
  { id: 115, sentence: "The politician tried to ___ the scandal by changing the subject.", options: ["address", "deflect", "amplify", "publicise"], answer: 1 },
  { id: 116, sentence: "The cold snap was short-lived; the temperature ___ the following day.", options: ["plunged", "fluctuated", "soared", "maintained"], answer: 2 },
  { id: 117, sentence: "Her decision to study medicine was ___ by her desire to help others.", options: ["driven", "driven back", "discouraged", "prevented"], answer: 0 },
  { id: 118, sentence: "The documentary shed ___ on a little-known chapter of history.", options: ["darkness", "doubt", "light", "shadow"], answer: 2 },
  { id: 119, sentence: "He turned over a new ___ and vowed to study harder.", options: ["page", "leaf", "chapter", "book"], answer: 1 },
  { id: 120, sentence: "The detective followed every ___ but the case remained unsolved.", options: ["clue", "lead", "hint", "trail"], answer: 1 },

  // ── Connectives and cohesion ──
  { id: 121, sentence: "The film was entertaining; ___, the ending was disappointing.", options: ["furthermore", "however", "therefore", "moreover"], answer: 1 },
  { id: 122, sentence: "She trained every day; ___, she won the championship.", options: ["however", "consequently", "despite", "although"], answer: 1 },
  { id: 123, sentence: "___ the evidence was strong, the jury took three days to decide.", options: ["Because", "Although", "Therefore", "Since"], answer: 1 },
  { id: 124, sentence: "The cost was high; ___, the benefits outweighed the expense.", options: ["similarly", "nevertheless", "consequently", "likewise"], answer: 1 },
  { id: 125, sentence: "The road was closed ___ the flooding.", options: ["because of", "in spite of", "although", "in contrast to"], answer: 0 },
  { id: 126, sentence: "He worked overtime every night; ___, he missed the deadline.", options: ["consequently", "moreover", "even so", "in addition"], answer: 2 },
  { id: 127, sentence: "She studied French; ___, she studied Spanish.", options: ["on the other hand", "in addition", "as a result", "in contrast"], answer: 1 },
  { id: 128, sentence: "The bridge was too weak; ___, a detour was put in place.", options: ["although", "however", "therefore", "nonetheless"], answer: 2 },
  { id: 129, sentence: "He was late ___ the traffic was unusually heavy.", options: ["despite", "because", "although", "unless"], answer: 1 },
  { id: 130, sentence: "She was exhausted; ___, she refused to give up.", options: ["therefore", "consequently", "nonetheless", "similarly"], answer: 2 },

  // ── Precise word choice ──
  { id: 131, sentence: "The fire ___ quickly through the dry forest.", options: ["crept", "spread", "moved", "went"], answer: 1 },
  { id: 132, sentence: "The audience ___ as the magician revealed his final trick.", options: ["whispered", "gasped", "muttered", "sighed"], answer: 1 },
  { id: 133, sentence: "The old man ___ slowly along the seafront, leaning on his stick.", options: ["sprinted", "shuffled", "marched", "charged"], answer: 1 },
  { id: 134, sentence: "The river ___ over the rocks, catching the light.", options: ["trickled", "flooded", "gushed", "sparkled"], answer: 3 },
  { id: 135, sentence: "Her voice ___ as she began to read the results aloud.", options: ["thundered", "trembled", "boomed", "echoed"], answer: 1 },
  { id: 136, sentence: "The dog ___ its tail excitedly as its owner walked through the door.", options: ["dragged", "wagged", "lifted", "tucked"], answer: 1 },
  { id: 137, sentence: "The rain ___ against the window all through the night.", options: ["patted", "tapped", "lashed", "touched"], answer: 2 },
  { id: 138, sentence: "The children ___ with laughter when the clown fell over.", options: ["muttered", "sighed", "erupted", "whispered"], answer: 2 },
  { id: 139, sentence: "The mountain ___ above the surrounding villages.", options: ["sank", "loomed", "hid", "crouched"], answer: 1 },
  { id: 140, sentence: "The surgeon worked with ___ precision, making the smallest possible incision.", options: ["careless", "approximate", "exquisite", "crude"], answer: 2 },
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

  // Shuffle options so the correct answer isn't predictable
  const indices = [0,1,2,3].filter(i => i < q.options.length);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  q._shuffledAnswer = indices.indexOf(q.answer);

  const optionBtns = indices.map((origIdx, newIdx) =>
    `<button class="option-btn" data-action="answer" data-index="${newIdx}">${q.options[origIdx]}</button>`
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
  const correctIdx = (q._shuffledAnswer !== undefined) ? q._shuffledAnswer : q.answer;
  const isCorrect = index === correctIdx;
  results.push(isCorrect);

  const state = Store.get();
  if (state.settings.soundOn !== false) {
    playSound(isCorrect);
  }

  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIdx) btn.classList.add('correct');
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
