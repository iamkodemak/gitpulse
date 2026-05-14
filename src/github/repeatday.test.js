import { describe, it, expect } from 'vitest';
import {
  activeDaysOfMonth,
  countByDayOfMonth,
  peakDayOfMonth,
  buildRepeatDayReport,
} from './repeatday.js';

function makeMap(entries) {
  return new Map(entries);
}

describe('activeDaysOfMonth', () => {
  it('returns day numbers for active days only', () => {
    const map = makeMap([
      ['2024-01-05', 3],
      ['2024-01-15', 0],
      ['2024-02-05', 1],
    ]);
    expect(activeDaysOfMonth(map).sort((a, b) => a - b)).toEqual([5, 5]);
  });

  it('returns empty array for empty map', () => {
    expect(activeDaysOfMonth(makeMap([]))).toEqual([]);
  });
});

describe('countByDayOfMonth', () => {
  it('counts occurrences of each day number', () => {
    const result = countByDayOfMonth([5, 5, 15, 5, 15]);
    expect(result[5]).toBe(3);
    expect(result[15]).toBe(2);
  });

  it('handles empty array', () => {
    expect(countByDayOfMonth([])).toEqual({});
  });
});

describe('peakDayOfMonth', () => {
  it('returns the day with the highest count', () => {
    expect(peakDayOfMonth({ 5: 3, 15: 2, 20: 1 })).toBe(5);
  });

  it('returns null for empty counts', () => {
    expect(peakDayOfMonth({})).toBeNull();
  });
});

describe('buildRepeatDayReport', () => {
  it('builds a full report', () => {
    const map = makeMap([
      ['2024-01-10', 2],
      ['2024-02-10', 1],
      ['2024-03-10', 4],
      ['2024-03-20', 3],
    ]);
    const report = buildRepeatDayReport(map);
    expect(report.peak).toBe(10);
    expect(report.counts[10]).toBe(3);
    expect(report.counts[20]).toBe(1);
    expect(report.total).toBe(4);
  });

  it('handles empty map', () => {
    const report = buildRepeatDayReport(makeMap([]));
    expect(report.peak).toBeNull();
    expect(report.total).toBe(0);
  });
});
