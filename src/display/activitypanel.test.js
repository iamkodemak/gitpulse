import { describe, it, expect } from 'vitest';
import {
  renderActivityBar,
  renderDowPanel,
  renderPeakHour,
  renderActivityPanel,
} from './activitypanel.js';

const stripAnsi = str => str.replace(/\x1b\[[^m]*m/g, '');

describe('renderActivityBar', () => {
  it('renders a bar with label and count', () => {
    const out = stripAnsi(renderActivityBar('Mon', 5, 10));
    expect(out).toContain('Mon');
    expect(out).toContain('5');
  });

  it('renders empty bar when count is 0', () => {
    const out = stripAnsi(renderActivityBar('Sun', 0, 10));
    expect(out).toContain('0');
    expect(out).not.toContain('█');
  });

  it('renders full bar when count equals max', () => {
    const out = stripAnsi(renderActivityBar('Fri', 10, 10));
    expect(out).toContain('█'.repeat(20));
  });
});

describe('renderDowPanel', () => {
  it('includes all day labels', () => {
    const counts = [1, 2, 3, 4, 5, 6, 7];
    const out = stripAnsi(renderDowPanel(counts));
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(d => {
      expect(out).toContain(d);
    });
  });

  it('includes a section header', () => {
    const out = stripAnsi(renderDowPanel(Array(7).fill(0)));
    expect(out).toContain('Activity by Day');
  });
});

describe('renderPeakHour', () => {
  it('formats AM hours correctly', () => {
    const out = stripAnsi(renderPeakHour(9));
    expect(out).toContain('9:00 AM UTC');
  });

  it('formats PM hours correctly', () => {
    const out = stripAnsi(renderPeakHour(14));
    expect(out).toContain('2:00 PM UTC');
  });

  it('formats midnight as 12:00 AM', () => {
    const out = stripAnsi(renderPeakHour(0));
    expect(out).toContain('12:00 AM UTC');
  });
});

describe('renderActivityPanel', () => {
  it('shows no-activity message when totalEvents is 0', () => {
    const out = stripAnsi(renderActivityPanel({ totalEvents: 0 }));
    expect(out).toContain('No recent activity');
  });

  it('renders panel with valid profile', () => {
    const profile = {
      totalEvents: 10,
      byDayOfWeek: [1, 2, 3, 4, 5, 6, 7],
      peakHour: 15,
      byCategory: { commit: 10 },
    };
    const out = stripAnsi(renderActivityPanel(profile));
    expect(out).toContain('Activity by Day');
    expect(out).toContain('3:00 PM UTC');
  });
});
