import { formatDate, renderSpan, renderFirstLastPanel } from './firstlastpanel.js';
import { stripAnsi } from './formatter.js';

describe('formatDate', () => {
  it('formats a valid ISO date', () => {
    expect(stripAnsi(formatDate('2024-03-15'))).toBe('Mar 15, 2024');
  });

  it('returns a dash for null', () => {
    expect(stripAnsi(formatDate(null))).toBe('—');
  });
});

describe('renderSpan', () => {
  it('returns no-data for zero span', () => {
    expect(stripAnsi(renderSpan(0))).toBe('no data');
  });

  it('renders days only for small spans', () => {
    expect(stripAnsi(renderSpan(5))).toBe('5d');
  });

  it('renders months and days', () => {
    expect(stripAnsi(renderSpan(45))).toBe('1mo 15d');
  });

  it('renders years, months, and days', () => {
    expect(stripAnsi(renderSpan(400))).toBe('1y 1mo 5d');
  });

  it('renders years and months without days when remainder is zero', () => {
    const span = 365 + 30; // 395 days => 1y 1mo 0d
    const text = stripAnsi(renderSpan(span));
    expect(text).toContain('1y');
    expect(text).toContain('1mo');
  });
});

describe('renderFirstLastPanel', () => {
  const report = { first: '2023-01-01', last: '2024-06-15', spanDays: 532 };

  it('includes section header', () => {
    const out = stripAnsi(renderFirstLastPanel(report));
    expect(out).toContain('Contribution Window');
  });

  it('includes first contribution date', () => {
    const out = stripAnsi(renderFirstLastPanel(report));
    expect(out).toContain('Jan 1, 2023');
  });

  it('includes latest contribution date', () => {
    const out = stripAnsi(renderFirstLastPanel(report));
    expect(out).toContain('Jun 15, 2024');
  });

  it('includes active span', () => {
    const out = stripAnsi(renderFirstLastPanel(report));
    expect(out).toContain('1y');
  });

  it('handles null dates gracefully', () => {
    const out = stripAnsi(renderFirstLastPanel({ first: null, last: null, spanDays: 0 }));
    expect(out).toContain('—');
    expect(out).toContain('no data');
  });
});
