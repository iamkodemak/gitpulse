/**
 * Renders a trending activity panel showing spikes and top repos.
 */
const { fg256, bold, dim } = require('./colors');
const { padEnd, sectionHeader, labelValue } = require('./formatter');

const SPIKE_COLOR = 214;   // orange
const REPO_COLOR  = 75;    // sky blue
const RATIO_COLOR = 154;   // green

/**
 * Render a single spike row.
 * @param {{ date: string, count: number, ratio: number }} spike
 * @returns {string}
 */
function renderSpikeRow(spike) {
  const dateStr = dim(padEnd(spike.date, 12));
  const countStr = fg256(SPIKE_COLOR, bold(String(spike.count).padStart(4)));
  const ratioStr = fg256(RATIO_COLOR, `x${spike.ratio.toFixed(1)}`);
  return `  ${dateStr} ${countStr}  ${ratioStr}`;
}

/**
 * Render a trending repo row.
 * @param {Object} repo
 * @returns {string}
 */
function renderTrendingRepoRow(repo) {
  const name  = fg256(REPO_COLOR, padEnd(repo.name || repo.full_name || 'unknown', 30));
  const stars = fg256(SPIKE_COLOR, `★ ${repo.stargazers_count ?? 0}`);
  const lang  = dim(repo.language ? padEnd(repo.language, 12) : padEnd('—', 12));
  return `  ${name} ${lang} ${stars}`;
}

/**
 * Render the full trending panel.
 * @param {Array} spikes - Output of detectSpikes
 * @param {Array} repos  - Top trending repos
 * @returns {string}
 */
function renderTrendingPanel(spikes = [], repos = []) {
  const lines = [];

  lines.push(sectionHeader('Activity Spikes'));
  if (spikes.length === 0) {
    lines.push(dim('  No notable spikes detected.'));
  } else {
    spikes.slice(0, 5).forEach((s) => lines.push(renderSpikeRow(s)));
  }

  lines.push('');
  lines.push(sectionHeader('Trending Repos'));
  if (repos.length === 0) {
    lines.push(dim('  No repos to display.'));
  } else {
    repos.slice(0, 5).forEach((r) => lines.push(renderTrendingRepoRow(r)));
  }

  return lines.join('\n');
}

module.exports = { renderSpikeRow, renderTrendingRepoRow, renderTrendingPanel };
