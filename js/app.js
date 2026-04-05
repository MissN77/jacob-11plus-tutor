import { Store } from './store.js';
import { renderHome, renderComingSoon, SECTIONS, loadBexleyPlan, getCurrentBexleyWeek, renderSettings, setStartDate, DEFAULT_START_DATE } from './ui.js';
import { requireAuth, logout } from './auth.js';

const app = document.getElementById('app');

// Section module map - sections that have been built get an entry here.
// Dynamic imports keep the initial bundle small.
const SECTION_MODULES = {
  'learn-first':         () => import('./sections/learn-first.js'),
  'vocabulary':          () => import('./sections/vocabulary.js'),
  'inference':           () => import('./sections/inference.js'),
  'spelling':            () => import('./sections/spelling.js'),
  'punctuation':         () => import('./sections/punctuation.js'),
  'sentence-completion': () => import('./sections/sentence-completion.js'),
  'verbal-reasoning':    () => import('./sections/verbal-reasoning.js'),
  'maths':               () => import('./sections/maths.js'),
  'nvr':                 () => import('./sections/nvr.js'),
  'twinkl-nvr':          () => import('./sections/twinkl-nvr.js'),
  'writing':             () => import('./sections/writing.js'),
  'collocations':        () => import('./sections/collocations.js'),
};

/** Resolve the current route from the hash. */
function getRoute() {
  const hash = location.hash.replace('#/', '').replace('#', '');
  return hash || '';
}

/** Main render function - decides what to show based on route. */
async function render() {
  const route = getRoute();

  // Home screen
  if (!route) {
    const state = Store.get();
    app.innerHTML = await renderHome(state);
    return;
  }

  // Settings page
  if (route === 'settings') {
    app.innerHTML = renderSettings();
    return;
  }

  // Extract the top-level section id (first segment of the route)
  const sectionId = route.split('/')[0];

  // Check if it's a valid section
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) {
    // Unknown route - go home
    location.hash = '#/';
    return;
  }

  // Check if the section module exists
  if (SECTION_MODULES[sectionId]) {
    try {
      const mod = await SECTION_MODULES[sectionId]();
      if (mod.default && typeof mod.default === 'function') {
        mod.default(app);
      } else if (typeof mod.init === 'function') {
        mod.init(app);
      }
    } catch (err) {
      console.error(`Failed to load section "${sectionId}":`, err);
      app.innerHTML = renderComingSoon(sectionId);
    }
  } else {
    // Section not built yet
    app.innerHTML = renderComingSoon(sectionId);
  }
}

/** Delegated click handler for data-action elements. */
app.addEventListener('click', (e) => {
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;

  const action = actionEl.dataset.action;

  if (action === 'answer') {
    // Dispatch a custom event that section modules can listen for
    const idx = parseInt(actionEl.dataset.index, 10);
    app.dispatchEvent(new CustomEvent('quiz-answer', { detail: { index: idx } }));
  }

  if (action === 'retry') {
    // Re-render current route
    render();
  }

  if (action === 'save-start-date') {
    const input = document.getElementById('settings-start-date');
    if (input && input.value) {
      setStartDate(input.value);
      if (window.__showXPToast) window.__showXPToast('Start date saved');
    }
  }

  if (action === 'reset-start-date') {
    setStartDate(DEFAULT_START_DATE);
    const input = document.getElementById('settings-start-date');
    if (input) input.value = DEFAULT_START_DATE;
    if (window.__showXPToast) window.__showXPToast('Reset to default');
  }

  if (action === 'lock-app') {
    logout();
    location.reload();
    return;
  }

  if (action === 'reset-progress') {
    if (confirm('Reset all progress? This clears XP, streaks and activity. Settings are kept.')) {
      Store.reset();
      if (window.__showXPToast) window.__showXPToast('Progress cleared');
      setTimeout(() => { location.hash = '#/'; }, 500);
    }
  }
});

// Listen for route changes
window.addEventListener('hashchange', render);

// ── Activity logging ──────────────────────────────────────────────────────

/** Log that a section was practised today. Used by the weekly plan tracker. */
function logSectionActivity(sectionId) {
  const state = Store.get();
  if (!state.activityLog) state.activityLog = [];
  const today = new Date().toISOString().slice(0, 10);
  // Avoid duplicates for same section on same day
  const exists = state.activityLog.some(
    (e) => e.section === sectionId && e.date === today
  );
  if (!exists) {
    state.activityLog.push({ section: sectionId, date: today });
    // Keep only the last 90 days of logs
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    state.activityLog = state.activityLog.filter((e) => e.date >= cutoffStr);
    Store.save(state);
  }
}

// Log activity whenever a section is visited
window.addEventListener('hashchange', () => {
  const route = location.hash.replace('#/', '').replace('#', '');
  if (route && SECTIONS.find((s) => s.id === route.split('/')[0])) {
    logSectionActivity(route.split('/')[0]);
  }
});

// ── Browser Notifications ─────────────────────────────────────────────────

function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    setTimeout(() => {
      Notification.requestPermission();
    }, 2000);
  }
}

/** Check if we should show a reminder notification (Mondays at 4pm). */
async function checkWeeklyReminder() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const now = new Date();
  // Only on Mondays, after 4pm
  if (now.getDay() !== 1 || now.getHours() < 16) return;

  // Check if we already sent a notification this week
  const lastNotif = localStorage.getItem('j11_last_notif');
  const today = now.toISOString().slice(0, 10);
  if (lastNotif === today) return;

  // Check if Jacob has practised today
  const state = Store.get();
  const activityLog = state.activityLog || [];
  const practicedToday = activityLog.some((e) => e.date === today);
  if (practicedToday) return;

  // Look up this week's Bexley focuses
  const weekNum = getCurrentBexleyWeek();
  if (weekNum === 0 || weekNum > 20) return;

  const plan = await loadBexleyPlan();
  const week = (plan.weeks || []).find((w) => w.week === weekNum);
  if (!week) return;

  const focusBody = `English: ${week.english}`;

  // Show the notification
  new Notification("Hey Jacob! Time for your 11+ practice.", {
    body: focusBody,
    icon: 'icons/icon-192.png',
    tag: 'weekly-reminder'
  });

  localStorage.setItem('j11_last_notif', today);
}

// Initialise
function init() {
  // Gate behind the password. If not authenticated, render the auth
  // screen and stop. Once the correct password is entered, re-run init().
  if (!requireAuth(() => init())) return;

  // Update daily streak
  const streakXP = Store.updateStreak();
  if (streakXP > 0) {
    // Show a brief toast (non-blocking)
    setTimeout(() => showXPToast(`+${streakXP} XP daily streak!`), 500);
  }

  // Request notification permission on first visit
  requestNotificationPermission();

  // Check if we should show a weekly reminder
  checkWeeklyReminder();

  // Initial render
  render();
}

/** Show a temporary XP toast notification. */
function showXPToast(message) {
  const toast = document.createElement('div');
  toast.className = 'xp-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// Make showXPToast available to section modules
window.__showXPToast = showXPToast;

init();
