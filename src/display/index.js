/**
 * High-level display orchestration — assembles dashboard sections.
 */
import { renderHeatmap } from "./heatmap.js";
import { renderTimeline } from "./timeline.js";
import { renderSummary } from "./summary.js";
import { renderRateLimitBar } from "./ratelimitbar.js";
import { renderUserCard } from "./usercard.js";
import { renderTrendingPanel } from "./trendingpanel.js";
import { renderActivityPanel } from "./activitypanel.js";
import { renderRepoList } from "./repolist.js";
import { renderLanguageChart } from "./languagechart.js";
import { bold } from "./colors.js";

export function renderStats(stats) {
  return renderSummary(stats);
}

export function renderStreak(streak) {
  const { current = 0, longest = 0 } = streak || {};
  return [
    bold("  Streak"),
    `  Current : ${current} day${current !== 1 ? "s" : ""}`,
    `  Longest : ${longest} day${longest !== 1 ? "s" : ""}`,
    "",
  ].join("\n");
}

export function renderDashboard(data) {
  const {
    user,
    contributions,
    stats,
    streak,
    repos,
    langBytes,
    trending,
    activityProfile,
    rateLimit,
  } = data;

  const sections = [];

  if (user) sections.push(renderUserCard(user));
  if (contributions) sections.push(renderHeatmap(contributions));
  if (stats) sections.push(renderStats(stats));
  if (streak) sections.push(renderStreak(streak));
  if (contributions) sections.push(renderTimeline(contributions));
  if (activityProfile) sections.push(renderActivityPanel(activityProfile));
  if (langBytes) sections.push(renderLanguageChart(langBytes));
  if (trending) sections.push(renderTrendingPanel(trending));
  if (repos && repos.length) sections.push(renderRepoList(repos));
  if (rateLimit) sections.push(renderRateLimitBar(rateLimit));

  return sections.join("\n");
}
