// Compute a weekly digest summary from a contribution map

/**
 * Returns ISO week string "YYYY-Www" for a given date string.
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
function isoWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00Z');
  const jan4 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay() + 6) % 7));
  const diff = d - startOfWeek1;
  const week = Math.floor(diff / (7 * 864e5)) + 1;
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/**
 * Aggregate contribution map into weekly totals.
 * @param {Map<string,number>} contributionMap
 * @returns {Map<string,number>} weekKey -> total
 */
function aggregateByWeek(contributionMap) {
  const weeks = new Map();
  for (const [date, count] of contributionMap) {
    const key = isoWeek(date);
    weeks.set(key, (weeks.get(key) || 0) + count);
  }
  return weeks;
}

/**
 * Return the N most recent weeks sorted ascending.
 * @param {Map<string,number>} weekMap
 * @param {number} n
 * @returns {Array<{week:string, count:number}>}
 */
function recentWeeks(weekMap, n = 8) {
  return [...weekMap.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .slice(-n)
    .map(([week, count]) => ({ week, count }));
}

/**
 * Build a full weekly digest report.
 * @param {Map<string,number>} contributionMap
 * @param {number} windowWeeks
 * @returns {{ weeks: Array, total: number, avg: number, best: {week,count}|null }}
 */
function buildWeeklyDigest(contributionMap, windowWeeks = 8) {
  const weekMap = aggregateByWeek(contributionMap);
  const weeks = recentWeeks(weekMap, windowWeeks);
  const total = weeks.reduce((s, w) => s + w.count, 0);
  const avg = weeks.length ? Math.round((total / weeks.length) * 10) / 10 : 0;
  const best = weeks.length
    ? weeks.reduce((b, w) => (w.count > b.count ? w : b), weeks[0])
    : null;
  return { weeks, total, avg, best };
}

module.exports = { isoWeek, aggregateByWeek, recentWeeks, buildWeeklyDigest };
