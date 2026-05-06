import { fg256, bold } from './colors.js';

const SPARK_CHARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

/**
 * Normalize an array of values to indices in SPARK_CHARS.
 * @param {number[]} values
 * @returns {number[]}
 */
export function normalizeToLevels(values) {
  const max = Math.max(...values);
  if (max === 0) return values.map(() => 0);
  return values.map(v => Math.round((v / max) * (SPARK_CHARS.length - 1)));
}

/**
 * Pick a color index (256-color) based on intensity level.
 * @param {number} level 0–7
 * @returns {number}
 */
export function levelToColor(level) {
  if (level === 0) return 238;
  if (level <= 2) return 34;
  if (level <= 4) return 40;
  if (level <= 6) return 46;
  return 226;
}

/**
 * Render a sparkline string from an array of contribution counts.
 * @param {number[]} values
 * @param {{ colored?: boolean, width?: number }} options
 * @returns {string}
 */
export function renderSparkline(values, options = {}) {
  const { colored = true, width = 0 } = options;

  let data = values;
  if (width > 0 && values.length > width) {
    data = values.slice(values.length - width);
  } else if (width > 0 && values.length < width) {
    data = Array(width - values.length).fill(0).concat(values);
  }

  const levels = normalizeToLevels(data);

  const chars = levels.map((level, i) => {
    const char = SPARK_CHARS[level];
    if (!colored) return char;
    return fg256(levelToColor(level), char);
  });

  return chars.join('');
}

/**
 * Render a labeled sparkline row.
 * @param {string} label
 * @param {number[]} values
 * @param {{ colored?: boolean, width?: number }} options
 * @returns {string}
 */
export function renderSparklineRow(label, values, options = {}) {
  const spark = renderSparkline(values, options);
  const total = values.reduce((a, b) => a + b, 0);
  return `${bold(label.padEnd(12))} ${spark}  ${fg256(250, String(total))}`;
}
