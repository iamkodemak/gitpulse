const { renderWeekBar, renderWeeklyDigestPanel } = require('./weeklydigestpanel');

const ANSI_STRIP = /\x1b\[[0-9;]*m/g;
const strip = (s) => s.replace(ANSI_STRIP, '');

describe('renderWeekBar', () => {
  it('renders a row with week label and count', () => {
    const row = strip(renderWeekBar({ week: '2024-W03', count: 5 }, 10));
    expect(row).toContain('2024-W03');
    expect(row).toContain('5');
  });

  it('renders full bar when count equals max', () => {
    const row = strip(renderWeekBar({ week: '2024-W01', count: 10 }, 10));
    expect(row).toContain('█'.repeat(20));
  });

  it('renders empty bar when count is 0', () => {
    const row = strip(renderWeekBar({ week: '2024-W01', count: 0 }, 10));
    expect(row).toContain('░'.repeat(20));
  });

  it('handles max of 0 without crashing', () => {
    expect(() => renderWeekBar({ week: '2024-W01', count: 0 }, 0)).not.toThrow();
  });
});

describe('renderWeeklyDigestPanel', () => {
  const digest = {
    weeks: [
      { week: '2024-W01', count: 3 },
      { week: '2024-W02', count: 7 },
    ],
    total: 10,
    avg: 5,
    best: { week: '2024-W02', count: 7 },
  };

  it('includes section header', () => {
    const out = strip(renderWeeklyDigestPanel(digest));
    expect(out).toContain('Weekly Digest');
  });

  it('renders all week rows', () => {
    const out = strip(renderWeeklyDigestPanel(digest));
    expect(out).toContain('2024-W01');
    expect(out).toContain('2024-W02');
  });

  it('renders summary stats', () => {
    const out = strip(renderWeeklyDigestPanel(digest));
    expect(out).toContain('10');
    expect(out).toContain('5');
    expect(out).toContain('2024-W02');
  });

  it('shows fallback message when no weeks', () => {
    const out = strip(
      renderWeeklyDigestPanel({ weeks: [], total: 0, avg: 0, best: null })
    );
    expect(out).toContain('No data available');
  });
});
