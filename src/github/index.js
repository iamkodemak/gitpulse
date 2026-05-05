import { GitHubClient } from './client.js';
import { buildContributionMap, computeStats } from './contributions.js';

/**
 * Fetches up to `maxPages` pages of user events and builds
 * a contribution map for the given number of days.
 */
export async function fetchContributions({
  username,
  token,
  days = 90,
  maxPages = 3,
}) {
  const client = new GitHubClient(token);

  let allEvents = [];
  for (let page = 1; page <= maxPages; page++) {
    const events = await client.getContributionEvents(username, page);
    allEvents = allEvents.concat(events);
    if (events.length < 100) break; // last page
  }

  const contributionMap = buildContributionMap(allEvents, days);
  const stats = computeStats(contributionMap);

  return { contributionMap, stats, username };
}

export { GitHubClient } from './client.js';
export { buildContributionMap, computeStats } from './contributions.js';
