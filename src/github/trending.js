/**
 * trending.js — Utilities for computing repo momentum and detecting activity spikes.
 */

const DEFAULT_SPIKE_THRESHOLD = 50;
const RECENCY_WEIGHT = 0.4;
const STAR_WEIGHT = 1.0;
const FORK_WEIGHT = 1.5;

/**
 * Compute a momentum score for a repo based on stars, forks, and recency.
 * @param {object} repo
 * @returns {number}
 */
export function computeMomentum(repo) {
  const stars = repo.stargazers_count || 0;
  const forks = repo.forks_count || 0;
  const pushedAt = repo.pushed_at ? new Date(repo.pushed_at) : null;

  const daysSincePush = pushedAt
    ? Math.max(1, (Date.now() - pushedAt.getTime()) / (1000 * 60 * 60 * 24))
    : 365;

  const recencyBoost = RECENCY_WEIGHT * (1 / Math.log1p(daysSincePush));
  const score = STAR_WEIGHT * stars + FORK_WEIGHT * forks + recencyBoost * (stars + forks);

  return Math.round(score * 100) / 100;
}

/**
 * Detect repos whose star count exceeds a threshold.
 * @param {object[]} repos
 * @param {number} threshold
 * @returns {object[]}
 */
export function detectSpikes(repos, threshold = DEFAULT_SPIKE_THRESHOLD) {
  return repos.filter(repo => (repo.stargazers_count || 0) >= threshold);
}

/**
 * Return top N repos sorted descending by a numeric key.
 * @param {object[]} repos
 * @param {string} key
 * @param {number} n
 * @returns {object[]}
 */
export function topReposByKey(repos, key, n = 5) {
  return [...repos]
    .sort((a, b) => (b[key] || 0) - (a[key] || 0))
    .slice(0, n);
}
