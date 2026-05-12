/**
 * Aggregate and analyze language usage across repositories.
 */

/**
 * Sum bytes per language across all repos.
 * @param {Array} repos - Array of repo objects with `languages` map {lang: bytes}
 * @returns {Object} {lang: totalBytes}
 */
export function aggregateLanguageBytes(repos) {
  const totals = {};
  for (const repo of repos) {
    if (!repo.languages) continue;
    for (const [lang, bytes] of Object.entries(repo.languages)) {
      totals[lang] = (totals[lang] || 0) + bytes;
    }
  }
  return totals;
}

/**
 * Convert raw byte counts to percentage share.
 * @param {Object} langBytes - {lang: bytes}
 * @returns {Object} {lang: percentage} rounded to 1 decimal
 */
export function bytesToPercent(langBytes) {
  const total = Object.values(langBytes).reduce((s, v) => s + v, 0);
  if (total === 0) return {};
  const result = {};
  for (const [lang, bytes] of Object.entries(langBytes)) {
    result[lang] = Math.round((bytes / total) * 1000) / 10;
  }
  return result;
}

/**
 * Return top N languages sorted by bytes descending.
 * @param {Object} langBytes - {lang: bytes}
 * @param {number} n
 * @returns {Array} [{lang, bytes}]
 */
export function topLanguages(langBytes, n = 5) {
  return Object.entries(langBytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([lang, bytes]) => ({ lang, bytes }));
}

/**
 * Count how many repos use each language as primary (first listed).
 * @param {Array} repos
 * @returns {Object} {lang: count}
 */
export function primaryLanguageCounts(repos) {
  const counts = {};
  for (const repo of repos) {
    const lang = repo.language || repo.primaryLanguage;
    if (lang) counts[lang] = (counts[lang] || 0) + 1;
  }
  return counts;
}
