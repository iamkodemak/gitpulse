import { describe, it, expect } from 'vitest';
import { categorizeEvent, countEventTypes, aggregateContributions, extractCommitCount, totalCommitCount } from './events.js';

describe('categorizeEvent', () => {
  it('maps PushEvent to commits', () => {
    expect(categorizeEvent('PushEvent')).toBe('commits');
  });

  it('maps PullRequestEvent to prs', () => {
    expect(categorizeEvent('PullRequestEvent')).toBe('prs');
  });

  it('maps unknown event to other', () => {
    expect(categorizeEvent('SomeRandomEvent')).toBe('other');
  });

  it('maps IssuesEvent to issues', () => {
    expect(categorizeEvent('IssuesEvent')).toBe('issues');
  });

  it('maps CreateEvent to other', () => {
    expect(categorizeEvent('CreateEvent')).toBe('other');
  });

  it('returns other for empty string', () => {
    expect(categorizeEvent('')).toBe('other');
  });
});

describe('countEventTypes', () => {
  it('counts each event type', () => {
    const events = [
      { type: 'PushEvent' },
      { type: 'PushEvent' },
      { type: 'IssuesEvent' },
    ];
    const result = countEventTypes(events);
    expect(result.PushEvent).toBe(2);
    expect(result.IssuesEvent).toBe(1);
  });

  it('returns empty object for no events', () => {
    expect(countEventTypes([])).toEqual({});
  });
});

describe('aggregateContributions', () => {
  it('totals all events', () => {
    const events = [
      { type: 'PushEvent' },
      { type: 'PullRequestEvent' },
      { type: 'IssuesEvent' },
    ];
    const result = aggregateContributions(events);
    expect(result.total).toBe(3);
    expect(result.commits).toBe(1);
    expect(result.prs).toBe(1);
    expect(result.issues).toBe(1);
  });

  it('returns zeroed object for empty events', () => {
    const result = aggregateContributions([]);
    expect(result.total).toBe(0);
    expect(result.commits).toBe(0);
  });

  it('counts other events in other category', () => {
    const events = [
      { type: 'CreateEvent' },
      { type: 'WatchEvent' },
    ];
    const result = aggregateContributions(events);
    expect(result.total).toBe(2);
    expect(result.other).toBe(2);
    expect(result.commits).toBe(0);
  });
});

describe('extractCommitCount', () => {
  it('returns commit count from PushEvent', () => {
    const event = { type: 'PushEvent', payload: { commits: [{}, {}, {}] } };
    expect(extractCommitCount(event)).toBe(3);
  });

  it('returns 0 for non-PushEvent', () => {
    expect(extractCommitCount({ type: 'IssuesEvent' })).toBe(0);
  });

  it('returns 0 when payload is missing', () => {
    expect(extractCommitCount({ type: 'PushEvent' })).toBe(0);
  });

  it('returns 0 when commits array is empty', () => {
    expect(extractCommitCount({ type: 'PushEvent', payload: { commits: [] } })).toBe(0);
  });
});

describe('totalCommitCount', () => {
  it('sums commits across PushEvents', () => {
    const events = [
      { type: 'PushEvent', payload: { commits: [{}, {}] } },
      { type: 'PushEvent', payload: { commits: [{}] } },
      { type: 'IssuesEvent', payload: {} },
    ];
    expect(totalCommitCount(events)).toBe(3);
  });

  it('returns 0 with no push events', () => {
    expect(totalCommitCount([{ type: 'IssuesEvent' }])).toBe(0);
  });

  it('returns 0 for empty events array', () => {
    expect(totalCommitCount([])).toBe(0);
  });
});
