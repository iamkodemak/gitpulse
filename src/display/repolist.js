import { bold, dim, fg256 } from './colors.js';
import { padEnd, stripAnsi, sectionHeader } from './formatter.js';
import { summarizeRepo, sortReposBy } from '../github/repos.js';

const LANG_COLORS = {
  JavaScript: 226,
  TypeScript: 75,
  Python: 111,
  Rust: 208,
  Go: 81,
  Ruby: 196,
  Java: 214,
  'C++': 105,
  Unknown: 245,
};

function langColor(language) {
  return LANG_COLORS[language] ?? 245;
}

/**
 * Render a single repo row.
 * @param {object} repo - summarized repo
 * @param {number} nameWidth
 * @returns {string}
 */
export function renderRepoRow(repo, nameWidth = 30) {
  const nameStr = padEnd(repo.name, nameWidth);
  const langStr = fg256(langColor(repo.language), padEnd(repo.language, 12));
  const stars = fg256(226, `★ ${repo.stars}`);
  const forks = dim(`⑂ ${repo.forks}`);
  const forked = repo.isForked ? dim(' [fork]') : '';
  return `  ${bold(nameStr)} ${langStr} ${stars}  ${forks}${forked}`;
}

/**
 * Render a list of repos as a formatted table.
 * @param {Array} rawRepos - raw GitHub repo objects
 * @param {object} options
 * @param {number} [options.limit=10]
 * @param {'stars'|'forks'} [options.sortBy='stars']
 * @returns {string}
 */
export function renderRepoList(rawRepos, options = {}) {
  const { limit = 10, sortBy = 'stars' } = options;
  const summarized = rawRepos.map(summarizeRepo);
  const sorted = sortReposBy(summarized, sortBy);
  const top = sorted.slice(0, limit);

  if (top.length === 0) {
    return dim('  No repositories found.');
  }

  const maxNameLen = Math.min(
    Math.max(...top.map((r) => r.name.length), 10),
    40
  );

  const header = sectionHeader('Top Repositories');
  const rows = top.map((repo) => renderRepoRow(repo, maxNameLen));
  return [header, ...rows].join('\n');
}
