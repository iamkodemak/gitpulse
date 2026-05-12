import { buildHeatmapEntries, groupEntriesByWeek, busiestDay } from '../github/heatmapdata.js';
import { fg256, bold, dim } from './colors.js';
import { sectionHeader } from './formatter.js';

const LEVEL_COLORS = [238, 22, 28, 34, 46];
const BLOCK = '■';
const DAYS_LABEL = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/**
 * Renders a single heatmap block character with appropriate color.
 * @param {number} level 0–4
 * @returns {string}
 */
export function renderBlock(level) {
  return fg256(LEVEL_COLORS[level] ?? LEVEL_COLORS[0], BLOCK);
}

/**
 * Renders the day-of-week label column.
 * @returns {string}
 */
export function renderDayLabels() {
  return DAYS_LABEL.map(l => dim(l)).join('\n');
}

/**
 * Renders the full heatmap grid as a string.
 * @param {Object} contributionMap
 * @param {number} days
 * @returns {string}
 */
export function renderHeatmapGrid(contributionMap, days = 91) {
  const entries = buildHeatmapEntries(contributionMap, days);
  const weeks = groupEntriesByWeek(entries);
  const rows = Array.from({ length: 7 }, () => []);

  for (const week of weeks) {
    for (let d = 0; d < 7; d++) {
      const entry = week[d];
      rows[d].push(entry ? renderBlock(entry.level) : ' ');
    }
  }

  return rows
    .map((row, i) => `${dim(DAYS_LABEL[i])} ${row.join(' ')}`)
    .join('\n');
}

/**
 * Renders the full heatmap panel including header and busiest day note.
 * @param {Object} contributionMap
 * @param {number} days
 * @returns {string}
 */
export function renderHeatmapPanel(contributionMap, days = 91) {
  const lines = [];
  lines.push(sectionHeader('Contribution Heatmap'));
  lines.push(renderHeatmapGrid(contributionMap, days));

  const entries = buildHeatmapEntries(contributionMap, days);
  const best = busiestDay(entries);
  if (best && best.count > 0) {
    lines.push('');
    lines.push(`  ${dim('Peak day:')} ${bold(best.date)} ${fg256(46, `(${best.count} contributions)`)}`);
  }

  return lines.join('\n');
}
