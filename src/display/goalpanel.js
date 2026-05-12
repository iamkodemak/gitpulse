/**
 * Render contribution goal progress panel.
 */
const { fg256, bold, dim } = require('./colors');
const { padEnd, sectionHeader } = require('./formatter');

const BAR_WIDTH = 24;

/**
 * Render a single goal progress bar.
 * @param {{ period: string, current: number, target: number, pct: number, status: string }} goal
 * @returns {string}
 */
function renderGoalBar(goal) {
  const { period, current, target, pct, status } = goal;
  const filled = Math.round((pct / 100) * BAR_WIDTH);
  const empty  = BAR_WIDTH - filled;

  const color = status === 'achieved' ? 82
    : status === 'on-track'           ? 214
    : 196;

  const bar = fg256(color, '█'.repeat(filled)) + dim('░'.repeat(empty));
  const label = padEnd(period, 8);
  const counts = dim(`${current}/${target}`);
  const pctStr = padEnd(`${pct}%`, 5);

  return `  ${bold(label)} [${bar}] ${fg256(color, pctStr)} ${counts}`;
}

/**
 * Render the full goal progress panel.
 * @param {Array<object>} goals  Output of buildGoalProgress.
 * @returns {string}
 */
function renderGoalPanel(goals) {
  if (!goals || goals.length === 0) return '';

  const lines = [
    sectionHeader('Contribution Goals'),
    ...goals.map(renderGoalBar),
    ''
  ];

  return lines.join('\n');
}

module.exports = { renderGoalBar, renderGoalPanel };
