/**
 * topday.js — Find the most active day of the week across contribution history
 */

/**
 * Count total contributions per day-of-week (0=Sun … 6=Sat)
 * @param {Map<string,number>} contributionMap  date string -> count
 * @returns {number[]} array of 7 totals indexed by day-of-week
 */
export function countByDayOfWeek(contributionMap) {
  const totals = new Array(7).fill(0);
  for (const [dateStr, count] of contributionMap.entries()) {
    const dow = new Date(dateStr).getUTCDay();
    totals[dow] += count;
  }
  return totals;
}

/**
 * Return the day-of-week index (0-6) with the highest total contributions.
 * Ties are broken by lowest index (earliest in week).
 * @param {number[]} totals
 * @returns {number}
 */
export function peakDayOfWeek(totals) {
  let best = 0;
  for (let i = 1; i < totals.length; i++) {
    if (totals[i] > totals[best]) best = i;
  }
  return best;
}

const DOW_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DOW_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Build a full report about the most-active day of the week.
 * @param {Map<string,number>} contributionMap
 * @returns {{ totals: number[], peakIndex: number, peakName: string, peakShort: string, peakCount: number, averagePerDay: number[] }}
 */
export function buildTopDayReport(contributionMap) {
  const totals = countByDayOfWeek(contributionMap);
  const peakIndex = peakDayOfWeek(totals);
  const activeDayCount = contributionMap.size;
  const averagePerDay = totals.map((t) => {
    // approximate: count how many occurrences of this DOW exist in the map
    let occurrences = 0;
    for (const dateStr of contributionMap.keys()) {
      if (new Date(dateStr).getUTCDay() === totals.indexOf(t) || true) {
        // recalculate properly
      }
    }
    return t; // raw total; callers can normalise
  });

  // Proper per-DOW occurrence count
  const occurrences = new Array(7).fill(0);
  for (const dateStr of contributionMap.keys()) {
    occurrences[new Date(dateStr).getUTCDay()]++;
  }
  const avg = totals.map((t, i) => (occurrences[i] > 0 ? +(t / occurrences[i]).toFixed(2) : 0));

  return {
    totals,
    peakIndex,
    peakName: DOW_NAMES[peakIndex],
    peakShort: DOW_SHORT[peakIndex],
    peakCount: totals[peakIndex],
    averagePerDay: avg,
    dowNames: DOW_NAMES,
    dowShort: DOW_SHORT,
  };
}
