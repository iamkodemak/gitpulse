import { bold, dim, fg256 } from './colors.js';
import { padEnd, labelValue, sectionHeader } from './formatter.js';

const FLAME = '🔥';
const SNOWFLAKE = '❄️';

/**
 * Render a visual streak bar (filled blocks proportional to streak length).
 */
export function renderStreakBar(current, longest, width = 20) {
  if (longest === 0) return dim('─'.repeat(width));
  const filled = Math.round((current / longest) * width);
  const color = current >= 7 ? 214 : current >= 3 ? 178 : 244;
  const bar = fg256(color, '█'.repeat(filled)) + dim('░'.repeat(width - filled));
  return bar;
}

/**
 * Render the current streak line.
 */
export function renderCurrentStreak(current) {
  const icon = current > 0 ? FLAME : SNOWFLAKE;
  const label = `${icon}  Current Streak`;
  const value = bold(`${current} day${current !== 1 ? 's' : ''}`);
  return labelValue(label, value);
}

/**
 * Render the longest streak line.
 */
export function renderLongestStreak(longest) {
  return labelValue('🏆 Longest Streak', bold(`${longest} day${longest !== 1 ? 's' : ''}`));
}

/**
 * Render the active weeks line.
 */
export function renderActiveWeeks(activeWeeks, totalWeeks = 12) {
  const pct = totalWeeks > 0 ? Math.round((activeWeeks / totalWeeks) * 100) : 0;
  return labelValue(
    '📅 Active Weeks (12w)',
    `${bold(String(activeWeeks))} / ${totalWeeks}  ${dim(`${pct}%`)}`
  );
}

/**
 * Render the full streak panel.
 * @param {{ current: number, longest: number, activeWeeks: number }} streakReport
 */
export function renderStreakPanel(streakReport) {
  const { current, longest, activeWeeks } = streakReport;
  const lines = [
    sectionHeader('Streak'),
    renderCurrentStreak(current),
    renderLongestStreak(longest),
    renderActiveWeeks(activeWeeks),
    '  ' + renderStreakBar(current, longest),
  ];
  return lines.join('\n');
}
