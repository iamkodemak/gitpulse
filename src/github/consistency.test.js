import {
  activeWeeksInWindow,
  consistencyScore,
  longestWeeklyStreak,
  buildConsistencyReport,
} from './consistency.js';

const REF = new Date('2024-06-30T00:00:00.000Z');

function makeMap(entries) {
  return new Map(entries);
}

describe('activeWeeksInWindow', () => {
  test('returns 0 for empty map', () => {
    expect(activeWeeksInWindow(makeMap([]), 4, REF)).toBe(0);
  });

  test('counts distinct active weeks', () => {
    const map = makeMap([
      ['2024-06-29', 3], // 1 day ago -> week 0
      ['2024-06-22', 2], // 8 days ago -> week 1
      ['2024-06-15', 1], // 15 days ago -> week 2
    ]);
    expect(activeWeeksInWindow(map, 4, REF)).toBe(3);
  });

  test('ignores entries outside the window', () => {
    const map = makeMap([
      ['2024-06-29', 1],
      ['2024-05-01', 5], // > 4 weeks ago
    ]);
    expect(activeWeeksInWindow(map, 4, REF)).toBe(1);
  });

  test('ignores zero-count entries', () => {
    const map = makeMap([['2024-06-29', 0]]);
    expect(activeWeeksInWindow(map, 4, REF)).toBe(0);
  });

  test('multiple days in same week count as one', () => {
    const map = makeMap([
      ['2024-06-29', 2],
      ['2024-06-28', 1],
    ]);
    expect(activeWeeksInWindow(map, 4, REF)).toBe(1);
  });
});

describe('consistencyScore', () => {
  test('returns 0 for weeks <= 0', () => {
    expect(consistencyScore(makeMap([]), 0, REF)).toBe(0);
  });

  test('returns 100 when all weeks active', () => {
    const map = makeMap([
      ['2024-06-29', 1],
      ['2024-06-22', 1],
      ['2024-06-15', 1],
      ['2024-06-08', 1],
    ]);
    expect(consistencyScore(map, 4, REF)).toBe(100);
  });

  test('returns 50 when half weeks active', () => {
    const map = makeMap([
      ['2024-06-29', 1],
      ['2024-06-15', 1],
    ]);
    expect(consistencyScore(map, 4, REF)).toBe(50);
  });
});

describe('longestWeeklyStreak', () => {
  test('returns 0 for empty map', () => {
    expect(longestWeeklyStreak(makeMap([]), REF)).toBe(0);
  });

  test('returns correct streak for consecutive weeks', () => {
    const map = makeMap([
      ['2024-06-29', 1], // week 0
      ['2024-06-22', 1], // week 1
      ['2024-06-15', 1], // week 2
    ]);
    expect(longestWeeklyStreak(map, REF)).toBe(3);
  });

  test('returns longest when gap exists', () => {
    const map = makeMap([
      ['2024-06-29', 1], // week 0
      ['2024-06-15', 1], // week 2 (gap at week 1)
      ['2024-06-08', 1], // week 3
    ]);
    expect(longestWeeklyStreak(map, REF)).toBe(2);
  });
});

describe('buildConsistencyReport', () => {
  test('returns all expected keys', () => {
    const report = buildConsistencyReport(makeMap([]), REF);
    expect(report).toHaveProperty('score4w');
    expect(report).toHaveProperty('score12w');
    expect(report).toHaveProperty('score52w');
    expect(report).toHaveProperty('longestWeeklyStreak');
  });

  test('scores are 0 for empty map', () => {
    const report = buildConsistencyReport(makeMap([]), REF);
    expect(report.score4w).toBe(0);
    expect(report.longestWeeklyStreak).toBe(0);
  });
});
