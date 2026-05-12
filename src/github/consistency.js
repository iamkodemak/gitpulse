/**
 * Computes contribution consistency metrics over a rolling window.
 */

/**
 * Returns the number of active weeks (weeks with at least one contribution)
 * over the last `weeks` weeks from `referenceDate`.
 * @param {Map<string, number>} contributionMap - date string -> count
 * @param {number} weeks
 * @param {Date} referenceDate
 * @returns {number}
 */
export function activeWeeksInWindow(contributionMap, weeks, referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);
  const seen = new Set();
  for (const [dateStr, count] of contributionMap.entries()) {
    if (count <= 0) continue;
    const d = new Date(dateStr);
    const diffMs = ref - d;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays < 0 || diffDays >= weeks * 7) continue;
    const weekIndex = Math.floor(diffDays / 7);
    seen.add(weekIndex);
  }
  return seen.size;
}

/**
 * Computes the consistency score as a percentage of active weeks in window.
 * @param {Map<string, number>} contributionMap
 * @param {number} weeks
 * @param {Date} referenceDate
 * @returns {number} 0-100
 */
export function consistencyScore(contributionMap, weeks, referenceDate = new Date()) {
  if (weeks <= 0) return 0;
  const active = activeWeeksInWindow(contributionMap, weeks, referenceDate);
  return Math.round((active / weeks) * 100);
}

/**
 * Finds the longest consecutive streak of active weeks.
 * @param {Map<string, number>} contributionMap
 * @param {Date} referenceDate
 * @returns {number}
 */
export function longestWeeklyStreak(contributionMap, referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);
  const activeWeekSet = new Set();
  for (const [dateStr, count] of contributionMap.entries()) {
    if (count <= 0) continue;
    const d = new Date(dateStr);
    const diffDays = Math.floor((ref - d) / 86400000);
    if (diffDays < 0) continue;
    activeWeekSet.add(Math.floor(diffDays / 7));
  }
  if (activeWeekSet.size === 0) return 0;
  const sorted = Array.from(activeWeekSet).sort((a, b) => a - b);
  let best = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    cur = sorted[i] === sorted[i - 1] + 1 ? cur + 1 : 1;
    if (cur > best) best = cur;
  }
  return best;
}

/**
 * Builds a full consistency report.
 * @param {Map<string, number>} contributionMap
 * @param {Date} referenceDate
 * @returns {object}
 */
export function buildConsistencyReport(contributionMap, referenceDate = new Date()) {
  const score4 = consistencyScore(contributionMap, 4, referenceDate);
  const score12 = consistencyScore(contributionMap, 12, referenceDate);
  const score52 = consistencyScore(contributionMap, 52, referenceDate);
  const weeklyStreak = longestWeeklyStreak(contributionMap, referenceDate);
  return { score4w: score4, score12w: score12, score52w: score52, longestWeeklyStreak: weeklyStreak };
}
