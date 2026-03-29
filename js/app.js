import { Store } from './store.js';
import { renderHome, renderComingSoon, SECTIONS } from './ui.js';

const app = document.getElementById('app');

// Section module map - sections that have been built get an entry here.
// Dynamic imports keep the initial bundle small.
const SECTION_MODULES = {
  'vocabulary':          () => import('./sections/vocabulary.js'),
  'inference':           () => import('./sections/inference.js'),
  'spelling':            () => import('./sections/spelling.js'),
  'punctuation':         () => import('./sections/punctuation.js'),
  'sentence-completion': () => import('./sections/sentence-completion.js'),
  'verbal-reasoning':    () => import('./sections/verbal-reasoning.js'),
  'maths':               () => import('./sections/maths.js'),
  'nvr':                 () => import('./sections/nvr.js'),
  'writing':             () => import('./sections/writing.js'),
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
    app.innerHTML = renderHome(state);
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
});

// Listen for route changes
window.addEventListener('hashchange', render);

// Initialise
function init() {
  // Update daily streak
  const streakXP = Store.updateStreak();
  if (streakXP > 0) {
    // Show a brief toast (non-blocking)
    setTimeout(() => showXPToast(`+${streakXP} XP daily streak!`), 500);
  }

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
