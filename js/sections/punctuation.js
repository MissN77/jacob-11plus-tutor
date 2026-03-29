// ── PUNCTUATION SECTION ──────────────────────────────────────────────────────
// GL Assessment style: show a broken sentence, pick the corrected version (MCQ)

import { Store } from '../store.js';
import { renderHeader, renderQuizProgress, renderScore as renderScoreUI } from '../ui.js';
import { calculateQuizXP, xpForCorrectAnswer } from '../xp.js';
import { playSound } from '../audio.js';

const SECTION_ID = 'punctuation';
const QUIZ_LENGTH = 10;

const ALL_QUESTIONS = [
  // ── Capital letters: proper nouns ──
  { id: 1, broken: "jacob visited london on saturday.", options: ["Jacob visited london on saturday.", "jacob visited London on Saturday.", "Jacob visited London on Saturday.", "Jacob Visited London On Saturday."], answer: 2, rule: "Proper nouns (names, places, days) always start with a capital letter." },
  { id: 2, broken: "mrs ahmed teaches science at greenfield school.", options: ["Mrs ahmed teaches science at greenfield school.", "Mrs Ahmed teaches science at Greenfield School.", "mrs Ahmed teaches Science at Greenfield School.", "Mrs Ahmed Teaches Science At Greenfield School."], answer: 1, rule: "Names of people and places need capital letters." },
  { id: 3, broken: "we went to france in july.", options: ["We went to france in July.", "We went to France in july.", "We went to France in July.", "we went to France in July."], answer: 2, rule: "Countries and months need capital letters, and so does the start of a sentence." },
  { id: 4, broken: "the river thames flows through london.", options: ["The River Thames flows through london.", "The river thames flows through London.", "The River Thames flows through London.", "the River Thames flows through London."], answer: 2, rule: "Named rivers and cities are proper nouns and need capital letters." },
  { id: 5, broken: "queen elizabeth opened the new hospital.", options: ["queen Elizabeth opened the new hospital.", "Queen elizabeth opened the new hospital.", "Queen Elizabeth opened the new Hospital.", "Queen Elizabeth opened the new hospital."], answer: 3, rule: "Titles and names of people need capital letters." },

  // ── Capital letters: start of sentences ──
  { id: 6, broken: "the cat sat on the mat. it was very warm.", options: ["the cat sat on the mat. It was very warm.", "The cat sat on the mat. it was very warm.", "The cat sat on the mat. It was very warm.", "The Cat Sat On The Mat. It Was Very Warm."], answer: 2, rule: "Every sentence must start with a capital letter." },
  { id: 7, broken: "we ran home quickly. the rain had started.", options: ["We ran home quickly. the rain had started.", "We ran home quickly. The rain had started.", "we ran home quickly. The rain had started.", "We Ran Home Quickly. The Rain Had Started."], answer: 1, rule: "Both sentences need a capital letter at the start." },

  // ── Full stops, question marks, exclamation marks ──
  { id: 8, broken: "The dog barked loudly", options: ["The dog barked loudly,", "The dog barked loudly.", "The dog barked loudly!", "The dog barked loudly?"], answer: 1, rule: "A simple statement ends with a full stop." },
  { id: 9, broken: "Where did you put my bag", options: ["Where did you put my bag.", "Where did you put my bag,", "Where did you put my bag!", "Where did you put my bag?"], answer: 3, rule: "A question ends with a question mark." },
  { id: 10, broken: "Watch out for the car", options: ["Watch out for the car.", "Watch out for the car?", "Watch out for the car!", "Watch out for the car,"], answer: 2, rule: "An urgent warning or exclamation ends with an exclamation mark." },
  { id: 11, broken: "How old are you", options: ["How old are you.", "How old are you!", "How old are you,", "How old are you?"], answer: 3, rule: "This is a question and needs a question mark." },
  { id: 12, broken: "That was the best day ever", options: ["That was the best day ever.", "That was the best day ever!", "That was the best day ever?", "That was the best day ever,"], answer: 1, rule: "A strong feeling or exclamation ends with an exclamation mark." },

  // ── Commas in lists ──
  { id: 13, broken: "I packed a tent a torch a sleeping bag and some food.", options: ["I packed a tent, a torch, a sleeping bag, and some food.", "I packed a tent a torch a sleeping bag, and some food.", "I packed, a tent a torch a sleeping bag and some food.", "I packed a tent, a torch, a sleeping bag and, some food."], answer: 0, rule: "Commas separate items in a list." },
  { id: 14, broken: "She bought apples oranges bananas and grapes.", options: ["She bought apples oranges, bananas and grapes.", "She bought apples, oranges, bananas, and grapes.", "She bought, apples, oranges, bananas and grapes.", "She bought apples, oranges bananas and grapes."], answer: 1, rule: "Use commas to separate each item in a list." },
  { id: 15, broken: "The flag was red white and blue.", options: ["The flag was red white, and blue.", "The flag was red, white, and blue.", "The flag was, red, white and blue.", "The flag was red, white and, blue."], answer: 1, rule: "Commas go between items in a list." },
  { id: 16, broken: "We need flour eggs butter and sugar for the cake.", options: ["We need flour, eggs, butter, and sugar for the cake.", "We need flour eggs, butter and sugar for the cake.", "We need, flour, eggs, butter and sugar for the cake.", "We need flour, eggs butter, and sugar for the cake."], answer: 0, rule: "Each item in a list is separated by a comma." },

  // ── Commas after fronted adverbials ──
  { id: 17, broken: "Carefully the boy crossed the road.", options: ["Carefully the boy, crossed the road.", "Carefully, the boy crossed the road.", "Carefully the boy crossed, the road.", "Carefully the, boy crossed the road."], answer: 1, rule: "A comma follows a fronted adverbial (a word or phrase at the start that tells you how, when or where)." },
  { id: 18, broken: "Later that evening we ate dinner.", options: ["Later, that evening we ate dinner.", "Later that evening we ate, dinner.", "Later that evening, we ate dinner.", "Later that, evening we ate dinner."], answer: 2, rule: "A comma comes after a fronted adverbial phrase." },
  { id: 19, broken: "Without warning the thunder roared.", options: ["Without, warning the thunder roared.", "Without warning, the thunder roared.", "Without warning the, thunder roared.", "Without warning the thunder, roared."], answer: 1, rule: "Put a comma after a fronted adverbial." },
  { id: 20, broken: "As quick as a flash the cat pounced.", options: ["As quick as a flash, the cat pounced.", "As quick, as a flash the cat pounced.", "As quick as a flash the cat, pounced.", "As quick as, a flash the cat pounced."], answer: 0, rule: "A comma separates a fronted adverbial from the main clause." },
  { id: 21, broken: "Every morning the birds sing loudly.", options: ["Every, morning the birds sing loudly.", "Every morning, the birds sing loudly.", "Every morning the birds, sing loudly.", "Every morning the, birds sing loudly."], answer: 1, rule: "A fronted adverbial of time is followed by a comma." },

  // ── Commas before conjunctions ──
  { id: 22, broken: "I wanted to go outside but it was raining.", options: ["I wanted to go outside but, it was raining.", "I wanted to go outside, but it was raining.", "I wanted, to go outside but it was raining.", "I, wanted to go outside but it was raining."], answer: 1, rule: "A comma goes before a conjunction (but, so, yet) that joins two main clauses." },
  { id: 23, broken: "She studied hard so she passed the test.", options: ["She studied hard so, she passed the test.", "She studied hard, so she passed the test.", "She, studied hard so she passed the test.", "She studied, hard so she passed the test."], answer: 1, rule: "Use a comma before 'so' when joining two clauses." },

  // ── Apostrophes for contraction ──
  { id: 24, broken: "I do not think he is coming today.", options: ["I don't think he's coming today.", "I do'nt think hes coming today.", "I dont think he's coming today.", "I don't think hes coming today."], answer: 0, rule: "Apostrophes replace missing letters in contractions: do not = don't, he is = he's." },
  { id: 25, broken: "She can not find her bag. It is lost.", options: ["She can't find her bag. Its lost.", "She can't find her bag. It's lost.", "She cant find her bag. It's lost.", "She ca'nt find her bag. It's lost."], answer: 1, rule: "can not = can't, It is = It's (with apostrophe)." },
  { id: 26, broken: "They will not be late. We are leaving now.", options: ["They won't be late. We're leaving now.", "They wo'nt be late. Were leaving now.", "They wont be late. We're leaving now.", "They won't be late. Were leaving now."], answer: 0, rule: "will not = won't, We are = We're." },
  { id: 27, broken: "I would have gone if you had told me.", options: ["I would've gone if you'd told me.", "I would'ave gone if youd told me.", "I wouldve gone if you'd told me.", "I would've gone if yo'ud told me."], answer: 0, rule: "would have = would've, you had = you'd." },
  { id: 28, broken: "He has not eaten yet. They have already left.", options: ["He hasn't eaten yet. They've already left.", "He has'nt eaten yet. Theyve already left.", "He hasnt eaten yet. They've already left.", "He hasn't eaten yet. Theyve already left."], answer: 0, rule: "has not = hasn't, They have = They've." },

  // ── Apostrophes for possession ──
  { id: 29, broken: "The hat that belongs to the girl is red.", options: ["The girls hat is red.", "The girl's hat is red.", "The girls' hat is red.", "The girl hat's is red."], answer: 1, rule: "Add 's to show that something belongs to one person: the girl's hat." },
  { id: 30, broken: "The kennel belonging to the dog was broken.", options: ["The dogs kennel was broken.", "The dogs' kennel was broken.", "The dog's kennel was broken.", "The dog kennel's was broken."], answer: 2, rule: "One dog owns the kennel, so we write dog's (apostrophe before the s)." },
  { id: 31, broken: "The toys belonging to the children were everywhere.", options: ["The childrens toys were everywhere.", "The children's toys were everywhere.", "The childrens' toys were everywhere.", "The children toys' were everywhere."], answer: 1, rule: "Children is already plural, so add 's: children's." },
  { id: 32, broken: "The car belonging to Mr Jones was parked outside.", options: ["Mr Jones car was parked outside.", "Mr Jone's car was parked outside.", "Mr Jones' car was parked outside.", "Mr Jones's car was parked outside."], answer: 2, rule: "For names ending in s, add just an apostrophe: Mr Jones' car." },
  { id: 33, broken: "The coats belonging to the boys were on the floor.", options: ["The boy's coats were on the floor.", "The boys coats were on the floor.", "The boys's coats were on the floor.", "The boys' coats were on the floor."], answer: 3, rule: "More than one boy owns the coats, so the apostrophe goes after the s: boys'." },

  // ── Speech marks ──
  { id: 34, broken: "Come here called Mum.", options: ["\"Come here,\" called Mum.", "Come here, called Mum.", "\"Come here\" called Mum.", "Come here called \"Mum.\""], answer: 0, rule: "Speech marks go around the spoken words, and a comma separates them from the reporting clause." },
  { id: 35, broken: "I love chocolate said Ava.", options: ["\"I love chocolate\" said Ava.", "I love chocolate, said Ava.", "\"I love chocolate,\" said Ava.", "\"I love, chocolate\" said Ava."], answer: 2, rule: "Put speech marks around what is said, and a comma before the closing speech marks." },
  { id: 36, broken: "Where are you going asked Dad.", options: ["\"Where are you going?\" asked Dad.", "\"Where are you going,\" asked Dad.", "Where are you going? asked Dad.", "\"Where are you going\" asked Dad."], answer: 0, rule: "If the speech is a question, the question mark goes inside the speech marks." },
  { id: 37, broken: "Stop shouted the teacher.", options: ["\"Stop,\" shouted the teacher.", "\"Stop!\" shouted the teacher.", "Stop! shouted the teacher.", "\"Stop\" shouted the teacher."], answer: 1, rule: "An exclamation mark goes inside the speech marks when the speech is a command or shout." },
  { id: 38, broken: "Mum said Eat your vegetables.", options: ["Mum said, \"Eat your vegetables.\"", "Mum said \"eat your vegetables.\"", "Mum said, eat your vegetables.", "\"Mum said,\" eat your vegetables."], answer: 0, rule: "When the reporting clause comes first, a comma and opening speech marks follow." },
  { id: 39, broken: "That is amazing whispered Lily.", options: ["\"That is amazing,\" whispered Lily.", "That is amazing, whispered Lily.", "\"That is amazing\" whispered Lily.", "\"That is amazing!\" whispered Lily."], answer: 3, rule: "An exclamation inside speech needs an exclamation mark before the closing speech marks." },

  // ── Semicolons ──
  { id: 40, broken: "It was raining heavily the match was cancelled.", options: ["It was raining heavily, the match was cancelled.", "It was raining heavily; the match was cancelled.", "It was raining heavily the match, was cancelled.", "It was raining heavily. the match was cancelled."], answer: 1, rule: "A semicolon joins two closely related main clauses." },
  { id: 41, broken: "Some children like football others prefer swimming.", options: ["Some children like football, others prefer swimming.", "Some children like football; others prefer swimming.", "Some children like football others, prefer swimming.", "Some children like football. others prefer swimming."], answer: 1, rule: "Use a semicolon to link two balanced or contrasting clauses." },
  { id: 42, broken: "The sun set slowly the sky turned orange.", options: ["The sun set slowly, the sky turned orange.", "The sun set slowly the sky, turned orange.", "The sun set slowly; the sky turned orange.", "The sun set slowly. the sky turned orange."], answer: 2, rule: "A semicolon links two related independent clauses." },

  // ── Colons ──
  { id: 43, broken: "You will need the following items a pen a ruler and a rubber.", options: ["You will need the following items: a pen, a ruler, and a rubber.", "You will need the following items, a pen, a ruler, and a rubber.", "You will need the following items a pen, a ruler, and a rubber.", "You will need: the following items a pen a ruler and a rubber."], answer: 0, rule: "A colon introduces a list." },
  { id: 44, broken: "There was one problem the door was locked.", options: ["There was one problem, the door was locked.", "There was one problem; the door was locked.", "There was one problem: the door was locked.", "There was one problem. The door was locked."], answer: 2, rule: "A colon can introduce an explanation or expand on the first clause." },
  { id: 45, broken: "She had three wishes a puppy a bicycle and a holiday.", options: ["She had three wishes, a puppy, a bicycle, and a holiday.", "She had three wishes: a puppy, a bicycle, and a holiday.", "She had three wishes; a puppy, a bicycle, and a holiday.", "She had three wishes a puppy, a bicycle and, a holiday."], answer: 1, rule: "A colon introduces the list of wishes." },

  // ── Mixed / tricky ──
  { id: 46, broken: "its a lovely day isnt it", options: ["Its a lovely day, isn't it?", "It's a lovely day, isnt it?", "It's a lovely day, isn't it?", "Its a lovely day isnt it?"], answer: 2, rule: "It's = It is (contraction). isn't = is not. A question needs a question mark." },
  { id: 47, broken: "the dogs bone was buried in sarahs garden", options: ["The dog's bone was buried in Sarah's garden.", "The dogs bone was buried in Sarahs garden.", "The dogs' bone was buried in Sarah's garden.", "The dog's bone was buried in Sarahs garden."], answer: 0, rule: "The bone belongs to the dog (dog's) and the garden belongs to Sarah (Sarah's). Proper nouns need capitals." },
  { id: 48, broken: "after the storm we found three things a broken fence a fallen tree and a flooded path", options: ["After the storm, we found three things: a broken fence, a fallen tree, and a flooded path.", "After the storm we found three things, a broken fence, a fallen tree, and a flooded path.", "After the storm, we found three things; a broken fence, a fallen tree, and a flooded path.", "After the storm we found three things: a broken fence a fallen tree and a flooded path."], answer: 0, rule: "Comma after the fronted adverbial, colon before the list, commas between items." },
  { id: 49, broken: "dont touch that shouted mr harris its extremely hot", options: ["\"Don't touch that!\" shouted Mr Harris. \"It's extremely hot!\"", "\"Dont touch that\" shouted Mr Harris. \"Its extremely hot.\"", "Don't touch that! shouted Mr Harris. It's extremely hot!", "\"Don't touch that,\" shouted mr Harris. \"It's extremely hot.\""], answer: 0, rule: "Speech marks around spoken words, contractions need apostrophes, Mr Harris has capitals." },
  { id: 50, broken: "although it was cold the childrens match went ahead the teachers were impressed", options: ["Although it was cold, the children's match went ahead; the teachers were impressed.", "Although it was cold the childrens match went ahead, the teachers were impressed.", "Although it was cold, the childrens' match went ahead; the teachers were impressed.", "Although it was cold, the children's match went ahead the teachers were impressed."], answer: 0, rule: "Comma after subordinate clause, children's (irregular plural possession), semicolon to join related clauses." },
];

// ── Quiz engine state ──
let questions = [];
let currentIndex = 0;
let results = [];
let consecutiveCorrect = 0;
let totalXPEarned = 0;
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
      <span class="quiz-title">Punctuation</span>
    </div>
    <div class="section-home">
      <p class="section-desc">Fix the punctuation! Each question shows a broken sentence. Pick the version that is correctly punctuated.</p>
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

  const optionBtns = q.options.map((opt, i) =>
    `<button class="option-btn" data-action="answer" data-index="${i}">${opt}</button>`
  ).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/${SECTION_ID}">\u2190</a>
      <span class="quiz-title">Punctuation</span>
      <span class="quiz-count">${currentIndex + 1}/${questions.length}</span>
    </div>
    ${renderQuizProgress(currentIndex, questions.length, results)}
    <div class="question-area">
      <p class="question-text" style="font-family:monospace; font-size:1.05rem;">${q.broken}</p>
    </div>
    <p style="text-align:centre; color:var(--text-muted); margin-bottom:12px; font-size:0.85rem;">Which version is correctly punctuated?</p>
    <div class="options-grid" style="grid-template-columns:1fr;">${optionBtns}</div>`;
}

function renderScoreScreen(app) {
  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz('punctuation', xpData.correct, xpData.total, xpData.totalXP);

  const sectionData = Store.get().sections[SECTION_ID] || { completed: 0, correct: 0, total: 0 };
  Store.updateSection(SECTION_ID, {
    completed: (sectionData.completed || 0) + 1,
    correct: (sectionData.correct || 0) + xpData.correct,
    total: (sectionData.total || 0) + xpData.total
  });

  app.innerHTML = renderScoreUI(results, 'Punctuation', xpData.totalXP);
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

  if (isCorrect) {
    consecutiveCorrect++;
  } else {
    consecutiveCorrect = 0;
  }

  const state = Store.get();
  if (state.settings.soundOn !== false) {
    playSound(isCorrect);
  }

  // Highlight buttons
  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    if (i === index && !isCorrect) btn.classList.add('wrong');
  });

  // Show rule
  const ruleEl = document.createElement('div');
  ruleEl.className = 'question-rule';
  ruleEl.style.cssText = 'margin-top:16px; padding:12px 16px; background:var(--white); border-radius:var(--radius); font-size:0.9rem; color:var(--text-muted);';
  ruleEl.textContent = q.rule;
  document.querySelector('.options-grid').after(ruleEl);

  setTimeout(() => {
    currentIndex++;
    renderPractice(document.getElementById('app'));
  }, 1800);
}

// ── Init (called by app.js) ──
export function init(app) {
  questions = pickQuestions();
  currentIndex = 0;
  results = [];
  consecutiveCorrect = 0;
  totalXPEarned = 0;

  renderHome(app);
}

// ── Delegated event listener setup ──
export default function(app) {
  init(app);

  // Remove old listener if any
  if (app._punctuationHandler) {
    app.removeEventListener('click', app._punctuationHandler);
  }

  const handler = (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'start-quiz') {
      questions = pickQuestions();
      currentIndex = 0;
      results = [];
      consecutiveCorrect = 0;
      renderPractice(app);
    }

    if (action === 'answer') {
      const idx = parseInt(actionEl.dataset.index, 10);
      handleAnswer(idx);
    }

    if (action === 'retry') {
      questions = pickQuestions();
      currentIndex = 0;
      results = [];
      consecutiveCorrect = 0;
      renderHome(app);
    }
  };

  app._punctuationHandler = handler;
  app.addEventListener('click', handler);
}
