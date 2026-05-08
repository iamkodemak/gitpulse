import { fetchFromGitHub } from './client.js';

/**
 * Fetch basic profile info for a GitHub user.
 * @param {string} username
 * @param {string} token
 * @returns {Promise<object>}
 */
export async function fetchUserProfile(username, token) {
  const data = await fetchFromGitHub(`/users/${username}`, token);
  return {
    login: data.login,
    name: data.name || data.login,
    bio: data.bio || '',
    location: data.location || '',
    publicRepos: data.public_repos ?? 0,
    followers: data.followers ?? 0,
    following: data.following ?? 0,
    createdAt: data.created_at,
    avatarUrl: data.avatar_url,
    htmlUrl: data.html_url,
  };
}

/**
 * Format account age in human-readable form.
 * @param {string} createdAt  ISO date string
 * @returns {string}
 */
export function formatAccountAge(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth() + years * 12;
  if (months < 1) return 'less than a month';
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''}`;
  const y = Math.floor(months / 12);
  const m = months % 12;
  const yearPart = `${y} year${y !== 1 ? 's' : ''}`;
  const monthPart = m > 0 ? ` ${m} month${m !== 1 ? 's' : ''}` : '';
  return yearPart + monthPart;
}

/**
 * Build a compact summary object suitable for display.
 * @param {object} profile  result of fetchUserProfile
 * @returns {object}
 */
export function buildUserSummary(profile) {
  return {
    displayName: profile.name,
    handle: `@${profile.login}`,
    bio: profile.bio,
    location: profile.location,
    repos: profile.publicRepos,
    followers: profile.followers,
    following: profile.following,
    age: formatAccountAge(profile.createdAt),
    url: profile.htmlUrl,
  };
}
