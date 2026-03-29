/**
 * XP and gamification logic for Jacob's 11 Plus Tutor.
 *
 * Points scheme:
 *   +10  correct answer
 *   +5   streak bonus (3+ correct in a row)
 *   +50  completing a 10-question quiz
 *   +100 bonus for perfect score (10/10)
 *   +20  daily login streak (handled by Store.updateStreak)
 *
 * Level = floor(totalXP / 200) + 1
 */

const XP_PER_LEVEL = 200;

/** Calculate the level for a given XP total. */
export function levelFromXP(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

/** XP progress within the current level (0-199). */
export function xpInCurrentLevel(xp) {
  return xp % XP_PER_LEVEL;
}

/** Percentage through the current level (0-100). */
export function xpPercent(xp) {
  return Math.round((xpInCurrentLevel(xp) / XP_PER_LEVEL) * 100);
}

/**
 * Calculate XP earned for a single correct answer.
 * @param {number} consecutiveCorrect - how many correct answers in a row (including this one)
 * @returns {number} XP to award
 */
export function xpForCorrectAnswer(consecutiveCorrect) {
  let xp = 10;
  if (consecutiveCorrect >= 3) {
    xp += 5; // streak bonus
  }
  return xp;
}

/**
 * Calculate bonus XP at the end of a quiz.
 * @param {number} correct - number of correct answers
 * @param {number} total - total questions in the quiz
 * @returns {{ completionXP: number, perfectXP: number, totalBonus: number }}
 */
export function quizEndBonus(correct, total) {
  let completionXP = 0;
  let perfectXP = 0;

  if (total >= 10) {
    completionXP = 50;
  }

  if (correct === total && total > 0) {
    perfectXP = 100;
  }

  return {
    completionXP,
    perfectXP,
    totalBonus: completionXP + perfectXP
  };
}

/**
 * Calculate total XP earned across a full quiz.
 * @param {boolean[]} results - array of true/false for each answer
 * @returns {{ answerXP: number, bonusXP: number, totalXP: number, correct: number, total: number }}
 */
export function calculateQuizXP(results) {
  let answerXP = 0;
  let consecutiveCorrect = 0;
  let correct = 0;

  for (const isCorrect of results) {
    if (isCorrect) {
      correct++;
      consecutiveCorrect++;
      answerXP += xpForCorrectAnswer(consecutiveCorrect);
    } else {
      consecutiveCorrect = 0;
    }
  }

  const bonus = quizEndBonus(correct, results.length);

  return {
    answerXP,
    bonusXP: bonus.totalBonus,
    totalXP: answerXP + bonus.totalBonus,
    correct,
    total: results.length
  };
}
