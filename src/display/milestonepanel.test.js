const {
  renderMilestoneRow,
  renderNextMilestone,
  renderMilestonePanel,
} = require('./milestonepanel');

const { stripAnsi } = require('./formatter');

const reachedMilestone = { label: 'First Contribution', reached: true, progress: 1, target: 1 };
const pendingMilestone = { label: 'Century Club (100)', reached: false, progress: 0.5, target: 100 };

describe('renderMilestoneRow', () => {
  test('renders label for reached milestone', () => {
    const row = stripAnsi(renderMilestoneRow(reachedMilestone));
    expect(row).toContain('First Contribution');
  });

  test('shows 100% for reached milestone', () => {
    const row = stripAnsi(renderMilestoneRow(reachedMilestone));
    expect(row).toContain('100%');
  });

  test('shows partial percentage for pending milestone', () => {
    const row = stripAnsi(renderMilestoneRow(pendingMilestone));
    expect(row).toContain('50%');
  });

  test('shows target value in output', () => {
    const row = stripAnsi(renderMilestoneRow(pendingMilestone));
    expect(row).toContain('100');
  });

  test('renders a bar with correct total width', () => {
    const row = stripAnsi(renderMilestoneRow(reachedMilestone, 10));
    const barMatch = row.match(/\[([█░]+)\]/);
    expect(barMatch).not.toBeNull();
    expect(barMatch[1].length).toBe(10);
  });

  test('returns a string ending with newline', () => {
    const row = renderMilestoneRow(reachedMilestone);
    expect(row.endsWith('\n')).toBe(true);
  });
});

describe('renderNextMilestone', () => {
  test('shows all reached message when null', () => {
    const out = stripAnsi(renderNextMilestone(null));
    expect(out).toContain('All milestones reached');
  });

  test('shows next milestone label', () => {
    const next = { label: 'Century Club (100)', target: 100, progress: 0.5 };
    const out = stripAnsi(renderNextMilestone(next));
    expect(out).toContain('Century Club (100)');
  });

  test('shows remaining count', () => {
    const next = { label: 'Century Club (100)', target: 100, progress: 0.5 };
    const out = stripAnsi(renderNextMilestone(next));
    expect(out).toContain('50');
  });
});

describe('renderMilestonePanel', () => {
  const report = {
    contributions: [reachedMilestone, pendingMilestone],
    streaks: [
      { key: 'streak_7', label: '7-Day Streak', target: 7, reached: true, progress: 1 },
    ],
    nextContribution: pendingMilestone,
    nextStreak: null,
  };

  test('includes Milestones header', () => {
    const out = stripAnsi(renderMilestonePanel(report));
    expect(out).toContain('Milestones');
  });

  test('includes Contributions section label', () => {
    const out = stripAnsi(renderMilestonePanel(report));
    expect(out).toContain('Contributions');
  });

  test('includes Streaks section label', () => {
    const out = stripAnsi(renderMilestonePanel(report));
    expect(out).toContain('Streaks');
  });

  test('shows all reached for streaks when nextStreak is null', () => {
    const out = stripAnsi(renderMilestonePanel(report));
    expect(out).toContain('All milestones reached');
  });

  test('returns a non-empty string', () => {
    const out = renderMilestonePanel(report);
    expect(typeof out).toBe('string');
    expect(out.length).toBeGreaterThan(0);
  });
});
