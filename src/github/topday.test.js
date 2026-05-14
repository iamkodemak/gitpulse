import { countByDayOfWeek, peakDayOfWeek, buildTopDayReport } from './topday.js';

function makeMap(entries) {
  return new Map(entries);
}

describe('countByDayOfWeek', () => {
  it('returns zeroed array for empty map', () => {
    expect(countByDayOfWeek(new Map())).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it('accumulates counts by UTC day-of-week', () => {
    // 2024-01-01 is a Monday (index 1)
    // 2024-01-07 is a Sunday (index 0)
    const map = makeMap([
      ['2024-01-01', 3],
      ['2024-01-08', 2], // also Monday
      ['2024-01-07', 5], // Sunday
    ]);
    const totals = countByDayOfWeek(map);
    expect(totals[1]).toBe(5); // Mon: 3+2
    expect(totals[0]).toBe(5); // Sun: 5
  });

  it('handles a single entry', () => {
    const map = makeMap([['2024-01-03', 10]]); // Wednesday
    const totals = countByDayOfWeek(map);
    expect(totals[3]).toBe(10);
    expect(totals.reduce((a, b) => a + b, 0)).toBe(10);
  });
});

describe('peakDayOfWeek', () => {
  it('returns index of highest value', () => {
    expect(peakDayOfWeek([0, 5, 3, 8, 2, 1, 0])).toBe(3);
  });

  it('returns 0 for all-zero array', () => {
    expect(peakDayOfWeek([0, 0, 0, 0, 0, 0, 0])).toBe(0);
  });

  it('returns lowest index on tie', () => {
    expect(peakDayOfWeek([10, 10, 0, 0, 0, 0, 0])).toBe(0);
  });
});

describe('buildTopDayReport', () => {
  it('returns correct peak name', () => {
    // All contributions on Fridays (index 5): 2024-01-05, 2024-01-12
    const map = makeMap([
      ['2024-01-05', 4],
      ['2024-01-12', 6],
    ]);
    const report = buildTopDayReport(map);
    expect(report.peakName).toBe('Friday');
    expect(report.peakShort).toBe('Fri');
    expect(report.peakCount).toBe(10);
  });

  it('computes averagePerDay correctly', () => {
    const map = makeMap([
      ['2024-01-01', 4], // Monday
      ['2024-01-08', 6], // Monday
    ]);
    const report = buildTopDayReport(map);
    expect(report.averagePerDay[1]).toBe(5); // (4+6)/2
  });

  it('includes dowNames and dowShort arrays', () => {
    const report = buildTopDayReport(new Map());
    expect(report.dowNames).toHaveLength(7);
    expect(report.dowShort[0]).toBe('Sun');
  });
});
