import { bold, dim, fg256 } from './colors.js';
import { padEnd, stripAnsi, sectionHeader } from './formatter.js';

const BAR_WIDTH = 24;

/**
 * Pick a color for a repo bar based on its index.
 * @param {number} idx
 * @returns {(s: string) => string}
 */
export function repoBarColor(idx) {
  const palette = [75, 112, 214, 208, 140];
  return fg256(palette[idx % palette.length]);
}

/**
 * Render a single repo activity bar row.
 * @param {{ repo: string; count: number; share: number }} entry
 * @param {number} idx
 * @returns {string}
 */
export function renderRepoActivityRow(entry, idx) {
  const filled = Math.round(entry.share * BAR_WIDTH);
  const empty = BAR_WIDTH - filled;
  const bar = repoBarColor(idx)('█'.repeat(filled)) + dim('░'.repeat(empty));
  const shortName = entry.repo.split('/').pop() ?? entry.repo;
  const label = padEnd(shortName, 16);
  const count = bold(String(entry.count).padStart(4));
  return `  ${label} ${bar} ${count}`;
}

/**
 * Render the repo activity panel.
 * @param {{ top: { repo: string; count: number; share: number }[]; total: number }} report
 * @returns {string}
 */
export function renderRepoActivityPanel(report) {
  if (!report.top.length) {
    return sectionHeader('Top Repos') + '\n' + dim('  No repository activity found.') + '\n';
  }

  const header = sectionHeader('Top Repos by Activity');
  const rows = report.top.map((entry, i) => renderRepoActivityRow(entry, i));
  const footer = dim(`  Total events: ${report.total}`);
  return [header, ...rows, footer].join('\n') + '\n';
}
