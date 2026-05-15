import { describe, it, expect } from 'vitest';
import {
  repoBarColor,
  renderRepoActivityRow,
  renderRepoActivityPanel,
} from './repoactivitypanel.js';
import { stripAnsi } from './formatter.js';

const sampleReport = {
  top: [
    { repo: 'user/alpha', count: 30, share: 0.6 },
    { repo: 'user/beta', count: 20, share: 0.4 },
  ],
  total: 50,
};

describe('repoBarColor', () => {
  it('returns a function', () => {
    expect(typeof repoBarColor(0)).toBe('function');
  });

  it('cycles through palette', () => {
    const c0 = repoBarColor(0)('x');
    const c5 = repoBarColor(5)('x');
    expect(c0).toBe(c5);
  });
});

describe('renderRepoActivityRow', () => {
  it('includes repo short name', () => {
    const row = stripAnsi(renderRepoActivityRow(sampleReport.top[0], 0));
    expect(row).toContain('alpha');
  });

  it('includes event count', () => {
    const row = stripAnsi(renderRepoActivityRow(sampleReport.top[0], 0));
    expect(row).toContain('30');
  });

  it('renders a non-empty bar', () => {
    const row = stripAnsi(renderRepoActivityRow(sampleReport.top[0], 0));
    expect(row).toMatch(/█+/);
  });
});

describe('renderRepoActivityPanel', () => {
  it('renders header', () => {
    const out = stripAnsi(renderRepoActivityPanel(sampleReport));
    expect(out).toContain('Top Repos');
  });

  it('renders all rows', () => {
    const out = stripAnsi(renderRepoActivityPanel(sampleReport));
    expect(out).toContain('alpha');
    expect(out).toContain('beta');
  });

  it('shows total events in footer', () => {
    const out = stripAnsi(renderRepoActivityPanel(sampleReport));
    expect(out).toContain('50');
  });

  it('handles empty report gracefully', () => {
    const out = stripAnsi(renderRepoActivityPanel({ top: [], total: 0 }));
    expect(out).toContain('No repository activity');
  });
});
