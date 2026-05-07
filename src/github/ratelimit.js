/**
 * GitHub API rate limit tracking and reporting.
 */

const DEFAULT_LIMIT = 60;
const DEFAULT_REMAINING = 60;

/**
 * Parse rate limit headers from a GitHub API response.
 * @param {object} headers - HTTP response headers
 * @returns {object} parsed rate limit info
 */
function parseRateLimitHeaders(headers) {
  const limit = parseInt(headers['x-ratelimit-limit'] ?? DEFAULT_LIMIT, 10);
  const remaining = parseInt(headers['x-ratelimit-remaining'] ?? DEFAULT_REMAINING, 10);
  const reset = parseInt(headers['x-ratelimit-reset'] ?? 0, 10);
  const used = parseInt(headers['x-ratelimit-used'] ?? 0, 10);

  return { limit, remaining, reset, used };
}

/**
 * Compute seconds until the rate limit resets.
 * @param {number} resetTimestamp - Unix timestamp of reset
 * @returns {number} seconds until reset
 */
function secondsUntilReset(resetTimestamp) {
  if (!resetTimestamp) return 0;
  return Math.max(0, resetTimestamp - Math.floor(Date.now() / 1000));
}

/**
 * Format rate limit info into a human-readable string.
 * @param {object} rateLimitInfo
 * @returns {string}
 */
function formatRateLimit({ limit, remaining, reset, used }) {
  const secs = secondsUntilReset(reset);
  const mins = Math.ceil(secs / 60);
  const resetStr = secs > 0 ? `resets in ${mins}m` : 'reset unknown';
  return `API rate limit: ${remaining}/${limit} remaining (${used} used, ${resetStr})`;
}

/**
 * Determine if the rate limit is critically low.
 * @param {object} rateLimitInfo
 * @param {number} [threshold=5] - warn if remaining falls below this
 * @returns {boolean}
 */
function isRateLimitLow({ remaining }, threshold = 5) {
  return remaining <= threshold;
}

module.exports = {
  parseRateLimitHeaders,
  secondsUntilReset,
  formatRateLimit,
  isRateLimitLow,
};
