/**
 * Render a compact rate limit status bar for the dashboard.
 */

const { fg256, bold, dim } = require('./colors');
const { formatRateLimit, isRateLimitLow } = require('../github/ratelimit');

const COLOR_OK = 34;      // blue
const COLOR_WARN = 214;   // orange
const COLOR_CRIT = 196;   // red

/**
 * Choose a color based on remaining quota percentage.
 * @param {number} remaining
 * @param {number} limit
 * @returns {number} 256-color code
 */
function rateLimitColor(remaining, limit) {
  if (limit === 0) return COLOR_WARN;
  const pct = remaining / limit;
  if (pct <= 0.08) return COLOR_CRIT;
  if (pct <= 0.25) return COLOR_WARN;
  return COLOR_OK;
}

/**
 * Render a mini usage bar (e.g. [████░░░░░░]).
 * @param {number} used
 * @param {number} limit
 * @param {number} [width=10]
 * @returns {string}
 */
function renderUsageBar(used, limit, width = 10) {
  if (limit === 0) return dim('[---------]');
  const filled = Math.round((used / limit) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return `[${bar}]`;
}

/**
 * Render the full rate limit status line.
 * @param {object} rateLimitInfo - from parseRateLimitHeaders
 * @returns {string} formatted, colored status line
 */
function renderRateLimitBar(rateLimitInfo) {
  const { limit, remaining, used } = rateLimitInfo;
  const color = rateLimitColor(remaining, limit);
  const low = isRateLimitLow(rateLimitInfo);

  const label = bold(fg256(color, 'Rate Limit'));
  const bar = fg256(color, renderUsageBar(used, limit));
  const info = (low ? fg256(COLOR_CRIT, formatRateLimit(rateLimitInfo)) : dim(formatRateLimit(rateLimitInfo)));

  return `${label} ${bar} ${info}`;
}

module.exports = {
  rateLimitColor,
  renderUsageBar,
  renderRateLimitBar,
};
