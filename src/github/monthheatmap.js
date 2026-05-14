/**
 * Builds a month-level heatmap from a daily contribution map.
 */

export function toYearMonth(dateStr) {
  return dateStr.slice(0, 7);
}

export function aggregateByMonth(contributionMap) {
  const monthly = new Map();
  for (const [date, count] of contributionMap) {
    const ym = toYearMonth(date);
    monthly.set(ym, (monthly.get(ym) ?? 0) + count);
  }
  return monthly;
}

export function recentMonthKeys(endYearMonth, n) {
  const [year, month] = endYearMonth.split('-').map(Number);
  const keys = [];
  for (let i = n - 1; i >= 0; i--) {
    let m = month - i;
    let y = year;
    while (m <= 0) { m += 12; y -= 1; }
    keys.push(`${y}-${String(m).padStart(2, '0')}`);
  }
  return keys;
}

export function monthToLevel(count, max) {
  if (!max || count === 0) return 0;
  const ratio = count / max;
  if (ratio >= 0.75) return 4;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}

export function buildMonthHeatmap(contributionMap, endYearMonth, numMonths = 12) {
  const monthly = aggregateByMonth(contributionMap);
  const keys = recentMonthKeys(endYearMonth, numMonths);

  let max = 0;
  for (const k of keys) {
    const v = monthly.get(k) ?? 0;
    if (v > max) max = v;
  }

  const entries = keys.map(month => {
    const count = monthly.get(month) ?? 0;
    const level = monthToLevel(count, max);
    return { month, count, level };
  });

  let busiestMonth = null;
  let busiestCount = 0;
  for (const { month, count } of entries) {
    if (count > busiestCount) {
      busiestCount = count;
      busiestMonth = month;
    }
  }

  return { entries, busiestMonth, maxCount: max };
}
