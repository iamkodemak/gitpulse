// Builds a word frequency map from commit messages and repo names

/**
 * Extract words from a string, lowercased and stripped of punctuation.
 * @param {string} text
 * @returns {string[]}
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'this', 'that', 'from', 'into',
  'add', 'fix', 'use', 'get', 'set', 'not', 'are', 'was', 'has',
  'but', 'its', 'via', 'per', 'ref', 'all', 'new', 'now'
]);

/**
 * Count word frequencies from an array of strings.
 * @param {string[]} texts
 * @returns {Map<string, number>}
 */
function buildWordFrequency(texts) {
  const freq = new Map();
  for (const text of texts) {
    for (const word of tokenize(text)) {
      if (STOP_WORDS.has(word)) continue;
      freq.set(word, (freq.get(word) || 0) + 1);
    }
  }
  return freq;
}

/**
 * Return top N words by frequency.
 * @param {Map<string, number>} freqMap
 * @param {number} n
 * @returns {{ word: string, count: number }[]}
 */
function topWords(freqMap, n = 20) {
  return [...freqMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

/**
 * Build word cloud data from events.
 * @param {object[]} events
 * @param {number} topN
 * @returns {{ words: { word: string, count: number }[], total: number }}
 */
function buildWordCloud(events, topN = 20) {
  const texts = [];
  for (const event of events) {
    if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
      for (const commit of event.payload.commits) {
        if (commit.message) texts.push(commit.message);
      }
    }
    if (event.repo && event.repo.name) {
      texts.push(event.repo.name.split('/').pop());
    }
  }
  const freqMap = buildWordFrequency(texts);
  return {
    words: topWords(freqMap, topN),
    total: texts.length
  };
}

module.exports = { tokenize, buildWordFrequency, topWords, buildWordCloud };
