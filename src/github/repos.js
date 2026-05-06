import { fetchFromGitHub } from './client.js';

/**
 * Fetch repositories for a user, optionally filtered by type.
 * @param {string} username
 * @param {object} options
 * @param {string} [options.type='owner'] - all, owner, member
 * @param {string} [options.sort='pushed'] - created, updated, pushed, full_name
 * @param {number} [options.limit=30]
 * @returns {Promise<Array>}
 */
export async function fetchUserRepos(username, options = {}) {
  const { type = 'owner', sort = 'pushed', limit = 30 } = options;
  const perPage = Math.min(limit, 100);
  const data = await fetchFromGitHub(
    `/users/${username}/repos?type=${type}&sort=${sort}&per_page=${perPage}`
  );
  return data.slice(0, limit);
}

/**
 * Extract a summary from a raw repo object.
 * @param {object} repo
 * @returns {object}
 */
export function summarizeRepo(repo) {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    language: repo.language || 'Unknown',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    isForked: repo.fork,
    pushedAt: repo.pushed_at,
    url: repo.html_url,
  };
}

/**
 * Group repos by primary language.
 * @param {Array} repos - array of summarized repos
 * @returns {object} map of language -> repos[]
 */
export function groupByLanguage(repos) {
  return repos.reduce((acc, repo) => {
    const lang = repo.language || 'Unknown';
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(repo);
    return acc;
  }, {});
}

/**
 * Sort repos by a numeric field descending.
 * @param {Array} repos
 * @param {'stars'|'forks'} field
 * @returns {Array}
 */
export function sortReposBy(repos, field = 'stars') {
  return [...repos].sort((a, b) => (b[field] || 0) - (a[field] || 0));
}
