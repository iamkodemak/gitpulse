import { describe, it, expect } from 'vitest';
import {
  renderQuietRow,
  renderLongestQuiet,
  renderQuietPeriodPanel,
} from './quietperiodpanel.js';

const gap7 = { start: '2024-01-02', end: '2024-01-08', days: 7 };
const gap20 = { start: '2024-02-01', end: '2024-02-20', days: 20 };

describe('renderQuietRow', () => {
  it('returns a string containing the date range', () => {
    const row = renderQuietRow(gap7, 20);
    expect(row).toContain('2024-01-02');
    expect(row).toContain('2024-01-08');
    expect(row).toContain('7d');
  });

  it('renders a non-empty bar', () => {
    const row = renderQuietRow(gap20, 20);
    expect(row).toContain('▓');
  });

  it('handles maxDays of 0 without crashing', () => {
    expect(() => renderQuietRow(gap7, 0)).not.toThrow();
  });
});

describe('renderLongestQuiet', () => {
  it('shows days when longest is provided', () => {
    const out = renderLongestQuiet(gap20);
    expect(out).toContain('20 days');
    expect(out).toContain('2024-02-01');
  });

  it('shows fallback message when null', () => {
    const out = renderLongestQuiet(null);
    expect(out).toContain('No quiet periods found');
  });
});

describe('renderQuietPeriodPanel', () => {
  it('renders a full panel with gaps', () => {
    const report = {
      longest: gap20,
      recentGaps: [gap7, gap20],
      totalQuietDays: 27,
    };
    const out = renderQuietPeriodPanel(report);
    expect(out).toContain('Quiet Periods');
    expect(out).toContain('27');
    expect(out).toContain('2024-01-02');
    expect(out).toContain('2024-02-01');
  });

  it('renders empty state when no gaps', () => {
    const report = { longest: null, recentGaps: [], totalQuietDays: 0 };
    const out = renderQuietPeriodPanel(report);
    expect(out).toContain('No notable gaps');
    expect(out).toContain('0');
  });

  it('renders single gap without crashing', () => {
    const report = { longest: gap7, recentGaps: [gap7], totalQuietDays: 7 };
    expect(() => renderQuietPeriodPanel(report)).not.toThrow();
  });
});
