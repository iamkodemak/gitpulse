const { renderHeatmap, groupIntoWeeks, countToBlock } = require('./heatmap');

describe('countToBlock', () => {
  test('returns empty block for zero count', () => {
    expect(countToBlock(0, 10)).toBe(' ');
  });

  test('returns full block for max count', () => {
    expect(countToBlock(10, 10)).toBe('█');
  });

  test('returns intermediate block for mid count', () => {
    const block = countToBlock(5, 10);
    expect(['░', '▒', '▓']).toContain(block);
  });

  test('handles maxCount of 1', () => {
    expect(countToBlock(1, 1)).toBe('█');
  });
});

describe('groupIntoWeeks', () => {
  test('returns empty array for empty map', () => {
    expect(groupIntoWeeks(new Map())).toEqual([]);
  });

  test('groups dates into weeks of 7', () => {
    const map = new Map();
    for (let i = 1; i <= 14; i++) {
      map.set(`2024-01-${String(i).padStart(2, '0')}`, i);
    }
    const weeks = groupIntoWeeks(map);
    weeks.forEach((week) => expect(week).toHaveLength(7));
  });

  test('pads incomplete first week', () => {
    const map = new Map([['2024-01-03', 5]]); // Wednesday
    const weeks = groupIntoWeeks(map);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[0][0].date).toBeNull();
  });
});

describe('renderHeatmap', () => {
  test('returns message for empty map', () => {
    expect(renderHeatmap(new Map())).toContain('No contribution data');
  });

  test('returns message for null input', () => {
    expect(renderHeatmap(null)).toContain('No contribution data');
  });

  test('renders 7 rows for valid data', () => {
    const map = new Map([['2024-01-01', 3], ['2024-01-02', 5]]);
    const output = renderHeatmap(map);
    const lines = output.trim().split('\n');
    expect(lines).toHaveLength(7);
  });

  test('each row starts with a day label', () => {
    const map = new Map([['2024-01-01', 1]]);
    const output = renderHeatmap(map);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach((day) => expect(output).toContain(day));
  });
});
