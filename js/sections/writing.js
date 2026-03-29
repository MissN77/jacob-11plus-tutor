// ── WRITING SECTION ──────────────────────────────────────────────────────────
// WIBFEN writing tool - not a quiz. Shows book list, WIBFEN prompts, text areas.
// Auto-saves to localStorage every 5 seconds.

import { Store } from '../store.js';

const SECTION_ID = 'writing';
const STORAGE_KEY = 'j11_writing';
const AUTOSAVE_INTERVAL = 5000;
const MIN_WORDS = 30;

const WIBFEN_LETTERS = [
  { letter: 'W', colour: '#E87461' },
  { letter: 'I', colour: '#1A8A7D' },
  { letter: 'B', colour: '#1B2A4A' },
  { letter: 'F', colour: '#E8D48A' },
  { letter: 'E', colour: '#D4C2DF' },
  { letter: 'N', colour: '#2D8659' },
];

// ── BOOK DATA WITH WIBFEN PROMPTS ──

const BOOKS = [
  {
    id: 'goldie-leigh',
    title: 'Goldie Leigh Hospital',
    wibfen: {
      W: { title: "WHO are the main characters in this story?", prompts: [
        "Who were the orphans at Goldie Leigh? What words would you use to describe their lives?",
        "Who were the doctors treating ringworm? Were they kind or cruel?",
        "Who were the hospital staff during the war? What kind of people were they?",
        "Who were the children admitted in 1961? How were they treated by society?"
      ]},
      I: { title: "What was IMPORTANT to them? Why?", prompts: [
        "What was important to the orphans? Did they just need a roof, or something more?",
        "What was important to the doctors? Why did they choose radiation?",
        "What was important to the hospital staff during the Blitz?",
        "Why was it important that children with learning difficulties had somewhere to go?"
      ]},
      B: { title: "What was the BLOCKER?", prompts: [
        "What stopped the orphans from having a normal childhood?",
        "What was the blocker for treating ringworm safely?",
        "What was the blocker during the war? What weapon made it impossible to stay?",
        "What was the blocker for children with learning difficulties?"
      ]},
      F: { title: "What was the FIX or solution?", prompts: [
        "How did the Woolwich Union try to fix the problem of orphaned children?",
        "How did doctors try to fix ringworm? Did the fix turn out to be worse than the problem?",
        "How did the hospital fix the danger from V2 rockets?",
        "How did the NHS try to fix things after 1961?"
      ]},
      E: { title: "What happened in the END?", prompts: [
        "What happened to the children who had radiation? What does iatrogenic mean?",
        "What happened to Goldie Leigh Hospital in 1988?",
        "What is on the site today? Who uses it now?",
        "How do you think the people treated as children felt when they found out about the harm?"
      ]},
      N: { title: "What happened NEXT? What should happen next?", prompts: [
        "What lessons did the medical profession learn?",
        "How do doctors test treatments today to make sure they are safe?",
        "Should there be a memorial at Goldie Leigh? Why or why not?",
        "You are visiting this place. What will you look out for?"
      ]}
    }
  },
  {
    id: 'tower-of-london',
    title: 'Tower of London',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who were the most important people in this story? Describe them.",
        "What kind of person was Richard Duke of Gloucester?",
        "How would you describe Henry VIII based on how he treated Anne Boleyn?",
        "What words would you use to describe Guy Fawkes?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "What did William the Conqueror want when he built the Tower?",
        "Why was the throne so important to Richard?",
        "What did Guy Fawkes believe was worth risking his life for?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What stood in the way of Richard becoming king?",
        "What blocked Anne Boleyn from saving herself?",
        "What went wrong for Guy Fawkes and the conspirators?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "How did Richard deal with the two princes?",
        "How did Henry VIII solve his problem with Anne Boleyn?",
        "How did the authorities deal with Guy Fawkes?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "What happened to the princes in the Tower?",
        "What was Anne Boleyn's fate?",
        "What happened to Guy Fawkes and the other plotters?",
        "What is the Tower used for today?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "What discovery was made beneath a staircase nearly two hundred years later?",
        "How is the Gunpowder Plot remembered today?",
        "Why is the Tower now one of London's biggest tourist attractions?"
      ]}
    }
  },
  {
    id: 'great-plague',
    title: 'Great Plague of 1665',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who were the key people or groups? Describe them.",
        "What kind of leader was King Charles II?",
        "How would you describe William Mompesson, the rector of Eyam?",
        "What words describe the ordinary people of London who were left behind?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "What mattered to the authorities who painted red crosses on doors?",
        "What was most important to the villagers of Eyam?",
        "Why was it important for the Bills of Mortality to be published?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What made it so difficult to stop the plague spreading?",
        "Why did the remedies people tried not work?",
        "What prevented the poor from escaping like the wealthy?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "What precautions did the authorities try?",
        "What was Eyam's solution?",
        "What unexpected event may have helped end the plague?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "How many people died during the Great Plague?",
        "What happened to the village of Eyam?",
        "How did the Great Fire of 1666 change London?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "How did the Great Fire change the way London was rebuilt?",
        "What did people learn about dealing with epidemics?",
        "Any connections between the Great Plague and more recent outbreaks?"
      ]}
    }
  },
  {
    id: 'bedlam',
    title: 'Bedlam',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who were the patients in Bedlam? What adjectives describe them?",
        "Who were the spectators? What kind of people visited?",
        "Who were the reformers?",
        "Who were the staff and 'basket men'?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "Why did hospital managers keep the doors open to visitors?",
        "Why did reformers fight so hard for change?",
        "What mattered to the spectators?",
        "What did the patients desperately need?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What stopped patients from getting proper treatment?",
        "What made it difficult for reformers to change things?",
        "Why did ordinary people not speak up sooner?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "Who started pushing for change?",
        "What improvements were made?",
        "How did new laws help protect patients?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "What happened to the public viewing galleries?",
        "How are patients treated at Bethlem Royal Hospital today?",
        "What does the word 'bedlam' mean in modern English?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "How has society's view of mental health changed?",
        "Are people still 'spectators' of suffering today?",
        "What lessons should we learn from Bedlam?"
      ]}
    }
  },
  {
    id: 'titanic',
    title: 'The Titanic',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who were the first-class passengers? Describe their lives on board.",
        "Who were the steerage passengers? Describe their situation.",
        "Who was Captain Edward Smith?",
        "Who were the band members? What adjectives describe them?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "Why did the White Star Line boast about the ship?",
        "What were the steerage passengers hoping for?",
        "What mattered to first-class passengers on the night of the sinking?",
        "What was important to the band as the ship went down?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What stopped the ship from avoiding the iceberg?",
        "What blocked steerage passengers from reaching the lifeboats?",
        "Why was the Californian unable to help?",
        "Why weren't there enough lifeboats?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "How did maritime law change after the disaster?",
        "What was the International Ice Patrol?",
        "How did rules about radio operators change?",
        "How did ship design change?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "How many people died, and how did most of them die?",
        "What happened to the people in the lifeboats?",
        "Where is the Titanic now?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "How did survivors feel in the days and weeks after?",
        "Could something like this happen today?",
        "What lessons should we learn from the Titanic?"
      ]}
    }
  },
  {
    id: 'pendle-witch-trials',
    title: 'Pendle Witch Trials',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who were the two rival families?",
        "Describe Jennet Device. How old was she?",
        "Who was Roger Nowell?",
        "How would you describe the relationship between the families and their neighbours?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "What was important to Roger Nowell?",
        "What was important to the villagers of Pendle?",
        "Why was survival so important to the Demdike and Chattox families?",
        "Why might Jennet have felt it was important to do what the adults asked?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What made life dangerous for the families of Pendle Hill?",
        "How did superstition block people from seeing the truth?",
        "What stopped the accused from defending themselves?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "What did the prosecution believe was the fix for witchcraft?",
        "How did using Jennet as a witness help the prosecution?",
        "Was this really a fair solution? Why or why not?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "What was the verdict?",
        "How do you think Jennet felt after the trial?",
        "What happened to Jennet twenty-one years later?",
        "Why is the ending ironic?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "What was life like for Jennet after her own accusation?",
        "Did the witch trials eventually stop?",
        "Could something like this happen today?"
      ]}
    }
  },
  {
    id: 'tollund-man',
    title: 'The Tollund Man',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who found the Tollund Man? What were they doing?",
        "Who was the Tollund Man? Describe what he looked like.",
        "Who was P.V. Glob?",
        "Who else is involved - the people who may have killed him 2,400 years ago?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "What was important to the Iron Age people who may have sacrificed him?",
        "Why was it important to excavate the body carefully?",
        "Why is the Tollund Man important to scientists today?",
        "What was so important about his last meal?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What makes it so difficult for scientists to solve this mystery?",
        "Why can we never know for certain whether he was a sacrifice or a criminal?",
        "What evidence has been lost over 2,400 years?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "How have scientists used forensic analysis?",
        "How did other bog bodies help build a picture?",
        "What technologies have been used to study the body?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "Where is the Tollund Man now?",
        "What is the most widely accepted theory about his death?",
        "Why does the author say the gap between ancient and modern seems to vanish?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "What other bog bodies have been discovered?",
        "How might future technology help solve this mystery?",
        "What has the Tollund Man taught us about Iron Age societies?"
      ]}
    }
  },
  {
    id: 'resurrection-men',
    title: 'The Resurrection Men',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who were Burke and Hare? Describe them using at least three adjectives.",
        "What kind of person was Dr Robert Knox?",
        "Who were the victims?",
        "Pick one word to describe each main character. Why?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "What did Burke and Hare care about most?",
        "Why did physicians need bodies so desperately?",
        "Why was money such a powerful motivator?",
        "Did anyone in this story care about doing the right thing?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What problem started the whole body-snatching trade?",
        "What obstacles did the Resurrection Men face?",
        "What finally blocked Burke and Hare from continuing?",
        "Why was it so difficult to build a case against both men?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "How did the prosecution solve the evidence problem?",
        "What deal was Hare offered?",
        "How did Parliament try to fix the wider problem?",
        "Do you think the Anatomy Act was a good solution?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "What happened to William Burke?",
        "What happened to Hare and Dr Knox?",
        "What happened to Burke's body after execution?",
        "How did the public react?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "How did the Anatomy Act of 1832 change things?",
        "Why is Burke's skeleton still on display today?",
        "Could something like this happen in modern times?",
        "What lessons can we learn about greed and morality?"
      ]}
    }
  },
  {
    id: 'the-blitz',
    title: 'The Blitz',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who were the ordinary people of London during the Blitz?",
        "Describe the children who were evacuated.",
        "Who were the heroes - firefighters, wardens, ambulance drivers?",
        "Who was the enemy? What kind of leader was Hitler?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "What mattered most to families sheltering in the Underground?",
        "Why was morale so important?",
        "What was important to Hitler? Why did he believe bombing would work?",
        "What did evacuated children care about most?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What was the biggest threat to the people of London?",
        "What obstacles did evacuated children face?",
        "What made the Balham station disaster so shocking?",
        "Why could the government not simply stop the bombing?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "How did people protect themselves?",
        "How did Underground stations become shelters?",
        "What role did community spirit play?",
        "What eventually stopped the Blitz?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "When and why did the Blitz stop?",
        "How many people were killed and homes destroyed?",
        "What did children find when they returned from evacuation?",
        "Did Hitler achieve his goal?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "How did London rebuild itself?",
        "Why is the 'Blitz spirit' still talked about today?",
        "How might evacuation have affected children for life?",
        "Could something like the Blitz happen today?"
      ]}
    }
  },
  {
    id: 'alcatraz',
    title: 'Alcatraz',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who was Frank Morris? What adjectives describe him?",
        "Who were the Anglin brothers?",
        "Who was Al Capone and why was he important to Alcatraz?",
        "What about the guards and the FBI?"
      ]},
      I: { title: "What was Important to them?", prompts: [
        "What did Morris and the Anglins want more than anything?",
        "Why was freedom worth risking their lives?",
        "Why did the authorities care so much about keeping prisoners locked up?",
        "Why did the FBI care about proving the men had drowned?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What physical barriers stood between the prisoners and freedom?",
        "How did constant surveillance make escape seem impossible?",
        "What natural dangers surrounded the island?",
        "Why had every previous escape attempt failed?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "How did they get out of their cells?",
        "How did they solve the problem of nightly bed checks?",
        "How did they plan to cross the dangerous water?",
        "What materials did they use and where did they get them?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "What did the guards find the next morning?",
        "What happened during the massive search?",
        "What was the FBI's official conclusion?",
        "What happened to Alcatraz prison itself?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "What was the mysterious 2013 letter?",
        "Why couldn't experts agree on whether the letter was real?",
        "What is Alcatraz used for today?",
        "Why does this mystery still fascinate people?"
      ]}
    }
  },
  {
    id: 'mary-celeste',
    title: 'The Mary Celeste',
    wibfen: {
      W: { title: "Who are the main characters?", prompts: [
        "Who was Captain Benjamin Briggs?",
        "Who else was on board and what do we know about them?",
        "Who was Captain Morehouse?",
        "Can a ship be a 'character'? Describe the Mary Celeste."
      ]},
      I: { title: "What was Important to them?", prompts: [
        "What was important to Captain Briggs about this voyage?",
        "Why was the safety of his family and crew his responsibility?",
        "Why was it important to the Dei Gratia crew to investigate?",
        "Why was solving this mystery important to the authorities?"
      ]},
      B: { title: "What was the Blocker?", prompts: [
        "What might have forced the crew to abandon a perfectly good ship?",
        "Why couldn't investigators work out what happened?",
        "What made this mystery so much harder to solve than a normal crime?",
        "Why did none of the theories fully explain the evidence?"
      ]},
      F: { title: "What was the Fix?", prompts: [
        "What is the most plausible theory and why?",
        "How does the alcohol fumes theory explain the evidence?",
        "Why hasn't this theory been proven beyond doubt?",
        "What do YOU think happened?"
      ]},
      E: { title: "What happened in the End?", prompts: [
        "What happened to the ten people on board?",
        "What happened to the Mary Celeste after she was recovered?",
        "How did the investigation end?",
        "What was the official conclusion?"
      ]},
      N: { title: "What happened Next?", prompts: [
        "How did the story become so famous?",
        "Why do people still talk about it over 150 years later?",
        "Do you think we will ever know the truth?",
        "If you were a detective, what would you look for?"
      ]}
    }
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   WRITING DATA (localStorage)
   ═══════════════════════════════════════════════════════════════════════════ */

function getWritingData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveWritingData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getText(bookId, letter) {
  const data = getWritingData();
  return data[bookId]?.[letter] || '';
}

function setText(bookId, letter, text) {
  const data = getWritingData();
  if (!data[bookId]) data[bookId] = {};
  data[bookId][letter] = text;
  saveWritingData(data);
}

function clearText(bookId, letter) {
  const data = getWritingData();
  if (data[bookId]) {
    data[bookId][letter] = '';
    saveWritingData(data);
  }
}

function wordCount(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

function getBookProgress(bookId) {
  const data = getWritingData();
  const bookData = data[bookId] || {};
  let filled = 0;
  for (const letter of ['W', 'I', 'B', 'F', 'E', 'N']) {
    if (bookData[letter] && bookData[letter].trim().length > 0) filled++;
  }
  return filled;
}

/* ═══════════════════════════════════════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════════════════════════════════════ */

let autosaveTimer = null;

function stopAutosave() {
  if (autosaveTimer) {
    clearInterval(autosaveTimer);
    autosaveTimer = null;
  }
}

export function renderHome(app) {
  stopAutosave();

  const cards = BOOKS.map(book => {
    const progress = getBookProgress(book.id);
    const pct = Math.round((progress / 6) * 100);
    return `
      <button class="section-card" data-action="open-book" data-book="${book.id}" style="cursor:pointer; border:none;">
        <span class="card-icon">\u{1F4D6}</span>
        <span class="card-name">${book.title}</span>
        <div class="card-progress-bg">
          <div class="card-progress-fill" style="width:${pct}%"></div>
        </div>
        <span class="card-count">${progress}/6 sections</span>
      </button>`;
  }).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Writing (WIBFEN)</span>
    </div>
    <div class="section-home">
      <p class="section-desc">Choose a book and write about it using the WIBFEN framework. Your writing is saved automatically as you type.</p>
      <div class="section-grid">${cards}</div>
    </div>`;
}

function renderBook(app, bookId) {
  stopAutosave();

  const book = BOOKS.find(b => b.id === bookId);
  if (!book) { renderHome(app); return; }

  const sections = WIBFEN_LETTERS.map(({ letter, colour }) => {
    const wib = book.wibfen[letter];
    const text = getText(bookId, letter);
    const wc = wordCount(text);
    const wcClass = wc >= MIN_WORDS ? 'color:var(--forest);' : 'color:var(--text-muted);';

    const promptList = wib.prompts.map(p => `<li>${p}</li>`).join('');

    return `
      <div class="wibfen-section" style="margin-bottom:24px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
          <span style="display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px; background:${colour}; color:white; font-weight:800; font-size:1.1rem; border-radius:8px;">${letter}</span>
          <h3 style="font-size:1rem; font-weight:700; flex:1;">${wib.title}</h3>
        </div>
        <ul style="margin:0 0 8px 20px; font-size:0.85rem; color:var(--text-muted); line-height:1.5;">${promptList}</ul>
        <textarea
          class="wibfen-textarea"
          data-book="${bookId}"
          data-letter="${letter}"
          rows="5"
          placeholder="Write your answer here..."
          style="width:100%; padding:12px; font-size:0.95rem; font-family:inherit; border:2px solid var(--cream2); border-radius:var(--radius); resize:vertical; background:var(--white); color:var(--navy);"
        >${text}</textarea>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
          <span class="wc-display" data-wc-book="${bookId}" data-wc-letter="${letter}" style="font-size:0.8rem; ${wcClass}">${wc} word${wc !== 1 ? 's' : ''}${wc < MIN_WORDS ? ' (try to write at least ' + MIN_WORDS + ')' : ''}</span>
          <button class="btn btn-secondary" data-action="clear-section" data-book="${bookId}" data-letter="${letter}" style="padding:6px 12px; font-size:0.8rem; min-height:auto;">Clear</button>
        </div>
      </div>`;
  }).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" data-action="back-to-books" style="cursor:pointer;">\u2190</a>
      <span class="quiz-title">${book.title}</span>
    </div>
    <div style="padding-bottom:32px;">
      ${sections}
    </div>`;

  // Start autosave
  autosaveTimer = setInterval(() => {
    const textareas = app.querySelectorAll('.wibfen-textarea');
    textareas.forEach(ta => {
      const bk = ta.dataset.book;
      const lt = ta.dataset.letter;
      setText(bk, lt, ta.value);
    });
  }, AUTOSAVE_INTERVAL);
}

// Not a quiz, so renderPractice and renderScore are stubs
export function renderPractice(app) { renderHome(app); }
export function renderWrite(app) { renderHome(app); }
export function renderScore(app) { renderHome(app); }

// ── Init ──

export function init(app) {
  renderHome(app);
}

export default function(app) {
  init(app);

  if (app._writingHandler) app.removeEventListener('click', app._writingHandler);

  const handler = (e) => {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;

    if (action === 'open-book') {
      renderBook(app, actionEl.dataset.book);
    }

    if (action === 'back-to-books') {
      // Save all textareas before leaving
      const textareas = app.querySelectorAll('.wibfen-textarea');
      textareas.forEach(ta => {
        setText(ta.dataset.book, ta.dataset.letter, ta.value);
      });
      renderHome(app);
    }

    if (action === 'clear-section') {
      const bookId = actionEl.dataset.book;
      const letter = actionEl.dataset.letter;
      if (confirm(`Clear your ${letter} writing for this book?`)) {
        clearText(bookId, letter);
        const ta = app.querySelector(`.wibfen-textarea[data-book="${bookId}"][data-letter="${letter}"]`);
        if (ta) ta.value = '';
        const wcEl = app.querySelector(`[data-wc-book="${bookId}"][data-wc-letter="${letter}"]`);
        if (wcEl) {
          wcEl.textContent = `0 words (try to write at least ${MIN_WORDS})`;
          wcEl.style.color = 'var(--text-muted)';
        }
      }
    }
  };

  app._writingHandler = handler;
  app.addEventListener('click', handler);

  // Live word count updates
  if (app._writingInputHandler) app.removeEventListener('input', app._writingInputHandler);

  const inputHandler = (e) => {
    if (!e.target.classList.contains('wibfen-textarea')) return;
    const bookId = e.target.dataset.book;
    const letter = e.target.dataset.letter;
    const wc = wordCount(e.target.value);
    const wcEl = app.querySelector(`[data-wc-book="${bookId}"][data-wc-letter="${letter}"]`);
    if (wcEl) {
      const wcClass = wc >= MIN_WORDS ? 'color:var(--forest);' : 'color:var(--text-muted);';
      wcEl.style.cssText = `font-size:0.8rem; ${wcClass}`;
      wcEl.textContent = `${wc} word${wc !== 1 ? 's' : ''}${wc < MIN_WORDS ? ' (try to write at least ' + MIN_WORDS + ')' : ''}`;
    }
  };

  app._writingInputHandler = inputHandler;
  app.addEventListener('input', inputHandler);
}
