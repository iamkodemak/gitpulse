/**
 * Render a language breakdown chart for the terminal.
 */
import { fg256, bold, dim } from "./colors.js";
import { padEnd, stripAnsi, sectionHeader } from "./formatter.js";
import { bytesToPercent, topLanguages } from "../github/languages.js";

const LANG_COLORS = {
  JavaScript: 220,
  TypeScript: 75,
  Python: 34,
  Go: 81,
  Rust: 208,
  Ruby: 196,
  Java: 214,
  CSS: 135,
  HTML: 202,
  Shell: 106,
};

const BAR_WIDTH = 28;

/**
 * Pick a terminal color for a language.
 * @param {string} lang
 * @returns {Function} color function
 */
export function langChartColor(lang) {
  const code = LANG_COLORS[lang] || 245;
  return (s) => fg256(code, s);
}

/**
 * Render a single language bar row.
 * @param {string} lang
 * @param {number} pct  0-100
 * @returns {string}
 */
export function renderLangBar(lang, pct) {
  const filled = Math.round((pct / 100) * BAR_WIDTH);
  const empty = BAR_WIDTH - filled;
  const color = langChartColor(lang);
  const bar = color("█".repeat(filled)) + dim("░".repeat(empty));
  const label = padEnd(lang, 14);
  const pctStr = String(pct.toFixed(1)).padStart(5) + "%";
  return `  ${bold(label)} ${bar} ${dim(pctStr)}`;
}

/**
 * Render the full language breakdown panel.
 * @param {Object} langBytes  - {lang: bytes}
 * @param {number} topN
 * @returns {string}
 */
export function renderLanguageChart(langBytes, topN = 6) {
  const top = topLanguages(langBytes, topN);
  if (top.length === 0) return dim("  No language data available.");

  const topBytes = Object.fromEntries(top.map(({ lang, bytes }) => [lang, bytes]));
  const pcts = bytesToPercent(topBytes);

  const lines = [sectionHeader("Language Breakdown")];
  for (const { lang } of top) {
    lines.push(renderLangBar(lang, pcts[lang] || 0));
  }
  lines.push("");
  return lines.join("\n");
}
