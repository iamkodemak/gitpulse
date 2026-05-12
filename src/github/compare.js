/**
 * compare.js — Compare contribution stats across two time periods
 */

/**
 * Slice a contribution map to a date range [startDate, endDate] (inclusive, 'YYYY-MM-DD')
 * @param {Object} contributionMap  { 'YYYY-MM-DD': count }
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Object}
 */
export function slicePeriod(contributionMap, startDate, endDate) {
  return Object.fromEntries(
    Object.entries(contributionMap).filter(
      ([date]) => date >= startDate && date <= endDate
    )
  );
}

/**
 * Sum all contribution counts in a map.
 * @param {Object} contributionMap
 * @returns {number}
 */
export function sumContributions(contributionMap) {
  return Object.values(contributionMap).reduce((acc, v) => acc + v, 0);
}

/**
 * Compute active days (days with at least one contribution).
 * @param {Object} contributionMap
 * @returns {number}
 */
export function activeDays(contributionMap) {
  return Object.values(contributionMap).filter((v) => v > 0).length;
}

/**
 * Build a comparison report between two periods.
 * @param {Object} current  contribution map for the current period
 * @param {Object} previous contribution map for the previous period
 * @returns {Object}
 */
export function buildComparisonReport(current, previous) {
  const currentTotal = sumContributions(current);
  const previousTotal = sumContributions(previous);
  const delta = currentTotal - previousTotal;
  const percentChange =
    previousTotal === 0
      ? null
      : Math.round((delta / previousTotal) * 100 * 10) / 10;

  return {
    currentTotal,
    previousTotal,
    delta,
    percentChange,
    currentActiveDays: activeDays(current),
    previousActiveDays: activeDays(previous),
    improved: delta > 0,
  };
}
