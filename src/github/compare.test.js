import {
  slicePeriod,
  sumContributions,
  activeDays,
  buildComparisonReport,
} from './compare.js';

const MAP = {
  '2024-01-01': 3,
  '2024-01-02': 0,
  '2024-01-03': 5,
  '2024-01-04': 2,
  '2024-01-05': 0,
};

describe('slicePeriod', () => {
  it('returns entries within range', () => {
    const result = slicePeriod(MAP, '2024-01-02', '2024-01-04');
    expect(Object.keys(result)).toEqual(['2024-01-02', '2024-01-03', '2024-01-04']);
  });

  it('returns empty object when no dates match', () => {
    expect(slicePeriod(MAP, '2025-01-01', '2025-01-31')).toEqual({});
  });
});

describe('sumContributions', () => {
  it('sums all values', () => {
    expect(sumContributions(MAP)).toBe(10);
  });

  it('returns 0 for empty map', () => {
    expect(sumContributions({})).toBe(0);
  });
});

describe('activeDays', () => {
  it('counts days with contributions > 0', () => {
    expect(activeDays(MAP)).toBe(3);
  });

  it('returns 0 for empty map', () => {
    expect(activeDays({})).toBe(0);
  });
});

describe('buildComparisonReport', () => {
  it('computes delta and percentChange', () => {
    const current = { '2024-02-01': 10, '2024-02-02': 5 };
    const previous = { '2024-01-01': 10, '2024-01-02': 5 };
    const report = buildComparisonReport(current, previous);
    expect(report.currentTotal).toBe(15);
    expect(report.previousTotal).toBe(15);
    expect(report.delta).toBe(0);
    expect(report.percentChange).toBe(0);
    expect(report.improved).toBe(false);
  });

  it('marks improved when current > previous', () => {
    const report = buildComparisonReport({ a: 20 }, { a: 10 });
    expect(report.improved).toBe(true);
    expect(report.percentChange).toBe(100);
  });

  it('handles zero previous total (no division by zero)', () => {
    const report = buildComparisonReport({ a: 5 }, {});
    expect(report.percentChange).toBeNull();
    expect(report.delta).toBe(5);
  });
});
