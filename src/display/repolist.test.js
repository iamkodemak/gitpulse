import { describe, it, expect, vi } from 'vitest';
import { renderRepoRow, renderRepoList } from './repolist.js';
import { stripAnsi } from './formatter.js';

const makeRaw = (overrides = {}) => ({
  name: 'cool-project',
  full_name: 'alice/cool-project',
  description: 'Does stuff',
  language: 'TypeScript',
  stargazers_count: 42,
  forks_count: 7,
  fork: false,
  pushed_at: '2024-03-01T00:00:00Z',
  html_url: 'https://github.com/alice/cool-project',
  ...overrides,
});

describe('renderRepoRow', () => {
  it('includes repo name', () => {
    const repo = {
      name: 'my-lib',
      language: 'JavaScript',
      stars: 5,
      forks: 1,
      isForked: false,
    };
    const output = stripAnsi(renderRepoRow(repo));
    expect(output).toContain('my-lib');
    expect(output).toContain('JavaScript');
    expect(output).toContain('5');
  });

  it('shows [fork] label for forked repos', () => {
    const repo = { name: 'fork-me', language: 'Go', stars: 0, forks: 0, isForked: true };
    const output = stripAnsi(renderRepoRow(repo));
    expect(output).toContain('[fork]');
  });

  it('does not show [fork] for original repos', () => {
    const repo = { name: 'orig', language: 'Rust', stars: 3, forks: 0, isForked: false };
    const output = stripAnsi(renderRepoRow(repo));
    expect(output).not.toContain('[fork]');
  });
});

describe('renderRepoList', () => {
  it('renders a header and rows', () => {
    const raw = [makeRaw(), makeRaw({ name: 'other', stargazers_count: 100 })];
    const output = stripAnsi(renderRepoList(raw));
    expect(output).toContain('Top Repositories');
    expect(output).toContain('cool-project');
    expect(output).toContain('other');
  });

  it('respects limit option', () => {
    const raw = Array.from({ length: 10 }, (_, i) =>
      makeRaw({ name: `repo-${i}`, stargazers_count: i })
    );
    const output = stripAnsi(renderRepoList(raw, { limit: 3 }));
    const lines = output.split('\n').filter((l) => l.includes('repo-'));
    expect(lines.length).toBe(3);
  });

  it('returns empty message when no repos', () => {
    const output = stripAnsi(renderRepoList([]));
    expect(output).toContain('No repositories found');
  });

  it('sorts by stars by default (highest first)', () => {
    const raw = [
      makeRaw({ name: 'low', stargazers_count: 1 }),
      makeRaw({ name: 'high', stargazers_count: 999 }),
    ];
    const output = stripAnsi(renderRepoList(raw));
    expect(output.indexOf('high')).toBeLessThan(output.indexOf('low'));
  });
});
