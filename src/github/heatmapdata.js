/**
 * Builds structured heatmap data from a contribution map,
 * including per-day metadata for tooltip-style display.
 */

/**
 * @param {Object} contributionMap - { 'YYYY-MM-DD': count }
 * @param {number} days - number of days to include (default 365)
 * @returns {Array<{ date: string, count: number, level: number }>}
 */
export function buildHeatmapEntries(contributionMap, days = 365) {
  const entries = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    const count = contributionMap[date] || 0;
    entries.push({ date, count, level: countToLevel(count) });
  }
  return entries;
}

/**
 * Maps a contribution count to a 0–4 intensity level.
 * @param {number} count
 * @returns {number}
 */
export function countToLevel(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Returns the busiest day entry from a list of heatmap entries.
 * @param {Array<{ date: string, count: number }>} entries
 * @returns {{ date: string, count: number } | null}
 */
export function busiestDay(entries) {
  if (!entries || entries.length === 0) return null;
  return entries.reduce((best, e) => (e.count > best.count ? e : best), entries[0]);
}

/**
 * Groups heatmap entries by ISO week (Mon–Sun), returning an array of weeks.
 * Each week is an array of up to 7 day entries.
 * @param {Array<{ date: string, count: number, level: number }>} entries
 * @returns {Array<Array<{ date: string, count: number, level: number }>>}
 */
export function groupEntriesByWeek(entries) {
  const weeks = [];
  let week = [];
  for (const entry of entries) {
    const dow = new Date(entry.date + 'T00:00:00').getDay(); // 0=Sun
    if (week.length > 0 && dow === 0) {
      weeks.push(week);
      week = [];
    }
    week.push(entry);
  }
  if (week.length > 0) weeks.push(week);
  return weeks;
}
