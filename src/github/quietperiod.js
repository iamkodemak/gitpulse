/**
 * Identifies the longest quiet period (no contributions) in a given window.
 */

/**
 * Returns sorted date strings (YYYY-MM-DD) from a contribution map.
 * @param {Map<string,number>} map
 * @returns {string[]}
 */
export function sortedActiveDates(map) {
  return [...map.keys()]
    .filter(k => (map.get(k) ?? 0) > 0)
    .sort();
}

/**
 * Finds all quiet periods (gaps between active days) of at least minDays.
 * @param {Map<string,number>} map
 * @param {number} minDays
 * @returns {{ start: string, end: string, days: number }[]}
 */
export function findQuietPeriods(map, minDays = 7) {
  const dates = sortedActiveDates(map);
  if (dates.length < 2) return [];
  const gaps = [];
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const days = Math.round((curr - prev) / 86400000) - 1;
    if (days >= minDays) {
      const start = new Date(prev);
      start.setDate(start.getDate() + 1);
      const end = new Date(curr);
      end.setDate(end.getDate() - 1);
      gaps.push({
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        days,
      });
    }
  }
  return gaps;
}

/**
 * Returns the single longest quiet period.
 * @param {Map<string,number>} map
 * @returns {{ start: string, end: string, days: number } | null}
 */
export function longestQuietPeriod(map) {
  const gaps = findQuietPeriods(map, 1);
  if (!gaps.length) return null;
  return gaps.reduce((a, b) => (b.days > a.days ? b : a));
}

/**
 * Builds a full quiet period report.
 * @param {Map<string,number>} map
 * @returns {{ longest: object|null, recentGaps: object[], totalQuietDays: number }}
 */
export function buildQuietPeriodReport(map) {
  const gaps = findQuietPeriods(map, 1);
  const longest = gaps.length
    ? gaps.reduce((a, b) => (b.days > a.days ? b : a))
    : null;
  const totalQuietDays = gaps.reduce((s, g) => s + g.days, 0);
  const recentGaps = [...gaps].sort((a, b) => b.start.localeCompare(a.start)).slice(0, 3);
  return { longest, recentGaps, totalQuietDays };
}
