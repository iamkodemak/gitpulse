import {
  firstContributionDate,
  lastContributionDate,
  daysBetween,
  buildFirstLastReport,
} from './firstlast.js';

function makeMap(entries) {
  return new Map(Object.entries(entries));
}

describe('firstContributionDate', () => {
  it('returns the earliest date with contributions', () => {
    const m = makeMap({ '2024-01-05': 3, '2024-01-01': 1, '2024-01-10': 0 });
    expect(firstContributionDate(m)).toBe('2024-01-01');
  });

  it('returns null for empty map', () => {
    expect(firstContributionDate(new Map())).toBeNull();
  });

  it('ignores zero-count dates', () => {
    const m = makeMap({ '2024-01-01': 0, '2024-01-03': 2 });
    expect(firstContributionDate(m)).toBe('2024-01-03');
  });
});

describe('lastContributionDate', () => {
  it('returns the latest date with contributions', () => {
    const m = makeMap({ '2024-01-05': 3, '2024-01-01': 1, '2024-01-10': 0 });
    expect(lastContributionDate(m)).toBe('2024-01-05');
  });

  it('returns null for empty map', () => {
    expect(lastContributionDate(new Map())).toBeNull();
  });
});

describe('daysBetween', () => {
  it('counts inclusive days', () => {
    expect(daysBetween('2024-01-01', '2024-01-01')).toBe(1);
    expect(daysBetween('2024-01-01', '2024-01-10')).toBe(10);
  });

  it('returns 0 for null inputs', () => {
    expect(daysBetween(null, '2024-01-10')).toBe(0);
    expect(daysBetween('2024-01-01', null)).toBe(0);
  });
});

describe('buildFirstLastReport', () => {
  it('builds a complete report', () => {
    const m = makeMap({ '2024-03-01': 2, '2024-03-15': 5, '2024-03-10': 0 });
    const report = buildFirstLastReport(m);
    expect(report.first).toBe('2024-03-01');
    expect(report.last).toBe('2024-03-15');
    expect(report.spanDays).toBe(15);
  });

  it('handles empty map', () => {
    const report = buildFirstLastReport(new Map());
    expect(report.first).toBeNull();
    expect(report.last).toBeNull();
    expect(report.spanDays).toBe(0);
  });
});
