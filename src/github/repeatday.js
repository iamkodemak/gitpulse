/**
 * repeatday.js — Find the most frequently active day-of-month across contributions
 */

/**
 * Extract day-of-month (1–31) from each active date in the contribution map.
 * @param {Map<string, number>} contributionMap  date string -> count
 * @returns {number[]} array of day-of-month numbers for days with contributions
 */
export function activeDaysOfMonth(contributionMap) {
  const days = [];
  for (const [date, count] of contributionMap.entries()) {
    if (count > 0) {
      const d = new Date(date);
      days.push(d.getUTCDate());
    }
  }
  return days;
}

/**
 * Count occurrences of each day-of-month.
 * @param {number[]} days
 * @returns {Record<number, number>}
 */
export function countByDayOfMonth(days) {
  const counts = {};
  for (const d of days) {
    counts[d] = (counts[d] || 0) + 1;
  }
  return counts;
}

/**
 * Return the day-of-month with the highest frequency, or null if no data.
 * @param {Record<number, number>} counts
 * @returns {number|null}
 */
export function peakDayOfMonth(counts) {
  let best = null;
  let bestCount = 0;
  for (const [day, count] of Object.entries(counts)) {
    if (count > bestCount) {
      bestCount = count;
      best = Number(day);
    }
  }
  return best;
}

/**
 * Build a full repeat-day report.
 * @param {Map<string, number>} contributionMap
 * @returns {{ peak: number|null, counts: Record<number, number>, total: number }}
 */
export function buildRepeatDayReport(contributionMap) {
  const days = activeDaysOfMonth(contributionMap);
  const counts = countByDayOfMonth(days);
  const peak = peakDayOfMonth(counts);
  return { peak, counts, total: days.length };
}
