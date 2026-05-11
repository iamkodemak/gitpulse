import { computeMomentum, detectSpikes, topReposByKey } from './trending.js';

const mockRepos = [
  { name: 'repo-a', stargazers_count: 120, forks_count: 30, open_issues_count: 5, pushed_at: '2024-06-01T00:00:00Z' },
  { name: 'repo-b', stargazers_count: 45, forks_count: 10, open_issues_count: 2, pushed_at: '2024-05-15T00:00:00Z' },
  { name: 'repo-c', stargazers_count: 300, forks_count: 80, open_issues_count: 20, pushed_at: '2024-06-10T00:00:00Z' },
  { name: 'repo-d', stargazers_count: 10, forks_count: 2, open_issues_count: 0, pushed_at: '2023-01-01T00:00:00Z' },
];

describe('computeMomentum', () => {
  test('returns higher score for repos with more stars and forks', () => {
    const a = computeMomentum(mockRepos[0]);
    const b = computeMomentum(mockRepos[1]);
    expect(a).toBeGreaterThan(b);
  });

  test('returns a numeric score', () => {
    const score = computeMomentum(mockRepos[2]);
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThan(0);
  });

  test('returns 0 or low for very inactive repo', () => {
    const score = computeMomentum(mockRepos[3]);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});

describe('detectSpikes', () => {
  test('returns repos above the spike threshold', () => {
    const spikes = detectSpikes(mockRepos, 100);
    expect(spikes.every(r => r.stargazers_count >= 100)).toBe(true);
  });

  test('returns empty array when no repos exceed threshold', () => {
    const spikes = detectSpikes(mockRepos, 9999);
    expect(spikes).toHaveLength(0);
  });

  test('uses default threshold when not provided', () => {
    const spikes = detectSpikes(mockRepos);
    expect(Array.isArray(spikes)).toBe(true);
  });
});

describe('topReposByKey', () => {
  test('returns top N repos sorted by given key descending', () => {
    const top2 = topReposByKey(mockRepos, 'stargazers_count', 2);
    expect(top2).toHaveLength(2);
    expect(top2[0].name).toBe('repo-c');
    expect(top2[1].name).toBe('repo-a');
  });

  test('sorts by forks_count correctly', () => {
    const top = topReposByKey(mockRepos, 'forks_count', 1);
    expect(top[0].name).toBe('repo-c');
  });

  test('returns all repos if n exceeds length', () => {
    const all = topReposByKey(mockRepos, 'stargazers_count', 100);
    expect(all).toHaveLength(mockRepos.length);
  });
});
