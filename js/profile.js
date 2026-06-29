// ── PROFILES ──────────────────────────────────────────────────────────────
// Jacob and Ava share the same app and the same activities, but keep entirely
// separate progress: XP, scores, streaks, the wrong-answer review and the
// evening report are all stored per child (separate localStorage key + separate
// Supabase player_id). Nobody can complete or overwrite the other's work.

export const PROFILES = [
  {
    key: 'jacob',
    name: 'Jacob',
    emoji: '\u{1F996}', // dino
    colour: '#2563eb',
    uuid: 'ff567baf-d27e-43b7-94f2-90dbe19fd031',
    level: 'standard'
  },
  {
    key: 'ava',
    name: 'Ava',
    emoji: '\u{1F984}', // unicorn
    colour: '#db2777',
    uuid: '0e2b2a6a-f39d-416e-adb4-c62a4251a702',
    level: 'gentle'
  }
];

const ACTIVE_KEY = 'j11_active_profile';

/** Currently selected profile, or null if nobody has chosen yet. */
export function getActiveProfile() {
  const key = localStorage.getItem(ACTIVE_KEY);
  return PROFILES.find((p) => p.key === key) || null;
}

/** Choose who is learning. */
export function setActiveProfile(key) {
  if (PROFILES.some((p) => p.key === key)) {
    localStorage.setItem(ACTIVE_KEY, key);
  }
}

/** The Supabase player_id for the active profile (falls back to Jacob). */
export function getActiveUuid() {
  const p = getActiveProfile();
  return (p || PROFILES[0]).uuid;
}

/** One-time migration: the original single-profile data lived under the
 *  'j11_state' key. Move it into Jacob's namespaced key so his history is
 *  preserved, then leave the old key in place as a harmless backup. */
export function migrateLegacyState() {
  const legacy = localStorage.getItem('j11_state');
  const jacobKey = 'j11_state_jacob';
  if (legacy && !localStorage.getItem(jacobKey)) {
    localStorage.setItem(jacobKey, legacy);
  }
}
