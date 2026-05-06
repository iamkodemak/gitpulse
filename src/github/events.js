/**
 * Classifies and aggregates raw GitHub events into typed contribution counts.
 */

/** Map of GitHub event types to contribution categories */
const EVENT_CATEGORY_MAP = {
  PushEvent: 'commits',
  PullRequestEvent: 'prs',
  PullRequestReviewEvent: 'reviews',
  IssuesEvent: 'issues',
  IssueCommentEvent: 'issues',
  CreateEvent: 'other',
  ForkEvent: 'other',
  WatchEvent: 'other',
  ReleaseEvent: 'other',
};

/**
 * Returns the contribution category for a given event type.
 * @param {string} eventType
 * @returns {string}
 */
export function categorizeEvent(eventType) {
  return EVENT_CATEGORY_MAP[eventType] ?? 'other';
}

/**
 * Counts occurrences of each event type from a list of events.
 * @param {Array<{ type: string }>} events
 * @returns {Record<string, number>}
 */
export function countEventTypes(events) {
  return events.reduce((acc, event) => {
    acc[event.type] = (acc[event.type] ?? 0) + 1;
    return acc;
  }, {});
}

/**
 * Aggregates events into categorized contribution totals.
 * @param {Array<{ type: string }>} events
 * @returns {{ total: number, commits: number, prs: number, issues: number, reviews: number, other: number }}
 */
export function aggregateContributions(events) {
  const result = { total: 0, commits: 0, prs: 0, issues: 0, reviews: 0, other: 0 };
  for (const event of events) {
    result.total += 1;
    const category = categorizeEvent(event.type);
    result[category] = (result[category] ?? 0) + 1;
  }
  return result;
}

/**
 * Extracts commit count from PushEvent payload.
 * @param {{ type: string, payload?: { commits?: unknown[] } }} event
 * @returns {number}
 */
export function extractCommitCount(event) {
  if (event.type !== 'PushEvent') return 0;
  return event.payload?.commits?.length ?? 0;
}

/**
 * Sums total commits across all PushEvents (by actual commit objects).
 * @param {Array<{ type: string, payload?: { commits?: unknown[] } }>} events
 * @returns {number}
 */
export function totalCommitCount(events) {
  return events
    .filter(e => e.type === 'PushEvent')
    .reduce((sum, e) => sum + extractCommitCount(e), 0);
}
