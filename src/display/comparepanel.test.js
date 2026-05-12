import { renderDelta, renderPercent, renderCompareRow, renderComparePanel } from './comparepanel.js';
import { stripAnsi } from './formatter.js';

describe('renderDelta', () => {
  it('shows + for positive delta', () => {
    expect(stripAnsi(renderDelta(5))).toContain('+5');
  });

  it('shows - for negative delta', () => {
    expect(stripAnsi(renderDelta(-3))).toContain('-3');
  });

  it('shows 0 with neutral style', () => {
    expect(stripAnsi(renderDelta(0))).toContain('0');
  });
});

describe('renderPercent', () => {
  it('shows percentage string', () => {
    expect(stripAnsi(renderPercent(50))).toContain('50%');
  });

  it('handles negative percent', () => {
    expect(stripAnsi(renderPercent(-25))).toContain('-25%');
  });
});

describe('renderCompareRow', () => {
  it('contains the label', () => {
    const row = stripAnsi(renderCompareRow('Commits', 10, 8));
    expect(row).toContain('Commits');
  });

  it('contains both period values', () => {
    const row = stripAnsi(renderCompareRow('PRs', 4, 7));
    expect(row).toContain('4');
    expect(row).toContain('7');
  });
});

describe('renderComparePanel', () => {
  const report = {
    current: { contributions: 42, activeDays: 18 },
    previous: { contributions: 35, activeDays: 15 },
  };

  it('includes section header', () => {
    const panel = stripAnsi(renderComparePanel(report));
    expect(panel).toContain('Period Comparison');
  });

  it('shows contributions row', () => {
    const panel = stripAnsi(renderComparePanel(report));
    expect(panel).toContain('Contributions');
  });

  it('shows active days row', () => {
    const panel = stripAnsi(renderComparePanel(report));
    expect(panel).toContain('Active Days');
  });

  it('returns a string', () => {
    expect(typeof renderComparePanel(report)).toBe('string');
  });
});
