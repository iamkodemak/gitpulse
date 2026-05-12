const {
  checkContributionMilestones,
  checkStreakMilestones,
  buildMilestoneReport,
  MILESTONE_THRESHOLDS,
  STREAK_MILESTONES,
} = require('./milestones');

describe('checkContributionMilestones', () => {
  test('marks no milestones reached for 0 contributions', () => {
    const result = checkContributionMilestones(0);
    expect(result.every((m) => !m.reached)).toBe(true);
  });

  test('marks first_contribution reached at 1', () => {
    const result = checkContributionMilestones(1);
    const first = result.find((m) => m.key === 'first_contribution');
    expect(first.reached).toBe(true);
  });

  test('marks all milestones reached at 1000+', () => {
    const result = checkContributionMilestones(1000);
    expect(result.every((m) => m.reached)).toBe(true);
  });

  test('progress is capped at 1 when target exceeded', () => {
    const result = checkContributionMilestones(9999);
    expect(result.every((m) => m.progress === 1)).toBe(true);
  });

  test('returns correct progress fraction', () => {
    const result = checkContributionMilestones(50);
    const century = result.find((m) => m.key === 'century');
    expect(century.progress).toBeCloseTo(0.5);
  });

  test('returns all defined milestones', () => {
    const result = checkContributionMilestones(0);
    expect(result.length).toBe(MILESTONE_THRESHOLDS.length);
  });
});

describe('checkStreakMilestones', () => {
  test('returns all streak milestones', () => {
    const result = checkStreakMilestones(0);
    expect(result.length).toBe(STREAK_MILESTONES.length);
  });

  test('marks streak_7 reached at 7 days', () => {
    const result = checkStreakMilestones(7);
    const s7 = result.find((m) => m.key === 'streak_7');
    expect(s7.reached).toBe(true);
  });

  test('does not mark streak_30 at 7 days', () => {
    const result = checkStreakMilestones(7);
    const s30 = result.find((m) => m.key === 'streak_30');
    expect(s30.reached).toBe(false);
  });
});

describe('buildMilestoneReport', () => {
  test('returns contributions and streaks arrays', () => {
    const report = buildMilestoneReport(50, 10);
    expect(Array.isArray(report.contributions)).toBe(true);
    expect(Array.isArray(report.streaks)).toBe(true);
  });

  test('nextContribution points to first unreached milestone', () => {
    const report = buildMilestoneReport(5, 0);
    expect(report.nextContribution.key).toBe('ten_contributions');
  });

  test('nextContribution is null when all reached', () => {
    const report = buildMilestoneReport(9999, 0);
    expect(report.nextContribution).toBeNull();
  });

  test('nextStreak is null when all streak milestones reached', () => {
    const report = buildMilestoneReport(0, 200);
    expect(report.nextStreak).toBeNull();
  });
});
