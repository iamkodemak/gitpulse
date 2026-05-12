const { bold, dim, fg256 } = require('./colors');
const { padEnd, sectionHeader, labelValue } = require('./formatter');

const BAR_WIDTH = 20;

/**
 * Render a single week bar row.
 * @param {{week:string, count:number}} entry
 * @param {number} max
 * @returns {string}
 */
function renderWeekBar(entry, max) {
  const filled = max > 0 ? Math.round((entry.count / max) * BAR_WIDTH) : 0;
  const empty = BAR_WIDTH - filled;
  const bar = fg256(71, '█'.repeat(filled)) + dim('░'.repeat(empty));
  const label = padEnd(entry.week, 10);
  const count = String(entry.count).padStart(4);
  return `  ${dim(label)}  ${bar}  ${bold(count)}`;
}

/**
 * Render the weekly digest panel.
 * @param {{ weeks: Array, total: number, avg: number, best: {week,count}|null }} digest
 * @returns {string}
 */
function renderWeeklyDigestPanel(digest) {
  const lines = [];
  lines.push(sectionHeader('Weekly Digest'));

  if (!digest.weeks.length) {
    lines.push(dim('  No data available.'));
    return lines.join('\n');
  }

  const max = Math.max(...digest.weeks.map((w) => w.count), 1);

  for (const entry of digest.weeks) {
    lines.push(renderWeekBar(entry, max));
  }

  lines.push('');
  lines.push(labelValue('Total (window)', String(digest.total)));
  lines.push(labelValue('Weekly avg', String(digest.avg)));
  if (digest.best) {
    lines.push(labelValue('Best week', `${digest.best.week}  (${digest.best.count})`));
  }

  return lines.join('\n');
}

module.exports = { renderWeekBar, renderWeeklyDigestPanel };
