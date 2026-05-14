/**
 * monthheatmap.js
 * Builds a month-by-month contribution heatmap data structure.
 */

/**
 * Returns a 'YYYY-MM' string from a date string or Date.
 * @param {string} dateStr
 * @returns {string}
 */
function toYearMonth(dateStr) {
  return dateStr.slice(0, 7);
}

/**
 * Aggregates contribution map into monthly totals.
 * @param {Map<string, number>} contributionMap - date string -> count
 * @returns {Map<string, number>} yearMonth -> total
 */
function aggregateByMonth(contributionMap) {
  const monthly = new Map();
  for (const [date, count] of contributionMap) {
    const ym = toYearMonth(date);
    monthly.set(ym, (monthly.get(ym) || 0) + count);
  }
  return monthly;
}

/**
 * Returns sorted list of year-month keys within a window of N months back from today.
 * @param {Map<string, number>} monthlyMap
 * @param {number} months
 * @returns {string[]}
 */
function recentMonthKeys(monthlyMap, months = 12) {
  const now = new Date();
  const cutoff = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  const cutoffStr = cutoff.toISOString().slice(0, 7);
  return [...monthlyMap.keys()]
    .filter((ym) => ym >= cutoffStr)
    .sort();
}

/**
 * Assigns a heat level 0-4 based on value relative to max.
 * @param {number} value
 * @param {number} max
 * @returns {number}
 */
function monthToLevel(value, max) {
  if (!max || value === 0) return 0;
  const ratio = value / max;
  if (ratio < 0.25) return 1;
  if (ratio < 0.5) return 2;
  if (ratio < 0.75) return 3;
  return 4;
}

/**
 * Builds full month heatmap report.
 * @param {Map<string, number>} contributionMap
 * @param {number} months
 * @returns {{ keys: string[], totals: Map<string, number>, levels: Map<string, number>, max: number }}
 */
function buildMonthHeatmap(contributionMap, months = 12) {
  const totals = aggregateByMonth(contributionMap);
  const keys = recentMonthKeys(totals, months);
  const max = keys.reduce((m, k) => Math.max(m, totals.get(k) || 0), 0);
  const levels = new Map();
  for (const k of keys) {
    levels.set(k, monthToLevel(totals.get(k) || 0, max));
  }
  return { keys, totals, levels, max };
}

module.exports = {
  toYearMonth,
  aggregateByMonth,
  recentMonthKeys,
  monthToLevel,
  buildMonthHeatmap,
};
