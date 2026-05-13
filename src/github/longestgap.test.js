import {
  sortedActiveDates,
  daysBetweenDates,
  longestGap,
  buildLongestGapReport,
} from './longestgap.js';

function makeMap(entries) {
  return Object.fromEntries(entries);
}

describe('sortedActiveDates', () => {
  it('returns only dates with count > 0, sorted', () => {
    const map = makeMap([
      ['2024-03-01', 2],
      ['2024-01-15', 0],
      ['2024-02-10', 1],
    ]);
    expect(sortedActiveDates(map)).toEqual(['2024-02-10', '2024-03-01']);
  });

  it('returns empty array when no active days', () => {
    expect(sortedActiveDates({ '2024-01-01': 0 })).toEqual([]);
  });
});

describe('daysBetweenDates', () => {
  it('returns correct day difference', () => {
    expect(daysBetweenDates('2024-01-01', '2024-01-11')).toBe(10);
  });

  it('returns 1 for consecutive days', () => {
    expect(daysBetweenDates('2024-03-04', '2024-03-05')).toBe(1);
  });
});

describe('longestGap', () => {
  it('finds the longest gap between active dates', () => {
    const dates = ['2024-01-01', '2024-01-03', '2024-01-20', '2024-01-22'];
    const result = longestGap(dates);
    expect(result.days).toBe(16); // gap between Jan 3 and Jan 20 = 16 inactive days
    expect(result.start).toBe('2024-01-03');
    expect(result.end).toBe('2024-01-20');
  });

  it('returns zero gap for consecutive days', () => {
    const dates = ['2024-01-01', '2024-01-02', '2024-01-03'];
    const result = longestGap(dates);
    expect(result.days).toBe(0);
  });

  it('returns null fields for fewer than 2 dates', () => {
    expect(longestGap([])).toEqual({ start: null, end: null, days: 0 });
    expect(longestGap(['2024-01-01'])).toEqual({ start: null, end: null, days: 0 });
  });
});

describe('buildLongestGapReport', () => {
  it('builds a full report', () => {
    const map = makeMap([
      ['2024-01-01', 3],
      ['2024-01-05', 1],
      ['2024-02-01', 2],
    ]);
    const report = buildLongestGapReport(map);
    expect(report.totalActiveDays).toBe(3);
    expect(report.longestGapDays).toBe(26); // Jan 5 to Feb 1 = 26 inactive days
    expect(report.gapStart).toBe('2024-01-05');
    expect(report.gapEnd).toBe('2024-02-01');
  });

  it('handles empty map', () => {
    const report = buildLongestGapReport({});
    expect(report.longestGapDays).toBe(0);
    expect(report.gapStart).toBeNull();
    expect(report.totalActiveDays).toBe(0);
  });
});
