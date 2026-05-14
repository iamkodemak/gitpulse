/**
 * topdaypanel.js — Render the most-active day-of-week panel
 */
import { bold, dim, fg256 } from './colors.js';
import { padEnd, sectionHeader } from './formatter.js';

const BAR_WIDTH = 20;

/**
 * Render a single horizontal bar for a day-of-week row.
 * @param {string} label  short day name (3 chars)
 * @param {number} value  raw total for that day
 * @param {number} max    maximum total across all days
 * @param {boolean} isPeak  highlight this row
 * @returns {string}
 */
export function renderDowBar(label, value, max, isPeak) {
  const filled = max > 0 ? Math.round((value / max) * BAR_WIDTH) : 0;
  const empty = BAR_WIDTH - filled;
  const color = isPeak ? fg256(214) : fg256(66);
  const bar = color('█'.repeat(filled)) + dim('░'.repeat(empty));
  const labelStr = padEnd(label, 4);
  const countStr = padEnd(String(value), 5);
  const prefix = isPeak ? bold('▶ ') : '  ';
  return `${prefix}${labelStr} ${bar} ${dim(countStr)}`;
}

/**
 * Render the full top-day-of-week panel.
 * @param {{ totals: number[], peakIndex: number, peakName: string, peakCount: number, averagePerDay: number[], dowShort: string[] }} report
 * @returns {string}
 */
export function renderTopDayPanel(report) {
  const { totals, peakIndex, peakName, peakCount, averagePerDay, dowShort } = report;
  const max = Math.max(...totals, 1);
  const lines = [];

  lines.push(sectionHeader('Most Active Day of Week'));
  lines.push('');

  for (let i = 0; i < 7; i++) {
    lines.push(renderDowBar(dowShort[i], totals[i], max, i === peakIndex));
  }

  lines.push('');
  lines.push(
    `  Peak: ${bold(peakName)} ` +
    `${fg256(214)(String(peakCount))} contributions  ` +
    dim(`(avg ${averagePerDay[peakIndex]}/week)`)
  );

  return lines.join('\n');
}
