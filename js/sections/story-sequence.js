// ── STORY ORDER (sentence sequencing) ──────────────────────────────────────
// The child is given a set of story-event cards. Some belong to the story and
// some are distractors. They sort each card into Beginning, Middle, End, or
// "Doesn't belong", then check. Self-marking, records like every other section
// so it shows in the parent dashboard and evening report. Suits both children:
// gentle stories for Ava, longer ones with distractors for Jacob.

import { Store } from '../store.js';
import { calculateQuizXP } from '../xp.js';
import { getActiveProfile } from '../profile.js';

const SECTION_ID = 'story-sequence';
const DATA_URL = 'data/story-sequence.json';

const ZONES = [
  { key: 'beginning', label: 'Beginning', emoji: '1️⃣' },
  { key: 'middle', label: 'Middle', emoji: '2️⃣' },
  { key: 'end', label: 'End', emoji: '3️⃣' },
  { key: 'none', label: "Doesn't belong", emoji: '\u{1F6AB}' }
];

let DATA = null;
let CURRENT = null; // { activity, order:[idx], placements:{idx:zone}, selected, checked }

async function loadData() {
  if (DATA) return DATA;
  try {
    const res = await fetch(DATA_URL);
    DATA = await res.json();
  } catch {
    DATA = { activities: [] };
  }
  return DATA;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Menu ──
async function renderMenu(app) {
  const data = await loadData();
  const profile = getActiveProfile();
  const childLevel = profile && profile.level === 'gentle' ? 'gentle' : 'standard';

  // Show the child's level first, but allow access to all.
  const sorted = data.activities.slice().sort((a, b) => {
    if (a.level === b.level) return 0;
    return a.level === childLevel ? -1 : 1;
  });

  const cards = sorted.map((act) => {
    const tag = act.level === 'gentle' ? 'Easier' : 'Harder';
    return `
      <button class="section-card seq-menu-card" data-action="open-seq" data-id="${act.id}" style="cursor:pointer;border:none;">
        <span class="card-icon">\u{1F9E9}</span>
        <span class="card-name">${escapeHtml(act.title)}</span>
        <span class="seq-level-tag seq-level-${act.level}">${tag}</span>
      </button>`;
  }).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">←</a>
      <span class="quiz-title">Story Order</span>
    </div>
    <div class="section-home">
      <p class="section-desc">Read each card. Decide if it is the <strong>Beginning</strong>, <strong>Middle</strong> or <strong>End</strong> of the story. Watch out: some cards do not belong at all!</p>
      <div class="section-grid">${cards}</div>
    </div>`;
}

// ── Activity ──
function startActivity(app, id) {
  const act = DATA.activities.find((a) => a.id === id);
  if (!act) { renderMenu(app); return; }
  CURRENT = {
    activity: act,
    order: shuffle(act.events.map((_, i) => i)),
    placements: {},
    selected: null,
    checked: false
  };
  renderActivity(app);
}

function renderActivity(app) {
  const { activity, order, placements, selected, checked } = CURRENT;

  // Unplaced cards (the pool)
  const poolCards = order.filter((i) => placements[i] == null).map((i) => {
    const sel = selected === i ? ' seq-card-selected' : '';
    return `<button class="seq-card${sel}" data-action="seq-select" data-idx="${i}">${escapeHtml(activity.events[i].text)}</button>`;
  }).join('');

  // Zones with their placed cards
  const zonesHtml = ZONES.map((z) => {
    const placed = order.filter((i) => placements[i] === z.key).map((i) => {
      const ev = activity.events[i];
      let mark = '';
      let cls = 'seq-card seq-card-placed';
      if (checked) {
        const right = ev.stage === z.key;
        cls += right ? ' seq-card-right' : ' seq-card-wrong';
        mark = right ? ' ✓' : ' ✗';
      }
      const sel = selected === i ? ' seq-card-selected' : '';
      return `<button class="${cls}${sel}" data-action="seq-select" data-idx="${i}" ${checked ? 'disabled' : ''}>${escapeHtml(ev.text)}${mark}</button>`;
    }).join('');
    return `
      <div class="seq-zone" data-action="seq-drop" data-zone="${z.key}">
        <div class="seq-zone-head">${z.emoji} ${z.label}</div>
        <div class="seq-zone-body">${placed || '<span class="seq-zone-empty">tap a card, then tap here</span>'}</div>
      </div>`;
  }).join('');

  const allPlaced = order.every((i) => placements[i] != null);

  let footer;
  if (checked) {
    const correct = order.filter((i) => placements[i] === activity.events[i].stage).length;
    const total = order.length;
    const pct = Math.round((correct / total) * 100);
    footer = `
      <div class="seq-result">
        <div class="seq-score">${correct} / ${total} in the right place (${pct}%)</div>
        <div class="seq-actions">
          <button class="btn btn-secondary" data-action="seq-retry">Try again</button>
          <button class="btn btn-primary" data-action="seq-menu">More stories</button>
        </div>
      </div>`;
  } else {
    footer = `
      <div class="seq-actions">
        <button class="btn btn-primary" data-action="seq-check" ${allPlaced ? '' : 'disabled'}>
          ${allPlaced ? 'Check my order' : 'Place every card first'}
        </button>
      </div>`;
  }

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" data-action="seq-menu" style="cursor:pointer;">←</a>
      <span class="quiz-title">${escapeHtml(activity.title)}</span>
    </div>
    <div class="seq-wrap">
      <div class="seq-pool">
        <div class="seq-pool-head">Cards to sort</div>
        <div class="seq-pool-body">${poolCards || '<span class="seq-zone-empty">all cards placed</span>'}</div>
      </div>
      <div class="seq-zones">${zonesHtml}</div>
      ${footer}
    </div>`;
}

function check(app) {
  const { activity, order, placements } = CURRENT;
  const results = order.map((i) => placements[i] === activity.events[i].stage);
  const correct = results.filter(Boolean).length;
  const total = results.length;

  // Wrong details for the parent report
  const wrongDetails = order
    .filter((i) => placements[i] !== activity.events[i].stage)
    .map((i) => {
      const ev = activity.events[i];
      const zoneLabel = (k) => (ZONES.find((z) => z.key === k) || {}).label || k;
      return {
        q: ev.text,
        given: zoneLabel(placements[i]),
        correct: zoneLabel(ev.stage)
      };
    });

  const xpData = calculateQuizXP(results);
  Store.addXP(xpData.totalXP);
  Store.recordQuiz(SECTION_ID, correct, total, xpData.totalXP, activity.id, wrongDetails);

  CURRENT.checked = true;
  renderActivity(app);
}

// ── Wiring ──
export default async function (app) {
  await loadData();
  renderMenu(app);

  if (app._seqHandler) app.removeEventListener('click', app._seqHandler);
  const handler = (e) => {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'open-seq') { startActivity(app, el.dataset.id); return; }
    if (action === 'seq-menu') { renderMenu(app); return; }
    if (!CURRENT) return;

    if (action === 'seq-select') {
      if (CURRENT.checked) return;
      const idx = parseInt(el.dataset.idx, 10);
      CURRENT.selected = CURRENT.selected === idx ? null : idx;
      renderActivity(app);
    }
    if (action === 'seq-drop') {
      if (CURRENT.checked || CURRENT.selected == null) return;
      CURRENT.placements[CURRENT.selected] = el.dataset.zone;
      CURRENT.selected = null;
      renderActivity(app);
    }
    if (action === 'seq-check') { check(app); }
    if (action === 'seq-retry') { startActivity(app, CURRENT.activity.id); }
  };
  app._seqHandler = handler;
  app.addEventListener('click', handler);
}
