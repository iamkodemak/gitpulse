import { describe, it, expect } from 'vitest';
import { buildQuietPeriodReport } from '../github/quietperiod.js';
import { renderQuietPeriodPanel } from './quietperiodpanel.js';

function makeMap(entries) {
  return new Map(entries);
}

describe('quietperiod integration', () => {
  it('renders a panel from a real contribution map', () => {
    const map = makeMap([
      ['2024-01-01', 3],
      ['2024-01-02', 1],
      ['2024-01-15', 2],
      ['2024-02-01', 5],
      ['2024-02-02', 1],
      ['2024-03-01', 4],
    ]);
    const report = buildQuietPeriodReport(map);
    const panel = renderQuietPeriodPanel(report);
    expect(typeof panel).toBe('string');
    expect(panel.length).toBeGreaterThan(0);
    expect(panel).toContain('Quiet Periods');
    // longest gap is Jan 15 -> Feb 01 = 16 days
    expect(report.longest.days).toBe(16);
    expect(panel).toContain('16 days');
  });

  it('handles a map with no gaps gracefully', () => {
    const map = makeMap([['2024-06-01', 1]]);
    const report = buildQuietPeriodReport(map);
    const panel = renderQuietPeriodPanel(report);
    expect(panel).toContain('No quiet periods found');
  });

  it('handles an empty map', () => {
    const report = buildQuietPeriodReport(new Map());
    const panel = renderQuietPeriodPanel(report);
    expect(panel).toContain('No quiet periods found');
    expect(report.totalQuietDays).toBe(0);
  });
});
