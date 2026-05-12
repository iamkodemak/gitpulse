/**
 * Milestone detection: identify contribution count thresholds and achievements.
 */

const MILESTONE_THRESHOLDS = [
  { key: 'first_contribution', label: 'First Contribution', target: 1 },
  { key: 'ten_contributions', label: '10 Contributions', target: 10 },
  { key: 'fifty_contributions', label: '50 Contributions', target: 50 },
  { key: 'century', label: 'Century Club (100)', target: 100 },
  { key: 'five_hundred', label: '500 Contributions', target: 500 },
  { key: 'one_thousand', label: '1K Contributions', target: 1000 },
];

const STREAK_MILESTONES = [
  { key: 'streak_7', label: '7-Day Streak', target: 7 },
  { key: 'streak_30', label: '30-Day Streak', target: 30 },
  { key: 'streak_100', label: '100-Day Streak', target: 100 },
];

/**
 * Check which contribution count milestones have been reached.
 * @param {number} totalContributions
 * @returns {Array<{key, label, target, reached}>}
 */
function checkContributionMilestones(totalContributions) {
  return MILESTONE_THRESHOLDS.map((m) => ({
    ...m,
    reached: totalContributions >= m.target,
    progress: Math.min(totalContributions / m.target, 1),
  }));
}

/**
 * Check which streak milestones have been reached.
 * @param {number} currentStreak
 * @returns {Array<{key, label, target, reached}>}
 */
function checkStreakMilestones(currentStreak) {
  return STREAK_MILESTONES.map((m) => ({
    ...m,
    reached: currentStreak >= m.target,
    progress: Math.min(currentStreak / m.target, 1),
  }));
}

/**
 * Build a full milestone report combining contributions and streak.
 * @param {number} totalContributions
 * @param {number} currentStreak
 * @returns {{ contributions: Array, streaks: Array, nextContribution: object|null, nextStreak: object|null }}
 */
function buildMilestoneReport(totalContributions, currentStreak) {
  const contributions = checkContributionMilestones(totalContributions);
  const streaks = checkStreakMilestones(currentStreak);

  const nextContribution = contributions.find((m) => !m.reached) || null;
  const nextStreak = streaks.find((m) => !m.reached) || null;

  return { contributions, streaks, nextContribution, nextStreak };
}

module.exports = {
  MILESTONE_THRESHOLDS,
  STREAK_MILESTONES,
  checkContributionMilestones,
  checkStreakMilestones,
  buildMilestoneReport,
};
