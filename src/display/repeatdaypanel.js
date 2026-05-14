/**
 * repeatdaypanel.js — Render a bar chart of contribution frequency by day-of-month
 */
import { bold, dim, fg256 } from './colors.js';
import { padEnd, sectionHeader } from './formatter.js';

const BAR_WIDTH = 20;
const BAR_COLOR = 75;  // steel blue
const PEAK_COLOR = 214; // amber

/**
 * Render a single bar row for a day-of-month.
 * @param {number} day  1–31
 * @param {number} count
 * @param {number} max
 * @param {boolean} isPeak
 * @returns {string}
 */
export function renderDomBar(day, count, max, isPeak) {
  const filled = max > 0 ? Math.round((count / max) * BAR_WIDTH) : 0;
  const bar = '█'.repeat(filled) + dim('░'.repeat(BAR_WIDTH - filled));
  const color = isPeak ? PEAK_COLOR : BAR_COLOR;
  const label = padEnd(String(day), 3);
  const countStr = dim(`(${count})`);
  return `  ${bold(label)} ${fg256(color, bar)} ${countStr}`;
}

/**
 * Render the full repeat-day panel.
 * @param {{ peak: number|null, counts: Record<number, number>, total: number }} report
 * @returns {string}
 */
export function renderRepeatDayPanel(report) {
  const { peak, counts, total } = report;
  const lines = [sectionHeader('Repeat Day of Month')];

  if (total === 0 || peak === null) {
    lines.push(dim('  No contribution data available.'));
    return lines.join('\n');
  }

  const max = Math.max(...Object.values(counts));
  const days = Object.keys(counts)
    .map(Number)
    .sort((a, b) => a - b);

  for (const day of days) {
    lines.push(renderDomBar(day, counts[day], max, day === peak));
  }

  lines.push('');
  lines.push(
    `  ${dim('Most active day of month:')} ${bold(fg256(PEAK_COLOR, String(peak)))} ` +
    dim(`(${counts[peak]} times)`)
  );

  return lines.join('\n');
}
