// ── SUPABASE CLIENT ───────────────────────────────────────────────────────
// Lightweight REST client - no SDK needed, just fetch calls

// Backend lives in the always-on "genome-guide" Supabase project (tables prefixed j11_).
// The original dedicated project auto-paused on the free tier, which silently killed
// all progress sync. This project stays warm, so tracking no longer disappears.
const SUPABASE_URL = 'https://pimhwskthibxkpfjlkfu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbWh3c2t0aGlieGtwZmpsa2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NDEzNjksImV4cCI6MjA5NzIxNzM2OX0.urlGrk-K0o7H3Us3sOizvZ4-S8SAB2uULHAGGYro4RY';

// player_id is resolved per active profile (Jacob or Ava) at call time.
import { getActiveUuid } from './profile.js';

// Table names (prefixed so they don't clash with anything else in the project)
const T_STATS = 'j11_player_stats';
const T_QUIZ = 'j11_quiz_results';
const T_DAILY = 'j11_daily_activity';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function query(table, method, body, params) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      console.warn('Supabase error:', res.status, await res.text());
      return null;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.warn('Supabase offline:', err.message);
    return null;
  }
}

/** Record a completed quiz.
 *  `details` (optional) is an array of the questions Jacob got wrong, so the
 *  parent dashboard can show exactly what to help him with. */
export async function recordQuiz(section, correct, total, xpEarned, subSection, details) {
  const PLAYER_ID = getActiveUuid();
  // Insert quiz result
  await query(T_QUIZ, 'POST', {
    player_id: PLAYER_ID,
    section,
    sub_section: subSection || null,
    correct,
    total,
    xp_earned: xpEarned,
    details: details && details.length ? details : null
  });

  // Upsert daily activity
  const today = new Date().toISOString().slice(0, 10);
  const existing = await query(T_DAILY, 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'date': `eq.${today}`,
    'select': '*'
  });

  if (existing && existing.length > 0) {
    await query(T_DAILY, 'PATCH', {
      total_xp: existing[0].total_xp + xpEarned,
      quizzes_done: existing[0].quizzes_done + 1
    }, {
      'player_id': `eq.${PLAYER_ID}`,
      'date': `eq.${today}`
    });
  } else {
    await query(T_DAILY, 'POST', {
      player_id: PLAYER_ID,
      date: today,
      total_xp: xpEarned,
      quizzes_done: 1
    });
  }
}

/** Sync overall stats from localStorage state */
export async function syncStats(state) {
  const PLAYER_ID = getActiveUuid();
  const today = new Date().toISOString().slice(0, 10);
  await query(T_STATS, 'PATCH', {
    total_xp: state.xp || 0,
    level: state.level || 1,
    current_streak: state.streak?.current || 0,
    best_streak: state.streak?.best || 0,
    last_active: today,
    updated_at: new Date().toISOString()
  }, {
    'player_id': `eq.${PLAYER_ID}`
  });
}

// ── Dashboard queries (for parent view) ──────────────────────────────────

/** Get player stats */
export async function getPlayerStats() {
  const PLAYER_ID = getActiveUuid();
  const data = await query(T_STATS, 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'select': '*'
  });
  return data?.[0] || null;
}

/** Get quiz results, most recent first */
export async function getQuizResults(limit) {
  const PLAYER_ID = getActiveUuid();
  return await query(T_QUIZ, 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'select': '*',
    'order': 'completed_at.desc',
    'limit': String(limit || 50)
  });
}

/** Get daily activity for last N days */
export async function getDailyActivity(days) {
  const PLAYER_ID = getActiveUuid();
  const since = new Date();
  since.setDate(since.getDate() - (days || 30));
  return await query(T_DAILY, 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'date': `gte.${since.toISOString().slice(0, 10)}`,
    'select': '*',
    'order': 'date.desc'
  });
}

/** Get per-section summary */
export async function getSectionSummary() {
  const PLAYER_ID = getActiveUuid();
  return await query(T_QUIZ, 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'select': 'section,correct,total,xp_earned,completed_at',
    'order': 'completed_at.desc'
  });
}
