import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitHubClient } from './client.js';

vi.mock('node-fetch', () => ({
  default: vi.fn(),
}));

import fetch from 'node-fetch';

const mockJson = vi.fn();
const mockResponse = (ok, data, status = 200) => ({
  ok,
  status,
  statusText: ok ? 'OK' : 'Not Found',
  json: mockJson.mockResolvedValue(data),
});

describe('GitHubClient', () => {
  beforeEach(() => vi.clearAllMocks());

  it('throws if no token is provided', () => {
    expect(() => new GitHubClient()).toThrow('GitHub token is required');
  });

  it('getUser returns parsed user data', async () => {
    fetch.mockResolvedValue(mockResponse(true, { login: 'octocat', id: 1 }));
    const client = new GitHubClient('fake-token');
    const user = await client.getUser('octocat');
    expect(user.login).toBe('octocat');
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/users/octocat',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-token',
        }),
      })
    );
  });

  it('throws on non-ok response', async () => {
    fetch.mockResolvedValue(mockResponse(false, { message: 'Not Found' }, 404));
    const client = new GitHubClient('fake-token');
    await expect(client.getUser('nobody')).rejects.toThrow('GitHub API error 404');
  });
});
