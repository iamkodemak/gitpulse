import { buildHeatmapEntries, countToLevel, busiestDay, groupEntriesByWeek } from './heatmapdata.js';

describe('countToLevel', () => {
  it('returns 0 for zero', () => expect(countToLevel(0)).toBe(0));
  it('returns 1 for 1', () => expect(countToLevel(1)).toBe(1));
  it('returns 1 for 2', () => expect(countToLevel(2)).toBe(1));
  it('returns 2 for 3', () => expect(countToLevel(3)).toBe(2));
  it('returns 2 for 5', () => expect(countToLevel(5)).toBe(2));
  it('returns 3 for 6', () => expect(countToLevel(6)).toBe(3));
  it('returns 3 for 9', () => expect(countToLevel(9)).toBe(3));
  it('returns 4 for 10', () => expect(countToLevel(10)).toBe(4));
  it('returns 4 for 100', () => expect(countToLevel(100)).toBe(4));
});

describe('buildHeatmapEntries', () => {
  it('returns the correct number of entries', () => {
    const entries = buildHeatmapEntries({}, 30);
    expect(entries).toHaveLength(30);
  });

  it('fills count from map', () => {
    const today = new Date().toISOString().slice(0, 10);
    const map = { [today]: 7 };
    const entries = buildHeatmapEntries(map, 7);
    const last = entries[entries.length - 1];
    expect(last.date).toBe(today);
    expect(last.count).toBe(7);
    expect(last.level).toBe(3);
  });

  it('defaults missing dates to count 0 and level 0', () => {
    const entries = buildHeatmapEntries({}, 5);
    entries.forEach(e => {
      expect(e.count).toBe(0);
      expect(e.level).toBe(0);
    });
  });
});

describe('busiestDay', () => {
  it('returns null for empty array', () => expect(busiestDay([])).toBeNull());
  it('returns null for null', () => expect(busiestDay(null)).toBeNull());
  it('returns the entry with highest count', () => {
    const entries = [
      { date: '2024-01-01', count: 3 },
      { date: '2024-01-02', count: 10 },
      { date: '2024-01-03', count: 2 },
    ];
    expect(busiestDay(entries)).toEqual({ date: '2024-01-02', count: 10 });
  });
});

describe('groupEntriesByWeek', () => {
  it('returns an array of week arrays', () => {
    const entries = buildHeatmapEntries({}, 14);
    const weeks = groupEntriesByWeek(entries);
    expect(Array.isArray(weeks)).toBe(true);
    weeks.forEach(w => expect(Array.isArray(w)).toBe(true));
    const total = weeks.reduce((s, w) => s + w.length, 0);
    expect(total).toBe(14);
  });
});
