const { computeProgress, goalStatus, buildGoalProgress, DEFAULT_GOALS } = require('./goals');

describe('computeProgress', () => {
  it('returns 100 when current meets target', () => {
    expect(computeProgress(20, 20)).toBe(100);
  });

  it('returns 50 for half completion', () => {
    expect(computeProgress(10, 20)).toBe(50);
  });

  it('caps at 100 when exceeding target', () => {
    expect(computeProgress(30, 20)).toBe(100);
  });

  it('returns 100 for zero target', () => {
    expect(computeProgress(0, 0)).toBe(100);
  });
});

describe('goalStatus', () => {
  it('returns achieved at 100%', () => {
    expect(goalStatus(100)).toBe('achieved');
  });

  it('returns on-track at 60%', () => {
    expect(goalStatus(60)).toBe('on-track');
  });

  it('returns behind below 60%', () => {
    expect(goalStatus(59)).toBe('behind');
  });
});

describe('buildGoalProgress', () => {
  const stats = { daily: 2, weekly: 15, monthly: 90 };

  it('returns three entries', () => {
    const result = buildGoalProgress(stats);
    expect(result).toHaveLength(3);
  });

  it('uses default goals when none provided', () => {
    const result = buildGoalProgress(stats);
    expect(result[0].target).toBe(DEFAULT_GOALS.daily);
  });

  it('marks monthly as achieved when over target', () => {
    const result = buildGoalProgress(stats);
    const monthly = result.find(r => r.period === 'Monthly');
    expect(monthly.status).toBe('achieved');
    expect(monthly.pct).toBe(100);
  });

  it('accepts custom goals', () => {
    const result = buildGoalProgress(stats, { daily: 10, weekly: 50, monthly: 200 });
    expect(result[0].pct).toBe(20);
  });
});
