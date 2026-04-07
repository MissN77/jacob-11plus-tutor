// ── PIANO PRACTICE SECTION ──────────────────────────────────────────────────
// Opens the Star Academy piano programme in a new tab.

const PIANO_URL = 'https://missn77.github.io/star-academy/piano.html';

function render() {
  return `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Piano Practice</span>
    </div>
    <div style="padding:16px;text-align:center;">
      <div style="font-size:3rem;margin:32px 0 16px;">\u{1F3B9}</div>
      <h2 style="margin:0 0 8px;">Piano Practice</h2>
      <p style="color:#888;margin:0 0 24px;font-size:0.95rem;">Open the piano programme to start practising.</p>
      <button id="piano-launch-btn" style="background:#1A8A7D;color:#fff;border:none;padding:14px 28px;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer;">Launch Piano</button>
    </div>`;
}

export function init(app) {
  app.innerHTML = render();

  const btn = document.getElementById('piano-launch-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.open(PIANO_URL, '_blank');
    });
  }
}

export default function(app) {
  init(app);
}
