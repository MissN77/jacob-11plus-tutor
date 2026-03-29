// ── SUPABASE CLIENT ───────────────────────────────────────────────────────
// Lightweight REST client - no SDK needed, just fetch calls

const SUPABASE_URL = 'https://bdlrmtcrjenoyullctsw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkbHJtdGNyamVub3l1bGxjdHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM1NDAsImV4cCI6MjA5MDM3OTU0MH0.Wb1aEGF7U44LzJEiej1qJjRN_1r0S_fwCYJroViYfoc';
const PLAYER_ID = 'ff567baf-d27e-43b7-94f2-90dbe19fd031'; // Jacob

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

/** Record a completed quiz */
export async function recordQuiz(section, correct, total, xpEarned, subSection) {
  // Insert quiz result
  await query('quiz_results', 'POST', {
    player_id: PLAYER_ID,
    section,
    sub_section: subSection || null,
    correct,
    total,
    xp_earned: xpEarned
  });

  // Upsert daily activity
  const today = new Date().toISOString().slice(0, 10);
  const existing = await query('daily_activity', 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'date': `eq.${today}`,
    'select': '*'
  });

  if (existing && existing.length > 0) {
    await query('daily_activity', 'PATCH', {
      total_xp: existing[0].total_xp + xpEarned,
      quizzes_done: existing[0].quizzes_done + 1
    }, {
      'player_id': `eq.${PLAYER_ID}`,
      'date': `eq.${today}`
    });
  } else {
    await query('daily_activity', 'POST', {
      player_id: PLAYER_ID,
      date: today,
      total_xp: xpEarned,
      quizzes_done: 1
    });
  }
}

/** Sync overall stats from localStorage state */
export async function syncStats(state) {
  const today = new Date().toISOString().slice(0, 10);
  await query('player_stats', 'PATCH', {
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
  const data = await query('player_stats', 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'select': '*'
  });
  return data?.[0] || null;
}

/** Get quiz results, most recent first */
export async function getQuizResults(limit) {
  return await query('quiz_results', 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'select': '*',
    'order': 'completed_at.desc',
    'limit': String(limit || 50)
  });
}

/** Get daily activity for last N days */
export async function getDailyActivity(days) {
  const since = new Date();
  since.setDate(since.getDate() - (days || 30));
  return await query('daily_activity', 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'date': `gte.${since.toISOString().slice(0, 10)}`,
    'select': '*',
    'order': 'date.desc'
  });
}

/** Get per-section summary */
export async function getSectionSummary() {
  return await query('quiz_results', 'GET', null, {
    'player_id': `eq.${PLAYER_ID}`,
    'select': 'section,correct,total,xp_earned,completed_at',
    'order': 'completed_at.desc'
  });
}
