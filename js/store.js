import { recordQuiz, syncStats } from './supabase.js';
import { getActiveProfile } from './profile.js';

/** Per-profile storage key so Jacob and Ava never share progress. */
function storageKey() {
  const p = getActiveProfile();
  return `j11_state_${p ? p.key : 'jacob'}`;
}
const XP_PER_LEVEL = 200;
const ROBUX_TARGET = 400;
const ROBUX_PER_XP = 1; // 1 XP = 1 Robux
const MIN_PASS_PCT = 0.9; // 90% threshold

const DEFAULT_STATE = {
  xp: 0,
  level: 1,
  streak: { current: 0, best: 0, lastDate: null },
  sections: {},
  settings: { soundOn: true }
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export const Store = {
  /** Return the full state object, creating defaults if needed. */
  get() {
    try {
      const raw = localStorage.getItem(storageKey());
      if (raw) return JSON.parse(raw);
    } catch {
      // corrupted data - fall through to default
    }
    const fresh = structuredClone(DEFAULT_STATE);
    this.save(fresh);
    return fresh;
  },

  /** Persist state to localStorage. */
  save(state) {
    localStorage.setItem(storageKey(), JSON.stringify(state));
  },

  /** Add XP and recalculate level. Returns the updated state. */
  addXP(amount) {
    const state = this.get();
    state.xp += amount;
    state.level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
    this.save(state);
    return state;
  },

  /** Update progress for a section. `data` is merged into existing section data. */
  updateSection(sectionId, data) {
    const state = this.get();
    if (!state.sections[sectionId]) {
      state.sections[sectionId] = { completed: 0, correct: 0, total: 0 };
    }
    Object.assign(state.sections[sectionId], data);
    this.save(state);
    return state;
  },

  /** Record a completed quiz and sync to Supabase (fire and forget).
   *  Applies 90% quality gate - below threshold, XP is zeroed.
   *  Everything is clamped so a score can never exceed the total (no 12/10). */
  recordQuiz(section, correct, total, xpEarned, subSection, details) {
    // ── Hard clamps: a quiz can never score more than its total ──
    total = Math.max(0, Math.floor(Number(total) || 0));
    correct = Math.max(0, Math.min(Math.floor(Number(correct) || 0), total));
    xpEarned = Math.max(0, Math.floor(Number(xpEarned) || 0));

    const pct = total > 0 ? correct / total : 0;
    const actualXP = pct >= MIN_PASS_PCT ? xpEarned : 0;
    if (actualXP !== xpEarned) {
      // Undo the XP that was already added
      const state = this.get();
      state.xp = Math.max(0, state.xp - xpEarned + actualXP);
      state.level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
      this.save(state);
    }

    // ── Stamp today's completion so the home "Today" plan can tick off tasks.
    // Every section funnels through here on completion, so this is the one
    // central place that knows a real activity finished today. ──
    if (total > 0) {
      const state = this.get();
      const today = todayStr();
      if (!state.dailyDone || state.dailyDone.date !== today) {
        state.dailyDone = { date: today, sections: {} };
      }
      state.dailyDone.sections[section] = (state.dailyDone.sections[section] || 0) + 1;
      this.save(state);
    }

    recordQuiz(section, correct, total, actualXP, subSection, details).catch(() => {});
    syncStats(this.get()).catch(() => {});
  },

  /** Return today's completion counts per section: { maths: 2, comprehension: 1 }.
   *  Empty object if nothing done today (or a new day has rolled over). */
  dailyDone() {
    const state = this.get();
    const today = todayStr();
    if (state.dailyDone && state.dailyDone.date === today) {
      return state.dailyDone.sections || {};
    }
    return {};
  },

  /** Get weekly Robux progress (XP earned this week mapped to Robux). */
  getWeeklyRobux() {
    const state = this.get();
    const now = new Date();
    const dayOfWeek = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + 1);
    const mondayStr = monday.toISOString().slice(0, 10);
    const log = state.activityLog || [];
    const weekSessions = log.filter(e => e.date >= mondayStr).length;
    // Rough estimate: each session is ~40-80 XP
    // More precise: use total XP minus XP at start of week
    const weeklyXP = state.weekStartXP !== undefined ? state.xp - state.weekStartXP : state.xp;
    return { earned: Math.min(weeklyXP * ROBUX_PER_XP, ROBUX_TARGET), target: ROBUX_TARGET, pct: Math.min((weeklyXP * ROBUX_PER_XP) / ROBUX_TARGET, 1) };
  },

  /** Mark the start-of-week XP baseline (called Monday or first visit of week). */
  checkWeekReset() {
    const state = this.get();
    const now = new Date();
    const dayOfWeek = now.getDay() || 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + 1);
    const mondayStr = monday.toISOString().slice(0, 10);
    if (state.weekResetDate !== mondayStr) {
      state.weekStartXP = state.xp;
      state.weekResetDate = mondayStr;
      this.save(state);
    }
  },

  /** Return current streak info. */
  getStreak() {
    const state = this.get();
    return state.streak;
  },

  /** Mark today as active and update the streak. Returns XP earned (0 or 20). */
  updateStreak() {
    const state = this.get();
    const today = todayStr();
    const { lastDate } = state.streak;

    if (lastDate === today) return 0; // already counted today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastDate === yesterdayStr) {
      state.streak.current += 1;
    } else {
      state.streak.current = 1;
    }

    if (state.streak.current > state.streak.best) {
      state.streak.best = state.streak.current;
    }

    state.streak.lastDate = today;
    this.save(state);

    // Award daily login XP
    this.addXP(20);
    return 20;
  },

  /** Clear all progress. */
  reset() {
    const fresh = structuredClone(DEFAULT_STATE);
    this.save(fresh);
    return fresh;
  }
};
