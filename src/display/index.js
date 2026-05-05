/**
 * Display module — formats and renders contribution data for terminal output.
 */

const { renderHeatmap } = require('./heatmap');

/**
 * Renders a summary stats block.
 * @param {{ totalContributions: number, avgPerDay: number, activeDays: number }} stats
 * @returns {string}
 */
function renderStats(stats) {
  if (!stats) return 'No stats available.\n';
  const { totalContributions, avgPerDay, activeDays } = stats;
  return [
    '─'.repeat(40),
    `  Total Contributions : ${totalContributions}`,
    `  Active Days         : ${activeDays}`,
    `  Avg per Active Day  : ${avgPerDay.toFixed(2)}`,
    '─'.repeat(40),
  ].join('\n') + '\n';
}

/**
 * Renders a streak summary.
 * @param {{ current: number, longest: number }} streak
 * @returns {string}
 */
function renderStreak(streak) {
  if (!streak) return 'No streak data available.\n';
  return [
    `  🔥 Current Streak : ${streak.current} day(s)`,
    `  🏆 Longest Streak : ${streak.longest} day(s)`,
  ].join('\n') + '\n';
}

/**
 * Renders the full dashboard view.
 * @param {Map<string, number>} contributionMap
 * @param {object} stats
 * @param {object} streak
 * @returns {string}
 */
function renderDashboard(contributionMap, stats, streak) {
  const sections = [
    '\n  GitPulse — Contribution Dashboard\n',
    renderHeatmap(contributionMap),
    renderStats(stats),
    renderStreak(streak),
  ];
  return sections.join('\n');
}

module.exports = { renderDashboard, renderStats, renderStreak };
