const {
  isoWeek,
  aggregateByWeek,
  recentWeeks,
  buildWeeklyDigest,
} = require('./weeklydigest');

function makeMap(entries) {
  return new Map(entries);
}

describe('isoWeek', () => {
  it('returns correct week for a known Monday', () => {
    expect(isoWeek('2024-01-08')).toBe('2024-W02');
  });

  it('returns W01 for the first week of year', () => {
    expect(isoWeek('2024-01-01')).toBe('2024-W01');
  });
});

describe('aggregateByWeek', () => {
  it('sums contributions in the same week', () => {
    const map = makeMap([
      ['2024-01-08', 3],
      ['2024-01-09', 2],
      ['2024-01-15', 5],
    ]);
    const result = aggregateByWeek(map);
    expect(result.get('2024-W02')).toBe(5);
    expect(result.get('2024-W03')).toBe(5);
  });

  it('returns empty map for empty input', () => {
    expect(aggregateByWeek(new Map()).size).toBe(0);
  });
});

describe('recentWeeks', () => {
  it('returns last N weeks sorted ascending', () => {
    const map = makeMap([
      ['2024-W01', 1],
      ['2024-W02', 2],
      ['2024-W03', 3],
      ['2024-W04', 4],
    ]);
    const result = recentWeeks(map, 2);
    expect(result).toHaveLength(2);
    expect(result[0].week).toBe('2024-W03');
    expect(result[1].week).toBe('2024-W04');
  });
});

describe('buildWeeklyDigest', () => {
  it('computes total, avg, and best week', () => {
    const map = makeMap([
      ['2024-01-08', 4],
      ['2024-01-15', 6],
      ['2024-01-22', 2],
    ]);
    const digest = buildWeeklyDigest(map, 8);
    expect(digest.total).toBe(12);
    expect(digest.avg).toBe(4);
    expect(digest.best.count).toBe(6);
  });

  it('handles empty map gracefully', () => {
    const digest = buildWeeklyDigest(new Map(), 8);
    expect(digest.total).toBe(0);
    expect(digest.avg).toBe(0);
    expect(digest.best).toBeNull();
  });
});
