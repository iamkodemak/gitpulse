import {
  sortedDates,
  computeCurrentStreak,
  computeLongestStreak,
  computeActiveWeeks,
  buildStreakReport,
} from './streak.js';

function makeMap(days, base = new Date()) {
  const map = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    map[d.toISOString().slice(0, 10)] = 1;
  }
  return map;
}

describe('sortedDates', () => {
  it('returns dates in ascending order', () => {
    const map = { '2024-03-01': 1, '2024-01-15': 2, '2024-02-10': 3 };
    expect(sortedDates(map)).toEqual(['2024-01-15', '2024-02-10', '2024-03-01']);
  });
});

describe('computeCurrentStreak', () => {
  it('returns 0 when no recent contributions', () => {
    expect(computeCurrentStreak({})).toBe(0);
  });

  it('counts consecutive days from today', () => {
    const map = makeMap(5);
    expect(computeCurrentStreak(map)).toBe(5);
  });

  it('stops at a gap', () => {
    const map = makeMap(3);
    const old = new Date();
    old.setDate(old.getDate() - 10);
    map[old.toISOString().slice(0, 10)] = 1;
    expect(computeCurrentStreak(map)).toBe(3);
  });
});

describe('computeLongestStreak', () => {
  it('returns 0 for empty map', () => {
    expect(computeLongestStreak({})).toBe(0);
  });

  it('finds the longest consecutive run', () => {
    const map = {
      '2024-01-01': 1,
      '2024-01-02': 2,
      '2024-01-03': 1,
      '2024-01-05': 1,
      '2024-01-06': 1,
    };
    expect(computeLongestStreak(map)).toBe(3);
  });

  it('skips zero-count days', () => {
    const map = { '2024-01-01': 0, '2024-01-02': 1, '2024-01-03': 1 };
    expect(computeLongestStreak(map)).toBe(2);
  });
});

describe('computeActiveWeeks', () => {
  it('returns 0 for empty map', () => {
    expect(computeActiveWeeks({}, 4)).toBe(0);
  });

  it('counts weeks with at least one contribution', () => {
    const map = makeMap(7);
    const result = computeActiveWeeks(map, 4);
    expect(result).toBeGreaterThanOrEqual(1);
  });
});

describe('buildStreakReport', () => {
  it('returns an object with current, longest, activeWeeks', () => {
    const map = makeMap(3);
    const report = buildStreakReport(map);
    expect(report).toHaveProperty('current');
    expect(report).toHaveProperty('longest');
    expect(report).toHaveProperty('activeWeeks');
    expect(report.current).toBe(3);
  });
});
