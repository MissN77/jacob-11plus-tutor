// ── VIDEO LESSONS ──────────────────────────────────────────────────────────
// A safe hub of trusted, free teaching channels grouped by subject. We link to
// the channels (not auto-playing embeds), so a grown-up can open one and pick a
// lesson together. Every link below was checked to resolve. Opens in a new tab.

const GROUPS = [
  {
    title: '📖 English (reading, comprehension, SPaG, writing)',
    note: 'Comprehension, inference, vocabulary, spelling, punctuation and writing.',
    links: [
      { name: 'Atom Learning', desc: '11+ English explainers', url: 'https://www.youtube.com/@atomlearning' },
      { name: 'English Units', desc: 'Grammar, punctuation and spelling', url: 'https://www.youtube.com/@englishunits' },
      { name: 'Mr Bruff', desc: 'Reading, writing and analysis', url: 'https://www.youtube.com/@MrBruff' }
    ]
  },
  {
    title: '🔢 Maths',
    note: 'Number, fractions, measures, geometry and more, with worked examples.',
    links: [
      { name: 'Corbettmaths Primary', desc: 'Short primary topic videos', url: 'https://corbettmathsprimary.com/' },
      { name: 'Corbettmaths', desc: 'Clear method videos for every topic', url: 'https://www.youtube.com/@corbettmaths' },
      { name: 'Atom Learning', desc: '11+ maths walkthroughs', url: 'https://www.youtube.com/@atomlearning' }
    ]
  },
  {
    title: '🔤 Verbal Reasoning',
    note: 'How the puzzle types work, with step-by-step examples.',
    links: [
      { name: 'Atom Learning', desc: '11+ verbal reasoning lessons', url: 'https://www.youtube.com/@atomlearning' }
    ]
  },
  {
    title: '🔳 Non-Verbal Reasoning',
    note: 'Shapes, sequences, matrices and codes explained.',
    links: [
      { name: 'Atom Learning', desc: '11+ non-verbal reasoning lessons', url: 'https://www.youtube.com/@atomlearning' }
    ]
  },
  {
    title: '🌍 Background knowledge',
    note: 'Friendly explainers on science, history and the wider world.',
    links: [
      { name: 'FreeSchool', desc: 'Primary-friendly explainers', url: 'https://www.youtube.com/@FreeSchool' }
    ]
  }
];

export default function (app) {
  const groups = GROUPS.map((g) => {
    const links = g.links.map((l) => `
      <a class="vid-link" href="${l.url}" target="_blank" rel="noopener noreferrer">
        <span class="vid-link-name">${l.name}</span>
        <span class="vid-link-desc">${l.desc}</span>
        <span class="vid-link-go">Open ↗</span>
      </a>`).join('');
    return `
      <div class="vid-group">
        <h3 class="vid-group-title">${g.title}</h3>
        <p class="vid-group-note">${g.note}</p>
        <div class="vid-links">${links}</div>
      </div>`;
  }).join('');

  app.innerHTML = `
    <div class="quiz-header">
      <a class="quiz-back" href="#/">←</a>
      <span class="quiz-title">Video Lessons</span>
    </div>
    <div class="section-home">
      <p class="section-desc">Free lessons from trusted channels. Watch one with a grown-up, then come back and practise. These open in a new tab.</p>
      ${groups}
    </div>`;
}
