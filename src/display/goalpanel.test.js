const { renderGoalBar, renderGoalPanel } = require('./goalpanel');

const mockGoals = [
  { period: 'Daily',   current: 3,  target: 3,   pct: 100, status: 'achieved' },
  { period: 'Weekly',  current: 14, target: 20,  pct: 70,  status: 'on-track' },
  { period: 'Monthly', current: 10, target: 80,  pct: 13,  status: 'behind'   }
];

describe('renderGoalBar', () => {
  it('returns a non-empty string', () => {
    const result = renderGoalBar(mockGoals[0]);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('includes the period label', () => {
    const result = renderGoalBar(mockGoals[0]);
    expect(result).toContain('Daily');
  });

  it('includes current and target counts', () => {
    const result = renderGoalBar(mockGoals[1]);
    expect(result).toContain('14/20');
  });

  it('includes percentage', () => {
    const result = renderGoalBar(mockGoals[2]);
    expect(result).toContain('13%');
  });
});

describe('renderGoalPanel', () => {
  it('returns empty string for empty array', () => {
    expect(renderGoalPanel([])).toBe('');
  });

  it('returns empty string for null input', () => {
    expect(renderGoalPanel(null)).toBe('');
  });

  it('includes all three periods', () => {
    const result = renderGoalPanel(mockGoals);
    expect(result).toContain('Daily');
    expect(result).toContain('Weekly');
    expect(result).toContain('Monthly');
  });

  it('includes a section header', () => {
    const result = renderGoalPanel(mockGoals);
    expect(result).toContain('Contribution Goals');
  });

  it('renders one bar per goal', () => {
    const result = renderGoalPanel(mockGoals);
    const barCount = (result.match(/\[/g) || []).length;
    expect(barCount).toBe(mockGoals.length);
  });
});
