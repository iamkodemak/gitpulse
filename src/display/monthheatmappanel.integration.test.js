import { buildMonthHeatmap } from '../github/monthheatmap.js';
import { renderMonthHeatmapPanel } from './monthheatmappanel.js';
import { stripAnsi } from './formatter.js';

function makeMap(entries) {
  return new Map(entries);
}

describe('monthheatmappanel integration', () => {
  test('full pipeline from contribution map to rendered panel', () => {
    const contribMap = makeMap([
      ['2024-02-05', 3],
      ['2024-02-20', 7],
      ['2024-03-10', 15],
      ['2024-03-22', 8],
      ['2024-04-01', 1],
    ]);

    const report = buildMonthHeatmap(contribMap, '2024-04', 3);
    const output = stripAnsi(renderMonthHeatmapPanel(report));

    expect(output).toContain('Monthly Heatmap');
    expect(output).toContain('Feb 24');
    expect(output).toContain('Mar 24');
    expect(output).toContain('Apr 24');
    expect(output).toContain('Busiest:');
    expect(output).toContain('Mar 24');
  });

  test('renders correctly when all months are empty', () => {
    const contribMap = makeMap([]);
    const report = buildMonthHeatmap(contribMap, '2024-04', 3);
    const output = stripAnsi(renderMonthHeatmapPanel(report));
    expect(output).toContain('Monthly Heatmap');
    expect(output).not.toContain('Busiest:');
  });
});
