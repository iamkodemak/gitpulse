import { bold, dim, fg256 } from './colors.js';
import { labelValue, sectionHeader, padEnd } from './formatter.js';

const QUIET_COLOR = 148;  // muted yellow
const WARN_COLOR = 208;   // orange for long gaps
const ACCENT = 75;

/**
 * Renders a single quiet period row.
 * @param {{ start: string, end: string, days: number }} gap
 * @param {number} maxDays  used to scale a bar
 * @returns {string}
 */
export function renderQuietRow(gap, maxDays) {
  const barLen = Math.max(1, Math.round((gap.days / Math.max(maxDays, 1)) * 20));
  const color = gap.days >= 14 ? WARN_COLOR : QUIET_COLOR;
  const bar = fg256(color, '▓'.repeat(barLen));
  const label = `${gap.start} → ${gap.end}`;
  return `  ${padEnd(label, 26)} ${bar} ${dim(`${gap.days}d`)}`;
}

/**
 * Renders the longest quiet period highlight.
 * @param {{ start: string, end: string, days: number } | null} longest
 * @returns {string}
 */
export function renderLongestQuiet(longest) {
  if (!longest) return `  ${dim('No quiet periods found.')}`;
  const color = longest.days >= 14 ? WARN_COLOR : QUIET_COLOR;
  return [
    `  ${bold('Longest:')} ${fg256(color, `${longest.days} days`)}`,
    `  ${dim(`${longest.start}  →  ${longest.end}`)}`,
  ].join('\n');
}

/**
 * Renders the full quiet period panel.
 * @param {{ longest: object|null, recentGaps: object[], totalQuietDays: number }} report
 * @returns {string}
 */
export function renderQuietPeriodPanel(report) {
  const { longest, recentGaps, totalQuietDays } = report;
  const lines = [
    sectionHeader('Quiet Periods'),
    renderLongestQuiet(longest),
    '',
    labelValue('Total quiet days', fg256(ACCENT, String(totalQuietDays))),
    '',
  ];

  if (recentGaps.length > 0) {
    lines.push(`  ${bold('Recent gaps:')}`);
    const maxDays = Math.max(...recentGaps.map(g => g.days));
    for (const gap of recentGaps) {
      lines.push(renderQuietRow(gap, maxDays));
    }
  } else {
    lines.push(`  ${dim('No notable gaps.')}`);
  }

  return lines.join('\n');
}
