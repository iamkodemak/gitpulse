import { fg256, bold, dim } from './colors.js';
import { stripAnsi, padEnd } from './formatter.js';
import { secondsUntilReset } from '../github/ratelimit.js';

const BAR_WIDTH = 20;

/**
 * Returns a color code based on how much of the rate limit has been used.
 * @param {number} used
 * @param {number} limit
 * @returns {function}
 */
export function rateLimitColor(used, limit) {
  if (limit === 0) return fg256(240);
  const ratio = used / limit;
  if (ratio >= 0.9) return fg256(196); // red
  if (ratio >= 0.6) return fg256(214); // orange/yellow
  return fg256(82);                    // green
}

/**
 * Renders a horizontal usage bar.
 * @param {number} used
 * @param {number} limit
 * @param {number} width
 * @returns {string}
 */
export function renderUsageBar(used, limit, width = BAR_WIDTH) {
  const ratio = limit === 0 ? 0 : Math.min(used / limit, 1);
  const filled = Math.round(ratio * width);
  const empty = width - filled;
  const color = rateLimitColor(used, limit);
  const filledBar = color('█'.repeat(filled));
  const emptyBar = dim('░'.repeat(empty));
  return filledBar + emptyBar;
}

/**
 * Renders a compact rate limit status bar for display in the dashboard.
 * @param {{ used: number, limit: number, remaining: number, resetAt: Date }} info
 * @returns {string}
 */
export function renderRateLimitBar(info) {
  const { used, limit, remaining, resetAt } = info;
  const color = rateLimitColor(used, limit);
  const bar = renderUsageBar(used, limit);

  const secsLeft = secondsUntilReset(resetAt);
  const minsLeft = Math.ceil(secsLeft / 60);
  const resetStr = secsLeft <= 0 ? 'now' : `${minsLeft}m`;

  const label = bold('API Rate Limit');
  const stats = color(`${remaining}`)  + dim(`/${limit} remaining`);
  const reset = dim(` · resets in ${resetStr}`);

  return `${label}  [${bar}]  ${stats}${reset}`;
}
