/**
 * Classify and label contribution periods based on activity patterns.
 */

/**
 * Returns a human-readable label for a given contribution count.
 * @param {number} count
 * @returns {string}
 */
function activityLabel(count) {
  if (count === 0) return 'Quiet';
  if (count <= 2) return 'Light';
  if (count <= 6) return 'Moderate';
  if (count <= 14) return 'Active';
  return 'Prolific';
}

/**
 * Returns a label for a streak length in days.
 * @param {number} days
 * @returns {string}
 */
function streakLabel(days) {
  if (days === 0) return 'No streak';
  if (days < 7) return 'Getting started';
  if (days < 30) return 'On a roll';
  if (days < 90) return 'Consistent';
  return 'Legendary';
}

/**
 * Returns a label for a weekly active days ratio (0–7).
 * @param {number} activeDaysPerWeek  average active days per week
 * @returns {string}
 */
function consistencyLabel(activeDaysPerWeek) {
  if (activeDaysPerWeek < 1) return 'Sporadic';
  if (activeDaysPerWeek < 3) return 'Occasional';
  if (activeDaysPerWeek < 5) return 'Regular';
  return 'Daily driver';
}

/**
 * Build a full label profile from contribution stats.
 * @param {{ totalContributions: number, currentStreak: number, activeDaysPerWeek: number }} stats
 * @returns {{ activity: string, streak: string, consistency: string }}
 */
function buildLabelProfile(stats) {
  return {
    activity: activityLabel(stats.totalContributions),
    streak: streakLabel(stats.currentStreak),
    consistency: consistencyLabel(stats.activeDaysPerWeek),
  };
}

module.exports = {
  activityLabel,
  streakLabel,
  consistencyLabel,
  buildLabelProfile,
};
