import fetch from 'node-fetch';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubClient {
  constructor(token) {
    if (!token) {
      throw new Error('GitHub token is required');
    }
    this.token = token;
    this.headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async request(endpoint, options = {}) {
    const url = `${GITHUB_API_BASE}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.headers, ...options.headers },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `GitHub API error ${response.status}: ${
          error.message || response.statusText
        }`
      );
    }

    return response.json();
  }

  async getUser(username) {
    return this.request(`/users/${username}`);
  }

  async getContributionEvents(username, page = 1) {
    return this.request(
      `/users/${username}/events?per_page=100&page=${page}`
    );
  }
}
