const { fg256, bold, dim } = require('./colors');
const { sectionHeader, padEnd, stripAnsi } = require('./formatter');

// Color palette for word frequency levels
const WORD_COLORS = [196, 202, 208, 214, 220, 226, 190, 154, 118, 82];

/**
 * Pick a color based on relative frequency rank.
 * @param {number} index - rank index (0 = highest)
 * @param {number} total - total number of words
 * @returns {string}
 */
function wordColor(index, total) {
  const slot = Math.floor((index / total) * WORD_COLORS.length);
  return fg256(WORD_COLORS[Math.min(slot, WORD_COLORS.length - 1)]);
}

/**
 * Render a single word with its count.
 * @param {string} word
 * @param {number} count
 * @param {string} color
 * @returns {string}
 */
function renderWordToken(word, count, color) {
  return `${color}${bold(word)}${dim(`(${count})`)}`;
}

/**
 * Render word cloud as wrapped rows.
 * @param {{ word: string, count: number }[]} words
 * @param {number} width
 * @returns {string[]}
 */
function renderWordRows(words, width = 60) {
  const lines = [];
  let current = '';
  let currentLen = 0;

  words.forEach(({ word, count }, i) => {
    const color = wordColor(i, words.length);
    const token = renderWordToken(word, count, color);
    const rawLen = word.length + String(count).length + 2 + 1; // word + (count) + space
    if (currentLen + rawLen > width && current.length > 0) {
      lines.push(current.trimEnd());
      current = '';
      currentLen = 0;
    }
    current += token + ' ';
    currentLen += rawLen;
  });

  if (current.trim().length > 0) lines.push(current.trimEnd());
  return lines;
}

/**
 * Render the full word cloud panel.
 * @param {{ words: { word: string, count: number }[], total: number }} data
 * @param {number} width
 * @returns {string}
 */
function renderWordCloudPanel(data, width = 60) {
  const { words, total } = data;
  const lines = [sectionHeader('Commit Word Cloud', width)];

  if (!words || words.length === 0) {
    lines.push(dim('  No commit messages found.'));
    return lines.join('\n');
  }

  lines.push(dim(`  Based on ${total} message(s) — top ${words.length} words`));
  lines.push('');

  const rows = renderWordRows(words, width - 2);
  for (const row of rows) {
    lines.push('  ' + row);
  }

  return lines.join('\n');
}

module.exports = { wordColor, renderWordToken, renderWordRows, renderWordCloudPanel };
