import { bold, dim, fg256 } from './colors.js';
import { labelValue, sectionHeader, padEnd } from './formatter.js';

const ACCENT = 75;  // cornflower blue
const MUTED  = 244;

/**
 * Format an ISO date string for display (e.g. "2024-03-15" -> "Mar 15, 2024").
 * @param {string|null} iso
 * @returns {string}
 */
export function formatDate(iso) {
  if (!iso) return dim('—');
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/**
 * Render a human-readable span description.
 * @param {number} spanDays
 * @returns {string}
 */
export function renderSpan(spanDays) {
  if (spanDays <= 0) return dim('no data');
  const years  = Math.floor(spanDays / 365);
  const months = Math.floor((spanDays % 365) / 30);
  const days   = spanDays % 30;
  const parts  = [];
  if (years)  parts.push(`${years}y`);
  if (months) parts.push(`${months}mo`);
  if (days || parts.length === 0) parts.push(`${days}d`);
  return fg256(ACCENT, parts.join(' '));
}

/**
 * Render the first/last contribution panel.
 * @param {{ first: string|null, last: string|null, spanDays: number }} report
 * @returns {string}
 */
export function renderFirstLastPanel(report) {
  const lines = [];
  lines.push(sectionHeader('Contribution Window'));
  lines.push(labelValue('First contribution', formatDate(report.first)));
  lines.push(labelValue('Latest contribution', formatDate(report.last)));
  lines.push(labelValue('Active span', renderSpan(report.spanDays)));
  return lines.join('\n');
}
