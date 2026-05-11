import { bold, dim, fg256 } from './colors.js';
import { padEnd, sectionHeader } from './formatter.js';

const DOW_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BAR_MAX_WIDTH = 20;

/**
 * Renders a single horizontal bar for a labelled count.
 * @param {string} label
 * @param {number} count
 * @param {number} max
 * @param {number} color 256-color code
 * @returns {string}
 */
export function renderActivityBar(label, count, max, color = 75) {
  const filled = max > 0 ? Math.round((count / max) * BAR_MAX_WIDTH) : 0;
  const bar = fg256(color, '█'.repeat(filled)) + dim('░'.repeat(BAR_MAX_WIDTH - filled));
  return `  ${padEnd(label, 5)} ${bar} ${dim(String(count))}`;
}

/**
 * Renders the day-of-week activity breakdown.
 * @param {number[]} byDow
 * @returns {string}
 */
export function renderDowPanel(byDow) {
  const max = Math.max(...byDow, 1);
  const lines = DOW_LABELS.map((label, i) =>
    renderActivityBar(label, byDow[i], max, 75)
  );
  return [sectionHeader('Activity by Day'), ...lines].join('\n');
}

/**
 * Renders a compact peak-hour summary line.
 * @param {number} hour
 * @returns {string}
 */
export function renderPeakHour(hour) {
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 || 12;
  return `  ${dim('Peak hour:')} ${bold(`${h12}:00 ${period} UTC`)}`;
}

/**
 * Renders the full activity panel.
 * @param {object} profile result of buildActivityProfile
 * @returns {string}
 */
export function renderActivityPanel(profile) {
  if (!profile || profile.totalEvents === 0) {
    return sectionHeader('Activity') + '\n' + dim('  No recent activity.');
  }
  const sections = [
    renderDowPanel(profile.byDayOfWeek),
    renderPeakHour(profile.peakHour),
  ];
  return sections.join('\n') + '\n';
}
