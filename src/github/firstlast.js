/**
 * Compute first and last contribution dates from a contribution map.
 */

/**
 * @param {Map<string, number>} contributionMap - date string -> count
 * @returns {string|null}
 */
export function firstContributionDate(contributionMap) {
  const dates = [...contributionMap.keys()].filter(d => contributionMap.get(d) > 0);
  if (dates.length === 0) return null;
  return dates.slice().sort()[0];
}

/**
 * @param {Map<string, number>} contributionMap
 * @returns {string|null}
 */
export function lastContributionDate(contributionMap) {
  const dates = [...contributionMap.keys()].filter(d => contributionMap.get(d) > 0);
  if (dates.length === 0) return null;
  return dates.slice().sort().at(-1);
}

/**
 * @param {string} first - ISO date string
 * @param {string} last  - ISO date string
 * @returns {number} days between first and last (inclusive)
 */
export function daysBetween(first, last) {
  if (!first || !last) return 0;
  const msPerDay = 86400000;
  return Math.round((new Date(last) - new Date(first)) / msPerDay) + 1;
}

/**
 * @param {Map<string, number>} contributionMap
 * @returns {{ first: string|null, last: string|null, spanDays: number }}
 */
export function buildFirstLastReport(contributionMap) {
  const first = firstContributionDate(contributionMap);
  const last = lastContributionDate(contributionMap);
  const spanDays = daysBetween(first, last);
  return { first, last, spanDays };
}
