/**
 * Text formatting helpers for terminal output.
 * Provides alignment, padding, and label utilities.
 */

const { palette } = require('./colors');

/**
 * Pad a string to a fixed width (left-aligned).
 * @param {string} str
 * @param {number} width
 * @param {string} [fill=' ']
 */
function padEnd(str, width, fill = ' ') {
  const plain = stripAnsi(str);
  const needed = Math.max(0, width - plain.length);
  return str + fill.repeat(needed);
}

/**
 * Strip ANSI escape codes to measure true string length.
 * @param {string} str
 */
function stripAnsi(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

/**
 * Format a number with thousands separators.
 * @param {number} n
 */
function formatNumber(n) {
  return n.toLocaleString('en-US');
}

/**
 * Render a labeled value row.
 * @param {string} label
 * @param {string|number} value
 * @param {number} [labelWidth=22]
 */
function labelValue(label, value, labelWidth = 22) {
  const coloredLabel = palette.gray(padEnd(label + ':', labelWidth));
  const coloredValue = palette.white(String(value));
  return `  ${coloredLabel} ${coloredValue}`;
}

/**
 * Render a section header.
 * @param {string} title
 */
function sectionHeader(title) {
  const line = '─'.repeat(title.length + 4);
  return `${palette.blue(line)}\n  ${palette.bold(palette.blue(title))}\n${palette.blue(line)}`;
}

/**
 * Render a horizontal divider.
 * @param {number} [width=40]
 */
function divider(width = 40) {
  return palette.dim('─'.repeat(width));
}

module.exports = { padEnd, stripAnsi, formatNumber, labelValue, sectionHeader, divider };
