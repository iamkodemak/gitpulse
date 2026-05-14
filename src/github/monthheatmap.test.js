import { toYearMonth, aggregateByMonth, recentMonthKeys, monthToLevel, buildMonthHeatmap } from './monthheatmap.js';

function makeMap(entries) {
  return new Map(entries);
}

describe('toYearMonth', () => {
  test('converts date string to YYYY-MM', () => {
    expect(toYearMonth('2024-03-15')).toBe('2024-03');
    expect(toYearMonth('2023-11-01')).toBe('2023-11');
  });
});

describe('aggregateByMonth', () => {
  test('sums contributions per month', () => {
    const map = makeMap([
      ['2024-03-01', 3],
      ['2024-03-15', 5],
      ['2024-04-10', 2],
    ]);
    const result = aggregateByMonth(map);
    expect(result.get('2024-03')).toBe(8);
    expect(result.get('2024-04')).toBe(2);
  });

  test('returns empty map for empty input', () => {
    expect(aggregateByMonth(makeMap([])).size).toBe(0);
  });
});

describe('recentMonthKeys', () => {
  test('returns n month keys ending at given month', () => {
    const keys = recentMonthKeys('2024-04', 3);
    expect(keys).toEqual(['2024-02', '2024-03', '2024-04']);
  });

  test('handles year boundary', () => {
    const keys = recentMonthKeys('2024-02', 3);
    expect(keys).toEqual(['2023-12', '2024-01', '2024-02']);
  });
});

describe('monthToLevel', () => {
  test('returns 0 for zero', () => {
    expect(monthToLevel(0, 30)).toBe(0);
  });

  test('returns 4 for max', () => {
    expect(monthToLevel(30, 30)).toBe(4);
  });

  test('returns proportional level', () => {
    const level = monthToLevel(15, 30);
    expect(level).toBeGreaterThanOrEqual(1);
    expect(level).toBeLessThanOrEqual(4);
  });
});

describe('buildMonthHeatmap', () => {
  test('builds report with entries and busiest month', () => {
    const map = makeMap([
      ['2024-03-01', 10],
      ['2024-03-02', 5],
      ['2024-04-01', 2],
    ]);
    const report = buildMonthHeatmap(map, '2024-04', 3);
    expect(report).toHaveProperty('entries');
    expect(report).toHaveProperty('busiestMonth');
    expect(report.busiestMonth).toBe('2024-03');
  });

  test('handles empty map', () => {
    const report = buildMonthHeatmap(makeMap([]), '2024-04', 3);
    expect(report.entries.length).toBe(3);
    expect(report.busiestMonth).toBeNull();
  });
});
