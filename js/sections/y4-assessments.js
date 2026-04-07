// ── YEAR 4 ASSESSMENTS SECTION ──────────────────────────────────────────────
// Placeholder cards for upcoming Y4 interactive assessments.

const SECTION_ID = 'y4-assessments';

const CURRICULUM_APP_URL = 'https://missn77.github.io/curriculum-app/';

const ASSESSMENTS = [
  { title: 'Y4 Maths Test 1', subject: 'Maths', status: 'coming-soon' },
  { title: 'Y4 Maths Test 2', subject: 'Maths', status: 'coming-soon' },
  { title: 'Y4 Reading Comprehension', subject: 'English', status: 'coming-soon' },
  { title: 'Y4 Grammar & Punctuation', subject: 'English', status: 'coming-soon' },
  { title: 'Y4 Spelling Test', subject: 'English', status: 'coming-soon' },
];

function render() {
  const cards = ASSESSMENTS.map((a) => `
    <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
      <div style="font-weight:700;font-size:1rem;margin-bottom:4px;">${a.title}</div>
      <div style="font-size:0.85rem;color:#888;margin-bottom:12px;">${a.subject}</div>
      <div style="display:inline-block;background:#f0ebe3;color:#888;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:600;">Coming Soon</div>
    </div>
  `).join('');

  return `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">\u2190</a>
      <span class="quiz-title">Year 4 Assessments</span>
    </div>
    <div style="padding:16px;">
      <div style="background:#fff;border-radius:12px;padding:16px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-align:center;">
        <p style="margin:0 0 8px;font-size:0.95rem;font-weight:600;">Maths Tests coming soon</p>
        <p style="margin:0 0 12px;font-size:0.85rem;color:#888;">In the meantime, practise with the curriculum app.</p>
        <a href="${CURRICULUM_APP_URL}" target="_blank" rel="noopener" style="display:inline-block;background:#1A8A7D;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">Open Curriculum App</a>
      </div>
      <div style="display:grid;grid-template-columns:1fr;gap:12px;">
        ${cards}
      </div>
    </div>`;
}

export function init(app) {
  app.innerHTML = render();
}

export default function(app) {
  init(app);
}
