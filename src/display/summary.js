import { fg256, bold, dim } from './colors.js';
import { labelValue, sectionHeader, padEnd, formatNumber } from './formatter.js';

/**
 * Renders a top-languages or event-type breakdown bar.
 * @param {string} label
 * @param {number} count
 * @param {number} max
 * @param {number} barWidth
 */
export function renderBar(label, count, max, barWidth = 20) {
  const filled = max > 0 ? Math.round((count / max) * barWidth) : 0;
  const empty = barWidth - filled;
  const bar = fg256('█'.repeat(filled), 75) + dim('░'.repeat(empty));
  const countStr = padEnd(formatNumber(count), 6);
  return `  ${padEnd(label, 18)} ${bar} ${countStr}`;
}

/**
 * Renders a summary section for event type breakdown.
 * @param {Record<string, number>} eventCounts - map of event type to count
 * @returns {string}
 */
export function renderEventBreakdown(eventCounts) {
  const entries = Object.entries(eventCounts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return dim('  No events found.');

  const max = entries[0][1];
  const lines = [sectionHeader('Event Breakdown')];
  for (const [type, count] of entries.slice(0, 8)) {
    const label = type.replace('Event', '');
    lines.push(renderBar(label, count, max));
  }
  return lines.join('\n');
}

/**
 * Renders a summary of contribution totals.
 * @param {{ total: number, commits: number, prs: number, issues: number, reviews: number }} stats
 * @returns {string}
 */
export function renderContributionSummary(stats) {
  const lines = [
    sectionHeader('Contribution Summary'),
    labelValue('Total Events', formatNumber(stats.total)),
    labelValue('Commits', formatNumber(stats.commits ?? 0)),
    labelValue('Pull Requests', formatNumber(stats.prs ?? 0)),
    labelValue('Issues', formatNumber(stats.issues ?? 0)),
    labelValue('Reviews', formatNumber(stats.reviews ?? 0)),
  ];
  return lines.join('\n');
}

/**
 * Renders the full summary block.
 * @param {object} stats
 * @param {Record<string, number>} eventCounts
 * @returns {string}
 */
export function renderSummary(stats, eventCounts) {
  return [
    renderContributionSummary(stats),
    '',
    renderEventBreakdown(eventCounts),
  ].join('\n');
}
