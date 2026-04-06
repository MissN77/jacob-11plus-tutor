import { recordQuiz, syncStats } from './supabase.js';

const STORAGE_KEY = 'j11_state';
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
      const raw = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
   *  Applies 90% quality gate - below threshold, XP is zeroed. */
  recordQuiz(section, correct, total, xpEarned, subSection) {
    const pct = total > 0 ? correct / total : 0;
    const actualXP = pct >= MIN_PASS_PCT ? xpEarned : 0;
    if (actualXP !== xpEarned) {
      // Undo the XP that was already added
      const state = this.get();
      state.xp = Math.max(0, state.xp - xpEarned + actualXP);
      state.level = Math.floor(state.xp / XP_PER_LEVEL) + 1;
      this.save(state);
    }
    recordQuiz(section, correct, total, actualXP, subSection).catch(() => {});
    syncStats(this.get()).catch(() => {});
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
