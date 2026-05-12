/**
 * Render milestone achievements panel in the terminal.
 */

const { bold, dim, fg256 } = require('./colors');
const { padEnd, sectionHeader } = require('./formatter');

const TROPHY = '🏆';
const LOCK = '○';
const CHECK = '✔';

/**
 * Render a single milestone row with progress bar.
 * @param {{ label: string, reached: boolean, progress: number, target: number }} milestone
 * @param {number} barWidth
 * @returns {string}
 */
function renderMilestoneRow(milestone, barWidth = 20) {
  const { label, reached, progress, target } = milestone;
  const filled = Math.round(progress * barWidth);
  const empty = barWidth - filled;
  const bar = fg256(reached ? 82 : 214, '█'.repeat(filled)) + dim('░'.repeat(empty));
  const icon = reached ? fg256(226, CHECK) : dim(LOCK);
  const labelStr = padEnd(label, 24);
  const pct = reached ? bold(fg256(82, '100%')) : dim(`${Math.round(progress * 100)}%`);
  return `  ${icon} ${labelStr} [${bar}] ${pct}  (${target})\n`;
}

/**
 * Render the next milestone callout.
 * @param {{ label: string, target: number, progress: number }|null} next
 * @returns {string}
 */
function renderNextMilestone(next) {
  if (!next) return `  ${fg256(82, bold('All milestones reached!'))}\n`;
  const remaining = Math.ceil(next.target * (1 - next.progress));
  return (
    `  ${fg256(226, TROPHY)} Next: ${bold(next.label)} — ` +
    `${fg256(214, String(remaining))} more to go\n`
  );
}

/**
 * Render the full milestone panel.
 * @param {{ contributions: Array, streaks: Array, nextContribution: object|null, nextStreak: object|null }} report
 * @returns {string}
 */
function renderMilestonePanel(report) {
  const { contributions, streaks, nextContribution, nextStreak } = report;
  let out = '';
  out += sectionHeader('Milestones') + '\n';

  out += `  ${bold('Contributions')}\n`;
  for (const m of contributions) {
    out += renderMilestoneRow(m);
  }
  out += renderNextMilestone(nextContribution);

  out += '\n';
  out += `  ${bold('Streaks')}\n`;
  for (const m of streaks) {
    out += renderMilestoneRow(m);
  }
  out += renderNextMilestone(nextStreak);

  return out;
}

module.exports = { renderMilestoneRow, renderNextMilestone, renderMilestonePanel };
