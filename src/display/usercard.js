import { bold, dim, fg256 } from './colors.js';
import { labelValue, sectionHeader, padEnd } from './formatter.js';
import { buildUserSummary } from '../github/user.js';

const ACCENT = 75;  // cornflower blue
const MUTED  = 244; // medium grey

/**
 * Render a single stat pill: label + value side by side.
 * @param {string} label
 * @param {string|number} value
 * @returns {string}
 */
export function renderStatPill(label, value) {
  return `${dim(fg256(MUTED, label + ':'))} ${bold(String(value))}`;
}

/**
 * Render a two-column row of stat pills.
 * @param {Array<[string,string|number]>} pairs
 * @returns {string}
 */
export function renderStatRow(pairs) {
  return pairs
    .map(([label, value]) => padEnd(renderStatPill(label, value), 30))
    .join('  ');
}

/**
 * Render the full user profile card.
 * @param {object} profile  result of fetchUserProfile
 * @returns {string}
 */
export function renderUserCard(profile) {
  const s = buildUserSummary(profile);
  const lines = [];

  lines.push(sectionHeader('Profile'));
  lines.push(
    `  ${bold(fg256(ACCENT, s.displayName))}  ${dim(s.handle)}`
  );

  if (s.bio) {
    lines.push(`  ${dim(s.bio)}`);
  }
  if (s.location) {
    lines.push(`  ${dim('📍 ' + s.location)}`);
  }

  lines.push('');
  lines.push(
    '  ' + renderStatRow([
      ['Repos',     s.repos],
      ['Followers', s.followers],
    ])
  );
  lines.push(
    '  ' + renderStatRow([
      ['Following', s.following],
      ['Member for', s.age],
    ])
  );
  lines.push(
    `  ${dim(s.url)}`
  );
  lines.push('');

  return lines.join('\n');
}
