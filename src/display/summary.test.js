import { describe, it, expect } from 'vitest';
import { renderBar, renderEventBreakdown, renderContributionSummary, renderSummary } from './summary.js';
import { stripAnsi } from './formatter.js';

describe('renderBar', () => {
  it('renders a full bar when count equals max', () => {
    const result = stripAnsi(renderBar('PushEvent', 100, 100, 10));
    expect(result).toContain('██████████');
    expect(result).toContain('PushEvent');
  });

  it('renders an empty bar when count is 0', () => {
    const result = stripAnsi(renderBar('IssueEvent', 0, 100, 10));
    expect(result).toContain('░░░░░░░░░░');
  });

  it('renders partial bar correctly', () => {
    const result = stripAnsi(renderBar('PR', 50, 100, 10));
    expect(result).toContain('█████░░░░░');
  });
});

describe('renderEventBreakdown', () => {
  it('returns dim message when no events', () => {
    const result = stripAnsi(renderEventBreakdown({}));
    expect(result).toContain('No events found');
  });

  it('renders sorted event types', () => {
    const counts = { PushEvent: 40, PullRequestEvent: 10, IssuesEvent: 25 };
    const result = stripAnsi(renderEventBreakdown(counts));
    const pushIdx = result.indexOf('Push');
    const issuesIdx = result.indexOf('Issues');
    const prIdx = result.indexOf('PullRequest');
    expect(pushIdx).toBeLessThan(issuesIdx);
    expect(issuesIdx).toBeLessThan(prIdx);
  });

  it('limits to 8 entries', () => {
    const counts = {};
    for (let i = 0; i < 12; i++) counts[`Event${i}`] = i;
    const result = stripAnsi(renderEventBreakdown(counts));
    const matches = result.match(/Event/g) ?? [];
    expect(matches.length).toBeLessThanOrEqual(8);
  });
});

describe('renderContributionSummary', () => {
  it('renders all stat fields', () => {
    const stats = { total: 120, commits: 80, prs: 15, issues: 10, reviews: 15 };
    const result = stripAnsi(renderContributionSummary(stats));
    expect(result).toContain('120');
    expect(result).toContain('80');
    expect(result).toContain('Commits');
    expect(result).toContain('Pull Requests');
  });

  it('defaults missing fields to 0', () => {
    const result = stripAnsi(renderContributionSummary({ total: 5 }));
    expect(result).toContain('0');
  });
});

describe('renderSummary', () => {
  it('combines summary and breakdown', () => {
    const stats = { total: 10, commits: 5, prs: 2, issues: 2, reviews: 1 };
    const counts = { PushEvent: 5, PullRequestEvent: 2 };
    const result = stripAnsi(renderSummary(stats, counts));
    expect(result).toContain('Contribution Summary');
    expect(result).toContain('Event Breakdown');
  });
});
