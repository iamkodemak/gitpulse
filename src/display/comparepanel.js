/**
 * comparepanel.js — Render a period-over-period comparison panel
 */
import { bold, dim, fg256 } from './colors.js';
import { labelValue, sectionHeader, padEnd } from './formatter.js';

const GREEN = 118;
const RED = 203;
const NEUTRAL = 250;

/**
 * Format a signed delta value with color.
 * @param {number} delta
 * @returns {string}
 */
export function renderDelta(delta) {
  if (delta > 0) return fg256(GREEN, `+${delta}`);
  if (delta < 0) return fg256(RED, `${delta}`);
  return fg256(NEUTRAL, '±0');
}

/**
 * Format percent change, or 'N/A' if null.
 * @param {number|null} pct
 * @returns {string}
 */
export function renderPercent(pct) {
  if (pct === null) return dim('N/A');
  if (pct > 0) return fg256(GREEN, `+${pct}%`);
  if (pct < 0) return fg256(RED, `${pct}%`);
  return fg256(NEUTRAL, '0%');
}

/**
 * Render a single comparison row: label | current | previous | delta
 * @param {string} label
 * @param {number} current
 * @param {number} previous
 * @param {number} delta
 * @returns {string}
 */
export function renderCompareRow(label, current, previous, delta) {
  const col = (s, w) => padEnd(String(s), w);
  return [
    col(dim(label), 20),
    col(bold(String(current)), 10),
    col(dim(String(previous)), 10),
    renderDelta(delta),
  ].join('');
}

/**
 * Render the full comparison panel.
 * @param {Object} report  output of buildComparisonReport
 * @param {string} [currentLabel='This period']
 * @param {string} [previousLabel='Last period']
 * @returns {string}
 */
export function renderComparePanel(report, currentLabel = 'This period', previousLabel = 'Last period') {
  const lines = [
    sectionHeader('Period Comparison'),
    dim(`  ${padEnd(currentLabel, 18)} vs  ${previousLabel}`),
    '',
    renderCompareRow('Contributions', report.currentTotal, report.previousTotal, report.delta),
    renderCompareRow('Active days', report.currentActiveDays, report.previousActiveDays,
      report.currentActiveDays - report.previousActiveDays),
    '',
    labelValue('Change', renderPercent(report.percentChange)),
    '',
  ];
  return lines.join('\n');
}
