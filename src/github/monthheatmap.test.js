const {
  toYearMonth,
  aggregateByMonth,
  recentMonthKeys,
  monthToLevel,
  buildMonthHeatmap,
} = require('./monthheatmap');

function makeMap(entries) {
  return new Map(entries);
}

describe('toYearMonth', () => {
  it('extracts YYYY-MM from a date string', () => {
    expect(toYearMonth('2024-03-15')).toBe('2024-03');
  });

  it('works for first day of month', () => {
    expect(toYearMonth('2023-01-01')).toBe('2023-01');
  });
});

describe('aggregateByMonth', () => {
  it('sums contributions by year-month', () => {
    const map = makeMap([
      ['2024-01-01', 3],
      ['2024-01-15', 5],
      ['2024-02-10', 2],
    ]);
    const result = aggregateByMonth(map);
    expect(result.get('2024-01')).toBe(8);
    expect(result.get('2024-02')).toBe(2);
  });

  it('returns empty map for empty input', () => {
    expect(aggregateByMonth(new Map()).size).toBe(0);
  });
});

describe('recentMonthKeys', () => {
  it('returns only keys within the window', () => {
    const now = new Date();
    const thisMonth = now.toISOString().slice(0, 7);
    const oldMonth = '2000-01';
    const map = makeMap([[thisMonth, 10], [oldMonth, 5]]);
    const keys = recentMonthKeys(map, 3);
    expect(keys).toContain(thisMonth);
    expect(keys).not.toContain(oldMonth);
  });

  it('returns keys in sorted order', () => {
    const map = makeMap([['2024-03', 1], ['2024-01', 2], ['2024-02', 3]]);
    const keys = recentMonthKeys(map, 24);
    expect(keys).toEqual([...keys].sort());
  });
});

describe('monthToLevel', () => {
  it('returns 0 for zero value', () => {
    expect(monthToLevel(0, 100)).toBe(0);
  });

  it('returns 0 when max is 0', () => {
    expect(monthToLevel(0, 0)).toBe(0);
  });

  it('assigns level 4 for max value', () => {
    expect(monthToLevel(100, 100)).toBe(4);
  });

  it('assigns level 1 for low value', () => {
    expect(monthToLevel(10, 100)).toBe(1);
  });

  it('assigns level 2 for mid-low value', () => {
    expect(monthToLevel(40, 100)).toBe(2);
  });
});

describe('buildMonthHeatmap', () => {
  it('returns keys, totals, levels and max', () => {
    const map = makeMap([['2024-01-01', 10], ['2024-01-02', 5]]);
    const report = buildMonthHeatmap(map, 24);
    expect(report).toHaveProperty('keys');
    expect(report).toHaveProperty('totals');
    expect(report).toHaveProperty('levels');
    expect(report).toHaveProperty('max');
    expect(report.max).toBe(15);
  });

  it('level of busiest month is 4', () => {
    const map = makeMap([['2024-01-01', 100], ['2024-02-01', 10]]);
    const report = buildMonthHeatmap(map, 24);
    expect(report.levels.get('2024-01')).toBe(4);
  });
});
