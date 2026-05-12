import { renderBlock, renderDayLabels, renderHeatmapGrid, renderHeatmapPanel } from './heatmappanel.js';
import { stripAnsi } from './formatter.js';

describe('renderBlock', () => {
  it('returns a string containing the block character', () => {
    for (let level = 0; level <= 4; level++) {
      expect(stripAnsi(renderBlock(level))).toBe('■');
    }
  });

  it('uses fallback for out-of-range level', () => {
    expect(stripAnsi(renderBlock(99))).toBe('■');
  });
});

describe('renderDayLabels', () => {
  it('contains all day initials', () => {
    const raw = stripAnsi(renderDayLabels());
    ['S', 'M', 'T', 'W', 'F'].forEach(l => expect(raw).toContain(l));
  });
});

describe('renderHeatmapGrid', () => {
  it('returns a multi-line string with 7 rows', () => {
    const grid = renderHeatmapGrid({}, 28);
    const lines = grid.split('\n');
    expect(lines).toHaveLength(7);
  });

  it('includes day labels in each row', () => {
    const grid = stripAnsi(renderHeatmapGrid({}, 14));
    const lines = grid.split('\n');
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    lines.forEach((line, i) => {
      expect(line.startsWith(labels[i])).toBe(true);
    });
  });

  it('reflects contribution counts via block characters', () => {
    const today = new Date().toISOString().slice(0, 10);
    const map = { [today]: 15 };
    const grid = renderHeatmapGrid(map, 7);
    expect(stripAnsi(grid)).toContain('■');
  });
});

describe('renderHeatmapPanel', () => {
  it('includes section header', () => {
    const panel = stripAnsi(renderHeatmapPanel({}, 28));
    expect(panel).toContain('Contribution Heatmap');
  });

  it('shows peak day when contributions exist', () => {
    const today = new Date().toISOString().slice(0, 10);
    const map = { [today]: 5 };
    const panel = stripAnsi(renderHeatmapPanel(map, 7));
    expect(panel).toContain('Peak day:');
    expect(panel).toContain(today);
  });

  it('omits peak day line when map is empty', () => {
    const panel = stripAnsi(renderHeatmapPanel({}, 7));
    expect(panel).not.toContain('Peak day:');
  });

  it('returns a non-empty string', () => {
    const panel = renderHeatmapPanel({}, 14);
    expect(typeof panel).toBe('string');
    expect(panel.length).toBeGreaterThan(0);
  });
});
