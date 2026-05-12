/**
 * bestday.js — Find the user's most productive day and related stats
 */

/**
 * Returns the date string with the highest contribution count.
 * @param {Map<string, number>} contributionMap
 * @returns {string|null}
 */
export function bestDayDate(contributionMap) {
  if (!contributionMap || contributionMap.size === 0) return null;
  let best = null;
  let max = -1;
  for (const [date, count] of contributionMap) {
    if (count > max) {
      max = count;
      best = date;
    }
  }
  return best;
}

/**
 * Returns top N days sorted by contribution count descending.
 * @param {Map<string, number>} contributionMap
 * @param {number} n
 * @returns {Array<{date: string, count: number}>}
 */
export function topNDays(contributionMap, n = 5) {
  if (!contributionMap || contributionMap.size === 0) return [];
  return [...contributionMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/**
 * Computes average contributions per active day.
 * @param {Map<string, number>} contributionMap
 * @returns {number}
 */
export function averagePerActiveDay(contributionMap) {
  if (!contributionMap || contributionMap.size === 0) return 0;
  const active = [...contributionMap.values()].filter(v => v > 0);
  if (active.length === 0) return 0;
  const total = active.reduce((sum, v) => sum + v, 0);
  return Math.round((total / active.length) * 10) / 10;
}

/**
 * Builds a best-day report object.
 * @param {Map<string, number>} contributionMap
 * @returns {{ bestDate: string|null, bestCount: number, top5: Array, avgPerActiveDay: number }}
 */
export function buildBestDayReport(contributionMap) {
  const bestDate = bestDayDate(contributionMap);
  const bestCount = bestDate ? (contributionMap.get(bestDate) ?? 0) : 0;
  return {
    bestDate,
    bestCount,
    top5: topNDays(contributionMap, 5),
    avgPerActiveDay: averagePerActiveDay(contributionMap),
  };
}
