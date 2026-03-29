const STORAGE_KEY = 'j11_state';
const XP_PER_LEVEL = 200;

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
