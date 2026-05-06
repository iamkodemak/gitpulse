const CONTRIBUTION_EVENTS = [
  'PushEvent',
  'PullRequestEvent',
  'IssuesEvent',
  'CreateEvent',
  'IssueCommentEvent',
  'PullRequestReviewEvent',
];

export function filterContributionEvents(events) {
  return events.filter((e) => CONTRIBUTION_EVENTS.includes(e.type));
}

export function groupByDate(events) {
  const grouped = {};

  for (const event of events) {
    const date = event.created_at.slice(0, 10);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
  }

  return grouped;
}

export function buildContributionMap(events, days = 90) {
  const filtered = filterContributionEvents(events);
  const grouped = groupByDate(filtered);
  const result = {};

  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result[key] = (grouped[key] || []).length;
  }

  return result;
}

export function computeStats(contributionMap) {
  const values = Object.values(contributionMap);
  const total = values.reduce((a, b) => a + b, 0);
  const max = Math.max(...values);
  const activeDays = values.filter((v) => v > 0).length;
  const streak = computeStreak(contributionMap);

  return { total, max, activeDays, streak };
}

function computeStreak(contributionMap) {
  const sortedDates = Object.keys(contributionMap).sort().reverse();
  let streak = 0;
  for (const date of sortedDates) {
    if (contributionMap[date] > 0) streak++;
    else break;
  }
  return streak;
}

/**
 * Returns the most active day of the week based on a contribution map.
 * Returns a string like "Monday", or null if the map is empty.
 */
export function mostActiveDayOfWeek(contributionMap) {
  const dayCounts = new Array(7).fill(0);

  for (const [date, count] of Object.entries(contributionMap)) {
    const day = new Date(date).getUTCDay();
    dayCounts[day] += count;
  }

  const maxCount = Math.max(...dayCounts);
  if (maxCount === 0) return null;

  const dayIndex = dayCounts.indexOf(maxCount);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[dayIndex];
}
