/**
 * Terminal color utilities for the dashboard display.
 * Supports 256-color and truecolor terminals with graceful fallback.
 */

const SUPPORTS_COLOR = process.env.FORCE_COLOR !== '0' && (
  process.env.FORCE_COLOR ||
  (process.stdout && process.stdout.isTTY)
);

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
};

/**
 * Wrap text in an ANSI 256-color foreground sequence.
 * @param {string} text
 * @param {number} code - 0-255
 */
function fg256(text, code) {
  if (!SUPPORTS_COLOR) return text;
  return `\x1b[38;5;${code}m${text}${ANSI.reset}`;
}

/**
 * Wrap text in bold.
 * @param {string} text
 */
function bold(text) {
  if (!SUPPORTS_COLOR) return text;
  return `${ANSI.bold}${text}${ANSI.reset}`;
}

/**
 * Wrap text in dim style.
 * @param {string} text
 */
function dim(text) {
  if (!SUPPORTS_COLOR) return text;
  return `${ANSI.dim}${text}${ANSI.reset}`;
}

/**
 * Named color palette used across the dashboard.
 */
const palette = {
  green:  (t) => fg256(t, 34),
  yellow: (t) => fg256(t, 220),
  blue:   (t) => fg256(t, 75),
  red:    (t) => fg256(t, 196),
  gray:   (t) => fg256(t, 244),
  white:  (t) => fg256(t, 255),
  bold,
  dim,
};

module.exports = { fg256, bold, dim, palette, SUPPORTS_COLOR };
