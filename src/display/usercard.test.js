import { describe, it, expect, vi } from 'vitest';
import { renderStatPill, renderStatRow, renderUserCard } from './usercard.js';
import * as userModule from '../github/user.js';

vi.mock('../github/user.js');

const MOCK_SUMMARY = {
  displayName: 'The Octocat',
  handle: '@octocat',
  bio: 'GitHub mascot',
  location: 'San Francisco',
  repos: 8,
  followers: 4000,
  following: 9,
  age: '13 years 5 months',
  url: 'https://github.com/octocat',
};

describe('renderStatPill', () => {
  it('includes label and value in output', () => {
    const result = renderStatPill('Repos', 42);
    expect(result).toContain('Repos');
    expect(result).toContain('42');
  });

  it('converts numeric value to string', () => {
    const result = renderStatPill('Followers', 1000);
    expect(result).toContain('1000');
  });
});

describe('renderStatRow', () => {
  it('renders multiple stat pills in one line', () => {
    const result = renderStatRow([['Repos', 5], ['Stars', 20]]);
    expect(result).toContain('Repos');
    expect(result).toContain('Stars');
  });

  it('returns a single string', () => {
    const result = renderStatRow([['A', 1]]);
    expect(typeof result).toBe('string');
  });
});

describe('renderUserCard', () => {
  it('renders display name and handle', () => {
    userModule.buildUserSummary = vi.fn().mockReturnValue(MOCK_SUMMARY);
    const card = renderUserCard({});
    expect(card).toContain('The Octocat');
    expect(card).toContain('@octocat');
  });

  it('renders bio when present', () => {
    userModule.buildUserSummary = vi.fn().mockReturnValue(MOCK_SUMMARY);
    const card = renderUserCard({});
    expect(card).toContain('GitHub mascot');
  });

  it('skips bio line when bio is empty', () => {
    userModule.buildUserSummary = vi.fn().mockReturnValue({ ...MOCK_SUMMARY, bio: '' });
    const card = renderUserCard({});
    expect(card).not.toContain('GitHub mascot');
  });

  it('includes repo and follower counts', () => {
    userModule.buildUserSummary = vi.fn().mockReturnValue(MOCK_SUMMARY);
    const card = renderUserCard({});
    expect(card).toContain('8');
    expect(card).toContain('4000');
  });

  it('includes profile URL', () => {
    userModule.buildUserSummary = vi.fn().mockReturnValue(MOCK_SUMMARY);
    const card = renderUserCard({});
    expect(card).toContain('https://github.com/octocat');
  });
});
