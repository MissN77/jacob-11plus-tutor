// ── STORY FEEDBACK (on-device, no AI) ──────────────────────────────────────
// Pure JavaScript analysis of a child's story. It only ever measures the words
// they actually typed: sentence length and variety, flow words, repeated words,
// paragraphs, punctuation and reading-ease. Instant, offline, can't invent
// anything. The deeper "human" critique is done separately by the evening
// cloud routine.

const CONNECTIVES = [
  'however', 'meanwhile', 'suddenly', 'although', 'because', 'therefore',
  'finally', 'eventually', 'despite', 'whereas', 'furthermore', 'moreover',
  'consequently', 'nevertheless', 'afterwards', 'instead', 'unfortunately',
  'fortunately', 'immediately', 'desperately', 'cautiously', 'as soon as',
  'before long', 'without warning', 'to make matters worse'
];

const COMMON = new Set([
  'the','and','a','to','of','was','in','it','he','she','they','i','his','her',
  'that','had','on','with','for','as','at','but','his','him','were','said',
  'is','be','this','have','from','my','we','you','are','then','so','out','up',
  'all','one','their','them','there','what','when','an','if','or','by','not'
]);

function syllables(word) {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = word.match(/[aeiouy]{1,2}/g);
  return m ? m.length : 1;
}

/** Analyse a story and return headline stats plus specific, friendly notes. */
export function analyseStory(text) {
  const clean = (text || '').trim();
  const words = clean ? clean.split(/\s+/) : [];
  const wordCount = words.length;

  if (wordCount < 15) {
    return {
      tooShort: true,
      wordCount,
      message: 'Write a bit more (at least a few sentences) and I can give you proper feedback.'
    };
  }

  // Sentences
  const sentences = clean.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const sentenceCount = sentences.length || 1;
  const sentenceLens = sentences.map((s) => s.split(/\s+/).length);
  const avgLen = Math.round((wordCount / sentenceCount) * 10) / 10;
  const longOnes = sentenceLens.filter((l) => l > 25).length;
  const shortOnes = sentenceLens.filter((l) => l <= 5).length;

  // Sentence-opener variety (first word of each sentence)
  const openers = sentences.map((s) => (s.split(/\s+/)[0] || '').toLowerCase().replace(/[^a-z']/g, ''));
  const openerCounts = {};
  openers.forEach((o) => { if (o) openerCounts[o] = (openerCounts[o] || 0) + 1; });
  const repeatedOpeners = Object.entries(openerCounts).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]);

  // Repeated content words (ignore very common little words)
  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z']/g, '')).filter((w) => w.length > 3 && !COMMON.has(w));
  const wordFreq = {};
  lowerWords.forEach((w) => { wordFreq[w] = (wordFreq[w] || 0) + 1; });
  const overused = Object.entries(wordFreq).filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]).slice(0, 3);

  // Flow / connectives
  const lowerText = ' ' + clean.toLowerCase() + ' ';
  const usedConnectives = CONNECTIVES.filter((c) => lowerText.includes(' ' + c + ' ') || lowerText.includes(c));

  // Punctuation variety
  const hasComma = clean.includes(',');
  const hasDialogue = /["“”]/.test(clean);
  const hasExcite = clean.includes('!');
  const hasQuestion = clean.includes('?');

  // Paragraphs
  const paragraphs = clean.split(/\n\s*\n/).filter((p) => p.trim()).length || 1;

  // Reading ease (Flesch) - higher = easier to read
  const totalSyll = words.reduce((sum, w) => sum + syllables(w), 0);
  const flesch = Math.round(206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyll / wordCount));
  let clarity;
  if (flesch >= 80) clarity = 'very easy to read';
  else if (flesch >= 60) clarity = 'clear and easy to read';
  else if (flesch >= 45) clarity = 'a little tricky in places';
  else clarity = 'quite hard to follow in places';

  // ── Build feedback ──
  const positives = [];
  const improvements = [];

  // Length
  if (wordCount >= 120) positives.push(`A good length: you wrote ${wordCount} words.`);
  else improvements.push(`Try to write a bit more. You have ${wordCount} words; aim for 120 or more for a full story.`);

  // Sentence length / variety
  if (avgLen >= 8 && avgLen <= 16 && longOnes === 0) {
    positives.push(`Your sentences are a nice length (about ${avgLen} words each).`);
  }
  if (longOnes > 0) {
    improvements.push(`${longOnes} sentence${longOnes > 1 ? 's are' : ' is'} very long (over 25 words). Try splitting ${longOnes > 1 ? 'them' : 'it'} into two so they are easier to read.`);
  }
  if (shortOnes >= 1 && longOnes >= 1) {
    positives.push('You mixed long and short sentences, that keeps the writing interesting.');
  } else if (shortOnes === 0 && avgLen > 14) {
    improvements.push('Add one or two short, punchy sentences for effect. A short sentence can build tension.');
  }

  // Openers
  if (repeatedOpeners.length) {
    const [word, n] = repeatedOpeners[0];
    improvements.push(`You started ${n} sentences with "${word}". Try opening some with a different word or an -ly word (Slowly, Nervously, Suddenly).`);
  } else if (sentenceCount >= 4) {
    positives.push('You started your sentences in different ways, that reads really well.');
  }

  // Repeated words
  if (overused.length) {
    const list = overused.map(([w, n]) => `"${w}" (${n}×)`).join(', ');
    improvements.push(`You repeated ${list}. Swap some for other words to add variety.`);
  }

  // Connectives / flow
  if (usedConnectives.length >= 3) {
    positives.push(`Great use of joining words for flow (${usedConnectives.slice(0, 4).join(', ')}).`);
  } else {
    improvements.push('Add some flow words to link your ideas: meanwhile, however, suddenly, eventually, although.');
  }

  // Punctuation
  if (!hasComma) improvements.push('Try using commas to add detail inside your sentences.');
  if (hasDialogue) positives.push('You used speech marks, dialogue brings a story to life.');
  else improvements.push('Try adding a line of speech (in "speech marks") to show what a character says.');
  if (hasExcite || hasQuestion) positives.push('You varied your punctuation (! or ?), nice for effect.');

  // Paragraphs
  if (wordCount > 100 && paragraphs === 1) {
    improvements.push('Break your story into paragraphs: one for the beginning, one for the middle, one for the end.');
  } else if (paragraphs >= 3) {
    positives.push(`You organised your writing into ${paragraphs} paragraphs.`);
  }

  // Clarity headline
  const clarityNote = `Overall your writing is ${clarity}.`;

  // Encouraging star rating: floor of 2 so children stay motivated, +1 for
  // each thing done well, capped at 5.
  const score = Math.max(2, Math.min(5, 2 + positives.length));

  // Keep the "to improve" list focused: show the 3 most useful, not a wall.
  const topImprovements = improvements.slice(0, 3);
  const moreCount = improvements.length - topImprovements.length;

  return {
    tooShort: false,
    wordCount,
    sentenceCount,
    avgLen,
    paragraphs,
    flesch,
    clarityNote,
    score,
    positives,
    improvements: topImprovements,
    moreCount
  };
}
