/**
 * Renders a GitHub-style contribution heatmap in the terminal.
 */

const BLOCKS = [' ', '░', '▒', '▓', '█'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Maps a contribution count to a block character.
 * @param {number} count
 * @param {number} maxCount
 * @returns {string}
 */
function countToBlock(count, maxCount) {
  if (count === 0) return BLOCKS[0];
  const index = Math.ceil((count / maxCount) * (BLOCKS.length - 1));
  return BLOCKS[Math.min(index, BLOCKS.length - 1)];
}

/**
 * Groups a contribution map into weeks (columns of 7 days).
 * @param {Map<string, number>} contributionMap - date string -> count
 * @returns {Array<Array<{date: string, count: number}>>}
 */
function groupIntoWeeks(contributionMap) {
  const entries = Array.from(contributionMap.entries()).sort(
    ([a], [b]) => new Date(a) - new Date(b)
  );

  const weeks = [];
  let week = [];

  for (const [date, count] of entries) {
    const dayOfWeek = new Date(date).getDay();
    if (week.length === 0 && dayOfWeek !== 0) {
      for (let i = 0; i < dayOfWeek; i++) week.push({ date: null, count: 0 });
    }
    week.push({ date, count });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push({ date: null, count: 0 });
    weeks.push(week);
  }

  return weeks;
}

/**
 * Calculates summary statistics from a contribution map.
 * @param {Map<string, number>} contributionMap
 * @returns {{ total: number, max: number, activeDays: number }}
 */
function getContributionStats(contributionMap) {
  let total = 0;
  let max = 0;
  let activeDays = 0;

  for (const count of contributionMap.values()) {
    total += count;
    if (count > max) max = count;
    if (count > 0) activeDays++;
  }

  return { total, max, activeDays };
}

/**
 * Renders the heatmap as a string for terminal output.
 * @param {Map<string, number>} contributionMap
 * @returns {string}
 */
function renderHeatmap(contributionMap) {
  if (!contributionMap || contributionMap.size === 0) {
    return 'No contribution data available.\n';
  }

  const maxCount = Math.max(...contributionMap.values(), 1);
  const weeks = groupIntoWeeks(contributionMap);
  const lines = [];

  for (let day = 0; day < 7; day++) {
    const label = DAYS[day].padEnd(4);
    const row = weeks.map((week) => countToBlock(week[day]?.count ?? 0, maxCount)).join(' ');
    lines.push(`${label}${row}`);
  }

  const { total, activeDays } = getContributionStats(contributionMap);
  lines.push('');
  lines.push(`Total: ${total} contributions over ${activeDays} active days`);

  return lines.join('\n') + '\n';
}

module.exports = { renderHeatmap, groupIntoWeeks, countToBlock, getContributionStats };
