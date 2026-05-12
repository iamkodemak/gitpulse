import { describe, it, expect } from 'vitest';
import {
  bestDayDate,
  topNDays,
  averagePerActiveDay,
  buildBestDayReport,
} from './bestday.js';

const makeMap = (entries) => new Map(entries);

describe('bestDayDate', () => {
  it('returns null for empty map', () => {
    expect(bestDayDate(new Map())).toBeNull();
  });

  it('returns the date with the highest count', () => {
    const map = makeMap([['2024-01-01', 3], ['2024-01-02', 9], ['2024-01-03', 5]]);
    expect(bestDayDate(map)).toBe('2024-01-02');
  });

  it('handles single entry', () => {
    const map = makeMap([['2024-03-10', 1]]);
    expect(bestDayDate(map)).toBe('2024-03-10');
  });
});

describe('topNDays', () => {
  it('returns empty array for empty map', () => {
    expect(topNDays(new Map(), 5)).toEqual([]);
  });

  it('returns top N days sorted descending', () => {
    const map = makeMap([['2024-01-01', 2], ['2024-01-02', 8], ['2024-01-03', 5], ['2024-01-04', 1]]);
    const result = topNDays(map, 2);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ date: '2024-01-02', count: 8 });
    expect(result[1]).toEqual({ date: '2024-01-03', count: 5 });
  });

  it('returns all entries if n exceeds map size', () => {
    const map = makeMap([['2024-01-01', 4], ['2024-01-02', 2]]);
    expect(topNDays(map, 10)).toHaveLength(2);
  });
});

describe('averagePerActiveDay', () => {
  it('returns 0 for empty map', () => {
    expect(averagePerActiveDay(new Map())).toBe(0);
  });

  it('ignores zero-count days', () => {
    const map = makeMap([['2024-01-01', 0], ['2024-01-02', 10], ['2024-01-03', 0]]);
    expect(averagePerActiveDay(map)).toBe(10);
  });

  it('calculates average correctly', () => {
    const map = makeMap([['2024-01-01', 4], ['2024-01-02', 6]]);
    expect(averagePerActiveDay(map)).toBe(5);
  });
});

describe('buildBestDayReport', () => {
  it('returns default report for empty map', () => {
    const report = buildBestDayReport(new Map());
    expect(report.bestDate).toBeNull();
    expect(report.bestCount).toBe(0);
    expect(report.top5).toEqual([]);
    expect(report.avgPerActiveDay).toBe(0);
  });

  it('builds a full report', () => {
    const map = makeMap([['2024-05-01', 7], ['2024-05-02', 3], ['2024-05-03', 12]]);
    const report = buildBestDayReport(map);
    expect(report.bestDate).toBe('2024-05-03');
    expect(report.bestCount).toBe(12);
    expect(report.top5).toHaveLength(3);
    expect(report.avgPerActiveDay).toBe(7.3);
  });
});
