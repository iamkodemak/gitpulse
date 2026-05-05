import { describe, it, expect } from 'vitest';
import {
  filterContributionEvents,
  groupByDate,
  buildContributionMap,
  computeStats,
} from './contributions.js';

const makeEvent = (type, date) => ({ type, created_at: `${date}T12:00:00Z` });

describe('filterContributionEvents', () => {
  it('keeps contribution event types', () => {
    const events = [
      makeEvent('PushEvent', '2024-01-01'),
      makeEvent('WatchEvent', '2024-01-01'),
      makeEvent('PullRequestEvent', '2024-01-02'),
    ];
    const result = filterContributionEvents(events);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.type)).toEqual(['PushEvent', 'PullRequestEvent']);
  });
});

describe('groupByDate', () => {
  it('groups events by date string', () => {
    const events = [
      makeEvent('PushEvent', '2024-01-01'),
      makeEvent('PushEvent', '2024-01-01'),
      makeEvent('PushEvent', '2024-01-02'),
    ];
    const result = groupByDate(events);
    expect(result['2024-01-01']).toHaveLength(2);
    expect(result['2024-01-02']).toHaveLength(1);
  });
});

describe('buildContributionMap', () => {
  it('returns an object with the correct number of days', () => {
    const result = buildContributionMap([], 30);
    expect(Object.keys(result)).toHaveLength(30);
  });

  it('counts contributions per day', () => {
    const today = new Date().toISOString().slice(0, 10);
    const events = [makeEvent('PushEvent', today), makeEvent('PushEvent', today)];
    const result = buildContributionMap(events, 7);
    expect(result[today]).toBe(2);
  });
});

describe('computeStats', () => {
  it('computes total, max, activeDays, and streak', () => {
    const map = { '2024-01-01': 3, '2024-01-02': 0, '2024-01-03': 5 };
    const stats = computeStats(map);
    expect(stats.total).toBe(8);
    expect(stats.max).toBe(5);
    expect(stats.activeDays).toBe(2);
  });
});
