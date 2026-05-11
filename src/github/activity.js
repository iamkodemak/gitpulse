import { categorizeEvent } from './events.js';

const ACTIVITY_WINDOW_DAYS = 90;

/**
 * Returns events from the last N days.
 * @param {Array} events
 * @param {number} days
 * @returns {Array}
 */
export function filterRecentEvents(events, days = ACTIVITY_WINDOW_DAYS) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return events.filter(e => new Date(e.created_at) >= cutoff);
}

/**
 * Computes activity by day-of-week (0=Sun … 6=Sat).
 * @param {Array} events
 * @returns {number[]} counts indexed by weekday
 */
export function activityByDayOfWeek(events) {
  const counts = Array(7).fill(0);
  for (const event of events) {
    const day = new Date(event.created_at).getDay();
    counts[day]++;
  }
  return counts;
}

/**
 * Computes activity by hour of day (0–23) in UTC.
 * @param {Array} events
 * @returns {number[]} counts indexed by hour
 */
export function activityByHour(events) {
  const counts = Array(24).fill(0);
  for (const event of events) {
    const hour = new Date(event.created_at).getUTCHours();
    counts[hour]++;
  }
  return counts;
}

/**
 * Returns the peak hour (0–23) from an hourly counts array.
 * @param {number[]} hourlyCounts
 * @returns {number}
 */
export function peakHour(hourlyCounts) {
  let max = -1;
  let peak = 0;
  hourlyCounts.forEach((count, hour) => {
    if (count > max) { max = count; peak = hour; }
  });
  return peak;
}

/**
 * Builds a full activity profile from raw events.
 * @param {Array} events
 * @param {number} days
 * @returns {object}
 */
export function buildActivityProfile(events, days = ACTIVITY_WINDOW_DAYS) {
  const recent = filterRecentEvents(events, days);
  const byDow = activityByDayOfWeek(recent);
  const byHour = activityByHour(recent);
  const categorized = recent.reduce((acc, e) => {
    const cat = categorizeEvent(e);
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  return {
    totalEvents: recent.length,
    byDayOfWeek: byDow,
    byHour,
    peakHour: peakHour(byHour),
    byCategory: categorized,
  };
}
