import { bold, fg256, dim } from './colors.js';
import { sectionHeader } from './formatter.js';
import { renderHeatmap, getContributionStats } from './heatmap.js';
import { renderSparklineRow } from './sparkline.js';
import { renderSummary } from './summary.js';
import { renderTimeline } from './timeline.js';

export function renderStats(stats) {
  const lines = [];
  lines.push(sectionHeader('Stats'));
  lines.push(`  ${bold('Total:')}  ${fg256(75)(String(stats.total))}`);
  lines.push(`  ${bold('Avg/day:')} ${fg256(75)(stats.avgPerDay.toFixed(2))}`);
  lines.push(`  ${bold('Peak:')}   ${fg256(214)(String(stats.peak))} ${dim('on ' + (stats.peakDate || 'N/A'))}`);
  lines.push('');
  return lines.join('\n');
}

export function renderStreak(streak) {
  const lines = [];
  lines.push(sectionHeader('Streak'));
  lines.push(`  ${bold('Current:')} ${fg256(214)(String(streak.current))} days`);
  lines.push(`  ${bold('Longest:')} ${fg256(75)(String(streak.longest))} days`);
  lines.push('');
  return lines.join('\n');
}

export function renderDashboard({
  contributionMap,
  stats,
  streak,
  eventCounts,
  username,
  showTimeline = false,
}) {
  const lines = [];
  lines.push('');
  lines.push(bold(fg256(75)(`  GitPulse — ${username}`)));
  lines.push('');
  lines.push(renderHeatmap(contributionMap));
  lines.push(renderStats(stats));
  lines.push(renderStreak(streak));

  if (eventCounts) {
    lines.push(renderSummary(contributionMap, eventCounts));
  }

  if (showTimeline) {
    lines.push(renderTimeline(contributionMap, 6, 5));
  }

  const { dailyCounts } = getContributionStats(contributionMap);
  if (dailyCounts && dailyCounts.length > 0) {
    lines.push(sectionHeader('Daily Sparkline'));
    lines.push(renderSparklineRow(dailyCounts.slice(-60)));
    lines.push('');
  }

  return lines.join('\n');
}
