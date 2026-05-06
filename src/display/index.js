import { bold, dim, fg256 } from './colors.js';
import { sectionHeader } from './formatter.js';
import { renderHeatmap } from './heatmap.js';
import { renderSparklineRow } from './sparkline.js';
import { renderSummary } from './summary.js';
import { renderTimeline } from './timeline.js';
import { renderRepoList } from './repolist.js';

/**
 * Render the stats block (total, streak, etc.).
 */
export function renderStats(stats) {
  const lines = [
    sectionHeader('Contribution Stats'),
    `  ${bold('Total events:')}  ${fg256(75, stats.total)}`,
    `  ${bold('Active days:')}   ${fg256(75, stats.activeDays)}`,
    `  ${bold('Longest streak:')} ${fg256(226, stats.longestStreak)} days`,
  ];
  return lines.join('\n');
}

/**
 * Render the current streak block.
 */
export function renderStreak(streak) {
  if (!streak || streak.current === 0) {
    return dim('  No active streak.');
  }
  return [
    sectionHeader('Current Streak'),
    `  ${fg256(226, '🔥')} ${bold(streak.current)} day${streak.current !== 1 ? 's' : ''} in a row`,
    `  Started: ${dim(streak.start)}`,
  ].join('\n');
}

/**
 * Render the full dashboard combining all panels.
 * @param {object} data
 * @param {object} options
 */
export function renderDashboard(data, options = {}) {
  const { contributions, stats, streak, repos } = data;
  const parts = [];

  parts.push(renderHeatmap(contributions));
  parts.push('');
  parts.push(renderStats(stats));
  parts.push('');
  parts.push(renderStreak(streak));
  parts.push('');
  parts.push(renderSummary(contributions));
  parts.push('');
  parts.push(renderTimeline(contributions));

  if (repos && repos.length > 0) {
    parts.push('');
    parts.push(renderRepoList(repos, { limit: options.repoLimit ?? 5 }));
  }

  return parts.join('\n');
}
