import { describe, it, expect } from 'vitest';
import {
  sortedActiveDates,
  findQuietPeriods,
  longestQuietPeriod,
  buildQuietPeriodReport,
} from './quietperiod.js';

function makeMap(entries) {
  return new Map(entries);
}

describe('sortedActiveDates', () => {
  it('returns only dates with positive counts', () => {
    const m = makeMap([['2024-01-01', 2], ['2024-01-03', 0], ['2024-01-05', 1]]);
    expect(sortedActiveDates(m)).toEqual(['2024-01-01', '2024-01-05']);
  });

  it('returns empty array for empty map', () => {
    expect(sortedActiveDates(new Map())).toEqual([]);
  });
});

describe('findQuietPeriods', () => {
  it('detects a gap of 7 days', () => {
    const m = makeMap([['2024-01-01', 1], ['2024-01-10', 1]]);
    const gaps = findQuietPeriods(m, 7);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].days).toBe(8);
    expect(gaps[0].start).toBe('2024-01-02');
    expect(gaps[0].end).toBe('2024-01-09');
  });

  it('ignores gaps below minDays', () => {
    const m = makeMap([['2024-01-01', 1], ['2024-01-03', 1]]);
    expect(findQuietPeriods(m, 7)).toHaveLength(0);
  });

  it('returns empty for fewer than 2 active dates', () => {
    const m = makeMap([['2024-01-01', 1]]);
    expect(findQuietPeriods(m, 1)).toHaveLength(0);
  });
});

describe('longestQuietPeriod', () => {
  it('returns the longest gap', () => {
    const m = makeMap([
      ['2024-01-01', 1],
      ['2024-01-05', 1],
      ['2024-01-20', 1],
    ]);
    const result = longestQuietPeriod(m);
    expect(result).not.toBeNull();
    expect(result.days).toBe(14);
  });

  it('returns null when no gaps', () => {
    expect(longestQuietPeriod(new Map())).toBeNull();
  });
});

describe('buildQuietPeriodReport', () => {
  it('builds a report with correct totals', () => {
    const m = makeMap([
      ['2024-01-01', 1],
      ['2024-01-05', 1],
      ['2024-01-20', 1],
    ]);
    const report = buildQuietPeriodReport(m);
    expect(report.longest.days).toBe(14);
    expect(report.totalQuietDays).toBe(17);
    expect(report.recentGaps.length).toBeLessThanOrEqual(3);
  });
});
