import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchUserProfile, formatAccountAge, buildUserSummary } from './user.js';
import * as client from './client.js';

vi.mock('./client.js');

const MOCK_API_RESPONSE = {
  login: 'octocat',
  name: 'The Octocat',
  bio: 'GitHub mascot',
  location: 'San Francisco',
  public_repos: 8,
  followers: 4000,
  following: 9,
  created_at: '2011-01-25T18:44:36Z',
  avatar_url: 'https://avatars.githubusercontent.com/u/583231',
  html_url: 'https://github.com/octocat',
};

describe('fetchUserProfile', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps API response to profile shape', async () => {
    client.fetchFromGitHub = vi.fn().mockResolvedValue(MOCK_API_RESPONSE);
    const profile = await fetchUserProfile('octocat', 'token123');
    expect(profile.login).toBe('octocat');
    expect(profile.name).toBe('The Octocat');
    expect(profile.publicRepos).toBe(8);
    expect(profile.followers).toBe(4000);
  });

  it('falls back to login when name is null', async () => {
    client.fetchFromGitHub = vi.fn().mockResolvedValue({ ...MOCK_API_RESPONSE, name: null });
    const profile = await fetchUserProfile('octocat', 'token');
    expect(profile.name).toBe('octocat');
  });
});

describe('formatAccountAge', () => {
  it('returns years and months for older accounts', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 3);
    date.setMonth(date.getMonth() - 2);
    const result = formatAccountAge(date.toISOString());
    expect(result).toMatch(/3 years/);
    expect(result).toMatch(/2 months/);
  });

  it('returns singular year when exactly one year', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    const result = formatAccountAge(date.toISOString());
    expect(result).toMatch(/1 year/);
  });

  it('handles less than a month', () => {
    const date = new Date();
    expect(formatAccountAge(date.toISOString())).toBe('less than a month');
  });
});

describe('buildUserSummary', () => {
  it('produces a display-ready summary', () => {
    const profile = {
      name: 'The Octocat', login: 'octocat', bio: 'mascot',
      location: 'SF', publicRepos: 8, followers: 4000,
      following: 9, createdAt: MOCK_API_RESPONSE.created_at,
      htmlUrl: 'https://github.com/octocat',
    };
    const summary = buildUserSummary(profile);
    expect(summary.handle).toBe('@octocat');
    expect(summary.repos).toBe(8);
    expect(typeof summary.age).toBe('string');
  });
});
