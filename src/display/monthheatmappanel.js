import { fg256, bold, dim } from './colors.js';
import { sectionHeader, padEnd } from './formatter.js';

const LEVEL_COLORS = [238, 22, 28, 34, 40];
const BLOCK = '██';

export function renderMonthBlock(level, count) {
  const color = LEVEL_COLORS[level] ?? LEVEL_COLORS[0];
  const block = fg256(color, BLOCK);
  return count > 0 ? block : dim(BLOCK);
}

export function renderMonthLabel(yearMonth) {
  const [year, month] = yearMonth.split('-');
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const name = names[parseInt(month, 10) - 1] ?? month;
  return `${name} ${year.slice(2)}`;
}

export function renderMonthRow(entry) {
  const { month, count, level } = entry;
  const label = padEnd(renderMonthLabel(month), 7);
  const block = renderMonthBlock(level, count);
  const countStr = count > 0 ? fg256(252, ` ${count}`) : dim(' 0');
  return `  ${label} ${block}${countStr}`;
}

export function renderMonthHeatmapPanel(report) {
  if (!report || !report.entries || report.entries.length === 0) {
    return sectionHeader('Monthly Heatmap') + '\n' + dim('  No data available.') + '\n';
  }

  const lines = [sectionHeader('Monthly Heatmap')];

  for (const entry of report.entries) {
    lines.push(renderMonthRow(entry));
  }

  if (report.busiestMonth) {
    lines.push('');
    lines.push(`  ${dim('Busiest:')} ${bold(renderMonthLabel(report.busiestMonth))}`);
  }

  lines.push('');
  return lines.join('\n');
}
