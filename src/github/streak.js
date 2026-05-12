/**
 * Streak analysis: compute current, longest, and weekly streaks
 * from a contribution map (date string -> count).
 */

/**
 * Returns sorted array of date strings (YYYY-MM-DD) from the map.
 */
export function sortedDates(contributionMap) {
  return Object.keys(contributionMap).sort();
}

/**
 * Compute current active streak (days in a row ending today or yesterday).
 */
export function computeCurrentStreak(contributionMap) {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (contributionMap[key] > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Compute the longest streak ever in the contribution map.
 */
export function computeLongestStreak(contributionMap) {
  const dates = sortedDates(contributionMap);
  let longest = 0;
  let current = 0;
  let prev = null;
  for (const date of dates) {
    if (contributionMap[date] <= 0) {
      current = 0;
      prev = null;
      continue;
    }
    if (prev) {
      const prevDate = new Date(prev);
      prevDate.setDate(prevDate.getDate() + 1);
      const expected = prevDate.toISOString().slice(0, 10);
      if (date === expected) {
        current++;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    if (current > longest) longest = current;
    prev = date;
  }
  return longest;
}

/**
 * Compute number of active weeks (at least one contribution) in the last N weeks.
 */
export function computeActiveWeeks(contributionMap, weeks = 12) {
  const today = new Date();
  let activeWeeks = 0;
  for (let w = 0; w < weeks; w++) {
    let hasActivity = false;
    for (let d = 0; d < 7; d++) {
      const day = new Date(today);
      day.setDate(today.getDate() - w * 7 - d);
      const key = day.toISOString().slice(0, 10);
      if (contributionMap[key] > 0) {
        hasActivity = true;
        break;
      }
    }
    if (hasActivity) activeWeeks++;
  }
  return activeWeeks;
}

/**
 * Build a full streak report.
 */
export function buildStreakReport(contributionMap) {
  return {
    current: computeCurrentStreak(contributionMap),
    longest: computeLongestStreak(contributionMap),
    activeWeeks: computeActiveWeeks(contributionMap, 12),
  };
}
