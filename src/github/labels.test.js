const {
  activityLabel,
  streakLabel,
  consistencyLabel,
  buildLabelProfile,
} = require('./labels');

describe('activityLabel', () => {
  test('returns Quiet for 0', () => {
    expect(activityLabel(0)).toBe('Quiet');
  });
  test('returns Light for 1-2', () => {
    expect(activityLabel(1)).toBe('Light');
    expect(activityLabel(2)).toBe('Light');
  });
  test('returns Moderate for 3-6', () => {
    expect(activityLabel(3)).toBe('Moderate');
    expect(activityLabel(6)).toBe('Moderate');
  });
  test('returns Active for 7-14', () => {
    expect(activityLabel(7)).toBe('Active');
    expect(activityLabel(14)).toBe('Active');
  });
  test('returns Prolific for 15+', () => {
    expect(activityLabel(15)).toBe('Prolific');
    expect(activityLabel(100)).toBe('Prolific');
  });
});

describe('streakLabel', () => {
  test('returns No streak for 0', () => {
    expect(streakLabel(0)).toBe('No streak');
  });
  test('returns Getting started for 1-6', () => {
    expect(streakLabel(1)).toBe('Getting started');
    expect(streakLabel(6)).toBe('Getting started');
  });
  test('returns On a roll for 7-29', () => {
    expect(streakLabel(7)).toBe('On a roll');
    expect(streakLabel(29)).toBe('On a roll');
  });
  test('returns Consistent for 30-89', () => {
    expect(streakLabel(30)).toBe('Consistent');
    expect(streakLabel(89)).toBe('Consistent');
  });
  test('returns Legendary for 90+', () => {
    expect(streakLabel(90)).toBe('Legendary');
  });
});

describe('consistencyLabel', () => {
  test('returns Sporadic for < 1', () => {
    expect(consistencyLabel(0)).toBe('Sporadic');
    expect(consistencyLabel(0.5)).toBe('Sporadic');
  });
  test('returns Occasional for 1-2', () => {
    expect(consistencyLabel(1)).toBe('Occasional');
    expect(consistencyLabel(2.9)).toBe('Occasional');
  });
  test('returns Regular for 3-4', () => {
    expect(consistencyLabel(3)).toBe('Regular');
    expect(consistencyLabel(4.9)).toBe('Regular');
  });
  test('returns Daily driver for 5+', () => {
    expect(consistencyLabel(5)).toBe('Daily driver');
    expect(consistencyLabel(7)).toBe('Daily driver');
  });
});

describe('buildLabelProfile', () => {
  test('returns correct profile object', () => {
    const profile = buildLabelProfile({
      totalContributions: 10,
      currentStreak: 15,
      activeDaysPerWeek: 4,
    });
    expect(profile).toEqual({
      activity: 'Active',
      streak: 'On a roll',
      consistency: 'Regular',
    });
  });

  test('handles zero values', () => {
    const profile = buildLabelProfile({
      totalContributions: 0,
      currentStreak: 0,
      activeDaysPerWeek: 0,
    });
    expect(profile.activity).toBe('Quiet');
    expect(profile.streak).toBe('No streak');
    expect(profile.consistency).toBe('Sporadic');
  });
});
