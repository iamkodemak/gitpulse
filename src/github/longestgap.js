/**
 * longestgap.js — Compute the longest gap (inactive period) between contributions
 */

/**
 * Returns a sorted array of date strings from the contribution map.
 * @param {Object} contributionMap - { 'YYYY-MM-DD': count }
 * @returns {string[]}
 */
export function sortedActiveDates(contributionMap) {
  return Object.keys(contributionMap)
    .filter(date => contributionMap[date] > 0)
    .sort();
}

/**
 * Compute gap in days between two ISO date strings.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function daysBetweenDates(a, b) {
  const msPerDay = 86400000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
}

/**
 * Find the longest gap between consecutive active days.
 * @param {string[]} dates - sorted active date strings
 * @returns {{ start: string|null, end: string|null, days: number }}
 */
export function longestGap(dates) {
  if (dates.length < 2) {
    return { start: null, end: null, days: 0 };
  }

  let maxGap = 0;
  let gapStart = null;
  let gapEnd = null;

  for (let i = 1; i < dates.length; i++) {
    const gap = daysBetweenDates(dates[i - 1], dates[i]) - 1;
    if (gap > maxGap) {
      maxGap = gap;
      gapStart = dates[i - 1];
      gapEnd = dates[i];
    }
  }

  return { start: gapStart, end: gapEnd, days: maxGap };
}

/**
 * Build a full gap report from a contribution map.
 * @param {Object} contributionMap
 * @returns {{ longestGapDays: number, gapStart: string|null, gapEnd: string|null, totalActiveDays: number }}
 */
export function buildLongestGapReport(contributionMap) {
  const dates = sortedActiveDates(contributionMap);
  const { start, end, days } = longestGap(dates);
  return {
    longestGapDays: days,
    gapStart: start,
    gapEnd: end,
    totalActiveDays: dates.length,
  };
}
