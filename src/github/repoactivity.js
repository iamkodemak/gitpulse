// Analyze per-repo activity from events

/**
 * Count events per repository.
 * @param {object[]} events
 * @returns {Record<string, number>}
 */
export function countEventsByRepo(events) {
  const counts = {};
  for (const event of events) {
    const repo = event.repo?.name ?? 'unknown';
    counts[repo] = (counts[repo] ?? 0) + 1;
  }
  return counts;
}

/**
 * Return the top N repos by event count.
 * @param {Record<string, number>} counts
 * @param {number} n
 * @returns {{ repo: string; count: number }[]}
 */
export function topReposByActivity(counts, n = 5) {
  return Object.entries(counts)
    .map(([repo, count]) => ({ repo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/**
 * Compute the share (0-1) of each repo relative to total events.
 * @param {{ repo: string; count: number }[]} top
 * @returns {{ repo: string; count: number; share: number }[]}
 */
export function withShares(top) {
  const total = top.reduce((s, r) => s + r.count, 0);
  if (total === 0) return top.map(r => ({ ...r, share: 0 }));
  return top.map(r => ({ ...r, share: r.count / total }));
}

/**
 * Build a full repo activity report.
 * @param {object[]} events
 * @param {number} topN
 * @returns {{ top: { repo: string; count: number; share: number }[]; total: number }}
 */
export function buildRepoActivityReport(events, topN = 5) {
  const counts = countEventsByRepo(events);
  const top = withShares(topReposByActivity(counts, topN));
  const total = Object.values(counts).reduce((s, c) => s + c, 0);
  return { top, total };
}
