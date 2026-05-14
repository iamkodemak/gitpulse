import { renderMonthBlock, renderMonthLabel, renderMonthRow, renderMonthHeatmapPanel } from './monthheatmappanel.js';
import { stripAnsi } from './formatter.js';

describe('renderMonthLabel', () => {
  test('formats year-month to short label', () => {
    expect(renderMonthLabel('2024-03')).toBe('Mar 24');
    expect(renderMonthLabel('2023-11')).toBe('Nov 23');
    expect(renderMonthLabel('2024-01')).toBe('Jan 24');
  });
});

describe('renderMonthBlock', () => {
  test('returns dimmed block for level 0', () => {
    const result = renderMonthBlock(0, 0);
    expect(stripAnsi(result)).toBe('██');
  });

  test('returns colored block for positive level', () => {
    const result = renderMonthBlock(3, 10);
    expect(stripAnsi(result)).toBe('██');
  });
});

describe('renderMonthRow', () => {
  test('renders a row with label, block, and count', () => {
    const entry = { month: '2024-03', count: 42, level: 3 };
    const row = renderMonthRow(entry);
    const plain = stripAnsi(row);
    expect(plain).toContain('Mar 24');
    expect(plain).toContain('42');
    expect(plain).toContain('██');
  });

  test('renders zero count row', () => {
    const entry = { month: '2024-02', count: 0, level: 0 };
    const row = renderMonthRow(entry);
    const plain = stripAnsi(row);
    expect(plain).toContain('Feb 24');
    expect(plain).toContain('0');
  });
});

describe('renderMonthHeatmapPanel', () => {
  test('renders panel with entries and busiest month', () => {
    const report = {
      entries: [
        { month: '2024-02', count: 5, level: 1 },
        { month: '2024-03', count: 20, level: 3 },
        { month: '2024-04', count: 2, level: 1 },
      ],
      busiestMonth: '2024-03',
    };
    const output = stripAnsi(renderMonthHeatmapPanel(report));
    expect(output).toContain('Monthly Heatmap');
    expect(output).toContain('Mar 24');
    expect(output).toContain('Busiest:');
  });

  test('renders fallback for empty report', () => {
    const output = stripAnsi(renderMonthHeatmapPanel({ entries: [], busiestMonth: null }));
    expect(output).toContain('No data available');
  });

  test('handles null report', () => {
    const output = stripAnsi(renderMonthHeatmapPanel(null));
    expect(output).toContain('No data available');
  });
});
