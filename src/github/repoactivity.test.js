import { describe, it, expect } from 'vitest';
import {
  countEventsByRepo,
  topReposByActivity,
  withShares,
  buildRepoActivityReport,
} from './repoactivity.js';

const makeEvents = (repos) =>
  repos.map((name) => ({ repo: { name } }));

describe('countEventsByRepo', () => {
  it('counts events per repo', () => {
    const events = makeEvents(['a/x', 'a/x', 'b/y']);
    expect(countEventsByRepo(events)).toEqual({ 'a/x': 2, 'b/y': 1 });
  });

  it('returns empty object for no events', () => {
    expect(countEventsByRepo([])).toEqual({});
  });

  it('falls back to unknown for missing repo', () => {
    expect(countEventsByRepo([{}])).toEqual({ unknown: 1 });
  });
});

describe('topReposByActivity', () => {
  it('returns top N sorted by count', () => {
    const counts = { a: 3, b: 7, c: 1 };
    expect(topReposByActivity(counts, 2)).toEqual([
      { repo: 'b', count: 7 },
      { repo: 'a', count: 3 },
    ]);
  });

  it('returns all if fewer than N', () => {
    expect(topReposByActivity({ x: 1 }, 5)).toHaveLength(1);
  });
});

describe('withShares', () => {
  it('computes correct shares', () => {
    const result = withShares([{ repo: 'a', count: 3 }, { repo: 'b', count: 1 }]);
    expect(result[0].share).toBeCloseTo(0.75);
    expect(result[1].share).toBeCloseTo(0.25);
  });

  it('handles zero total', () => {
    const result = withShares([{ repo: 'a', count: 0 }]);
    expect(result[0].share).toBe(0);
  });
});

describe('buildRepoActivityReport', () => {
  it('builds full report', () => {
    const events = makeEvents(['a/x', 'a/x', 'b/y', 'b/y', 'b/y']);
    const report = buildRepoActivityReport(events, 2);
    expect(report.total).toBe(5);
    expect(report.top[0].repo).toBe('b/y');
    expect(report.top[0].share).toBeCloseTo(0.6);
  });
});
