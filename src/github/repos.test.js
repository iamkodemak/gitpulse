import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUserRepos, summarizeRepo, groupByLanguage, sortReposBy } from './repos.js';
import * as client from './client.js';

const mockRaw = (overrides = {}) => ({
  name: 'my-repo',
  full_name: 'user/my-repo',
  description: 'A repo',
  language: 'JavaScript',
  stargazers_count: 10,
  forks_count: 2,
  fork: false,
  pushed_at: '2024-01-01T00:00:00Z',
  html_url: 'https://github.com/user/my-repo',
  ...overrides,
});

describe('summarizeRepo', () => {
  it('maps fields correctly', () => {
    const result = summarizeRepo(mockRaw());
    expect(result.name).toBe('my-repo');
    expect(result.stars).toBe(10);
    expect(result.language).toBe('JavaScript');
    expect(result.isForked).toBe(false);
  });

  it('defaults missing description and language', () => {
    const result = summarizeRepo(mockRaw({ description: null, language: null }));
    expect(result.description).toBe('');
    expect(result.language).toBe('Unknown');
  });
});

describe('groupByLanguage', () => {
  it('groups repos by language', () => {
    const repos = [
      { name: 'a', language: 'JavaScript' },
      { name: 'b', language: 'Python' },
      { name: 'c', language: 'JavaScript' },
    ];
    const result = groupByLanguage(repos);
    expect(result['JavaScript']).toHaveLength(2);
    expect(result['Python']).toHaveLength(1);
  });

  it('uses Unknown for missing language', () => {
    const repos = [{ name: 'x', language: null }];
    const result = groupByLanguage(repos);
    expect(result['Unknown']).toHaveLength(1);
  });
});

describe('sortReposBy', () => {
  it('sorts by stars descending', () => {
    const repos = [{ stars: 5 }, { stars: 20 }, { stars: 1 }];
    const sorted = sortReposBy(repos, 'stars');
    expect(sorted[0].stars).toBe(20);
    expect(sorted[2].stars).toBe(1);
  });

  it('does not mutate original array', () => {
    const repos = [{ stars: 3 }, { stars: 7 }];
    sortReposBy(repos, 'stars');
    expect(repos[0].stars).toBe(3);
  });
});

describe('fetchUserRepos', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('calls fetchFromGitHub with correct URL', async () => {
    vi.spyOn(client, 'fetchFromGitHub').mockResolvedValue([mockRaw()]);
    const result = await fetchUserRepos('alice', { limit: 5 });
    expect(client.fetchFromGitHub).toHaveBeenCalledWith(
      '/users/alice/repos?type=owner&sort=pushed&per_page=5'
    );
    expect(result).toHaveLength(1);
  });
});
