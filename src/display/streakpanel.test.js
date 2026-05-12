import {
  renderStreakBar,
  renderCurrentStreak,
  renderLongestStreak,
  renderActiveWeeks,
  renderStreakPanel,
} from './streakpanel.js';
import { stripAnsi } from './formatter.js';

describe('renderStreakBar', () => {
  it('returns dashes when longest is 0', () => {
    const result = stripAnsi(renderStreakBar(0, 0, 10));
    expect(result).toMatch(/─+/);
  });

  it('fills proportionally', () => {
    const result = stripAnsi(renderStreakBar(10, 20, 20));
    const filled = (result.match(/█/g) || []).length;
    expect(filled).toBe(10);
  });

  it('fills fully when current equals longest', () => {
    const result = stripAnsi(renderStreakBar(5, 5, 20));
    const filled = (result.match(/█/g) || []).length;
    expect(filled).toBe(20);
  });
});

describe('renderCurrentStreak', () => {
  it('shows singular day for streak of 1', () => {
    const result = stripAnsi(renderCurrentStreak(1));
    expect(result).toContain('1 day');
    expect(result).not.toContain('days');
  });

  it('shows plural days for streak > 1', () => {
    const result = stripAnsi(renderCurrentStreak(7));
    expect(result).toContain('7 days');
  });

  it('shows snowflake for zero streak', () => {
    const result = renderCurrentStreak(0);
    expect(result).toContain('❄️');
  });
});

describe('renderLongestStreak', () => {
  it('includes longest value', () => {
    const result = stripAnsi(renderLongestStreak(42));
    expect(result).toContain('42 days');
  });

  it('uses singular for 1', () => {
    const result = stripAnsi(renderLongestStreak(1));
    expect(result).toContain('1 day');
  });
});

describe('renderActiveWeeks', () => {
  it('shows active weeks out of total', () => {
    const result = stripAnsi(renderActiveWeeks(8, 12));
    expect(result).toContain('8');
    expect(result).toContain('12');
  });

  it('shows 0% when no active weeks', () => {
    const result = stripAnsi(renderActiveWeeks(0, 12));
    expect(result).toContain('0%');
  });
});

describe('renderStreakPanel', () => {
  it('returns a multi-line string', () => {
    const report = { current: 5, longest: 14, activeWeeks: 9 };
    const result = renderStreakPanel(report);
    expect(result.split('\n').length).toBeGreaterThan(3);
  });

  it('contains streak section header', () => {
    const report = { current: 0, longest: 0, activeWeeks: 0 };
    const result = stripAnsi(renderStreakPanel(report));
    expect(result.toLowerCase()).toContain('streak');
  });
});
