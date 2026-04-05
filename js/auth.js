// ── Auth (soft password gate) ────────────────────────────────────────────
// IMPORTANT: This is client-side "protection" only — it's a soft barrier,
// not real security. Anyone with dev tools can bypass it by editing
// localStorage or inspecting this file. It only stops casual visitors.

const AUTH_KEY = 'j11_auth';
const PASSWORD_KEY = 'j11_password';
const DEFAULT_PASSWORD = 'jacob2027';

/** Get the currently configured password (default if not set). */
export function getPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
}

/** Set a new password. */
export function setPassword(pw) {
  if (pw && typeof pw === 'string') {
    localStorage.setItem(PASSWORD_KEY, pw);
  }
}

/** Check whether the user is currently authenticated. */
export function isAuthenticated() {
  return !!localStorage.getItem(AUTH_KEY);
}

/** Clear the auth token. */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

/** Store a simple hash/timestamp token once the password is correct. */
function grantAuth() {
  const token = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(AUTH_KEY, token);
}

/**
 * If authenticated, returns true.
 * Otherwise renders the password screen into #app and returns false.
 * Pass a callback `onSuccess` that will run after the correct password is entered.
 */
export function requireAuth(onSuccess) {
  if (isAuthenticated()) return true;
  renderAuthScreen(onSuccess);
  return false;
}

function renderAuthScreen(onSuccess) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="auth-screen">
      <div class="auth-card">
        <h1 class="auth-title">Jacob's 11 Plus Tutor</h1>
        <p class="auth-subtitle">Enter password to continue</p>
        <form id="auth-form" autocomplete="off">
          <input
            type="password"
            id="auth-password"
            class="auth-input"
            placeholder="Password"
            autocomplete="current-password"
            autofocus
          >
          <div id="auth-error" class="auth-error" hidden>Wrong password. Try again.</div>
          <button type="submit" class="auth-button">Unlock</button>
        </form>
      </div>
    </div>
  `;

  const form = document.getElementById('auth-form');
  const input = document.getElementById('auth-password');
  const errorEl = document.getElementById('auth-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const attempt = input.value;
    if (attempt === getPassword()) {
      grantAuth();
      errorEl.hidden = true;
      if (typeof onSuccess === 'function') onSuccess();
    } else {
      errorEl.hidden = false;
      input.value = '';
      input.focus();
    }
  });
}
