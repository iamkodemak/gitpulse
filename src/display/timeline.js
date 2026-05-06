import { fg256, bold, dim } from './colors.js';
import { padEnd, stripAnsi } from './formatter.js';

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Get the last N months as { label, year, month } objects
 */
export function getRecentMonths(n = 6) {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: MONTH_LABELS[d.getMonth()],
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return months;
}

/**
 * Aggregate contribution counts per month from a contributionMap ({ dateStr: count })
 */
export function aggregateByMonth(contributionMap, months) {
  return months.map(({ label, year, month }) => {
    const total = Object.entries(contributionMap).reduce((sum, [date, count]) => {
      const d = new Date(date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        return sum + count;
      }
      return sum;
    }, 0);
    return { label, year, month, total };
  });
}

/**
 * Render a vertical bar for a month given its value and max
 */
export function renderMonthBar(total, max, barHeight = 5) {
  const filled = max > 0 ? Math.round((total / max) * barHeight) : 0;
  const color = total > 0 ? fg256(75) : fg256(238);
  const bar = Array.from({ length: barHeight }, (_, i) => {
    const row = barHeight - 1 - i;
    return row < filled ? color('█') : dim('░');
  });
  return bar;
}

/**
 * Render the full monthly timeline as a multi-line string
 */
export function renderTimeline(contributionMap, monthCount = 6, barHeight = 5) {
  const months = getRecentMonths(monthCount);
  const aggregated = aggregateByMonth(contributionMap, months);
  const max = Math.max(...aggregated.map(m => m.total), 1);

  const bars = aggregated.map(({ total }) => renderMonthBar(total, max, barHeight));

  const lines = [];
  lines.push(bold('  Monthly Activity'));
  lines.push('');

  for (let row = 0; row < barHeight; row++) {
    const line = bars.map(bar => ` ${bar[row]} `).join('');
    lines.push(line);
  }

  const labelRow = aggregated.map(({ label, total }) => {
    const col = ` ${padEnd(label, 3)} `;
    return total > 0 ? fg256(250)(col) : dim(col);
  }).join('');
  lines.push(labelRow);

  const countRow = aggregated.map(({ total }) => {
    const s = padEnd(String(total), 3);
    return total > 0 ? ` ${fg256(75)(s)} ` : ` ${dim(s)} `;
  }).join('');
  lines.push(countRow);
  lines.push('');

  return lines.join('\n');
}
