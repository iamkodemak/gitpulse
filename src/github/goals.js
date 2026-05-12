/**
 * Contribution goal tracking and progress computation.
 */

/**
 * Default contribution goals.
 */
const DEFAULT_GOALS = {
  daily: 3,
  weekly: 20,
  monthly: 80
};

/**
 * Compute progress toward a goal as a percentage (0–100).
 * @param {number} current
 * @param {number} target
 * @returns {number}
 */
function computeProgress(current, target) {
  if (target <= 0) return 100;
  return Math.min(100, Math.round((current / target) * 100));
}

/**
 * Determine status label based on progress percentage.
 * @param {number} pct
 * @returns {'on-track'|'behind'|'achieved'}
 */
function goalStatus(pct) {
  if (pct >= 100) return 'achieved';
  if (pct >= 60) return 'on-track';
  return 'behind';
}

/**
 * Build goal progress objects for daily, weekly, and monthly windows.
 * @param {{ daily: number, weekly: number, monthly: number }} stats
 * @param {object} [goals]
 * @returns {Array<{ period: string, current: number, target: number, pct: number, status: string }>}
 */
function buildGoalProgress(stats, goals = DEFAULT_GOALS) {
  return [
    { period: 'Daily',   current: stats.daily,   target: goals.daily },
    { period: 'Weekly',  current: stats.weekly,  target: goals.weekly },
    { period: 'Monthly', current: stats.monthly, target: goals.monthly }
  ].map(({ period, current, target }) => {
    const pct = computeProgress(current, target);
    return { period, current, target, pct, status: goalStatus(pct) };
  });
}

module.exports = { DEFAULT_GOALS, computeProgress, goalStatus, buildGoalProgress };
