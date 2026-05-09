/**
 * Utilities for identifying trending repositories and activity spikes
 * based on recent contribution data.
 */

/**
 * Calculate a simple momentum score for a repo based on recent vs older stars/activity.
 * @param {Object} repo - Repository object
 * @param {number} windowDays - Number of days to consider "recent"
 * @returns {number} momentum score (higher = more trending)
 */
function computeMomentum(repo, windowDays = 30) {
  if (!repo || typeof repo.stargazers_count !== 'number') return 0;
  const age = repo.age_days || 1;
  const recencyFactor = Math.max(1, windowDays / Math.min(age, windowDays));
  return Math.round((repo.stargazers_count / Math.max(age, 1)) * recencyFactor * 100) / 100;
}

/**
 * Detect activity spikes: days where contributions exceed threshold multiplier
 * relative to the user's average.
 * @param {Object} contributionMap - { dateStr: count }
 * @param {number} multiplier - How many times above average counts as a spike
 * @returns {Array<{ date: string, count: number, ratio: number }>}
 */
function detectSpikes(contributionMap, multiplier = 2.0) {
  const entries = Object.entries(contributionMap);
  if (entries.length === 0) return [];

  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const avg = total / entries.length;
  if (avg === 0) return [];

  return entries
    .filter(([, count]) => count >= avg * multiplier)
    .map(([date, count]) => ({
      date,
      count,
      ratio: Math.round((count / avg) * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Rank repos by a given sort key, returning the top N.
 * @param {Array<Object>} repos
 * @param {string} key - Field to rank by
 * @param {number} topN
 * @returns {Array<Object>}
 */
function topReposByKey(repos, key = 'stargazers_count', topN = 5) {
  if (!Array.isArray(repos)) return [];
  return [...repos]
    .filter((r) => typeof r[key] === 'number')
    .sort((a, b) => b[key] - a[key])
    .slice(0, topN);
}

module.exports = { computeMomentum, detectSpikes, topReposByKey };
