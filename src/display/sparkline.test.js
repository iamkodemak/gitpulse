import { describe, it, expect } from 'vitest';
import {
  normalizeToLevels,
  levelToColor,
  renderSparkline,
  renderSparklineRow,
} from './sparkline.js';

describe('normalizeToLevels', () => {
  it('returns all zeros when all values are zero', () => {
    expect(normalizeToLevels([0, 0, 0])).toEqual([0, 0, 0]);
  });

  it('maps max value to level 7', () => {
    const levels = normalizeToLevels([0, 5, 10]);
    expect(levels[2]).toBe(7);
  });

  it('returns correct relative levels', () => {
    const levels = normalizeToLevels([0, 4, 8]);
    expect(levels[0]).toBe(0);
    expect(levels[1]).toBeLessThan(levels[2]);
  });
});

describe('levelToColor', () => {
  it('returns dim color for level 0', () => {
    expect(levelToColor(0)).toBe(238);
  });

  it('returns bright color for level 7', () => {
    expect(levelToColor(7)).toBe(226);
  });

  it('returns green shades for mid levels', () => {
    expect([34, 40, 46]).toContain(levelToColor(3));
  });
});

describe('renderSparkline', () => {
  it('returns a string of correct length when colored is false', () => {
    const result = renderSparkline([1, 2, 3, 4], { colored: false });
    expect(result).toHaveLength(4);
  });

  it('pads with zeros when width exceeds values length', () => {
    const result = renderSparkline([5], { colored: false, width: 4 });
    expect(result).toHaveLength(4);
  });

  it('trims to width when values exceed width', () => {
    const result = renderSparkline([1, 2, 3, 4, 5, 6], { colored: false, width: 3 });
    expect(result).toHaveLength(3);
  });

  it('returns spark chars from SPARK_CHARS set', () => {
    const result = renderSparkline([0, 10], { colored: false });
    expect(result).toMatch(/^[▁▂▃▄▅▆▇█]+$/);
  });
});

describe('renderSparklineRow', () => {
  it('includes the label in the output', () => {
    const result = renderSparklineRow('commits', [1, 2, 3], { colored: false });
    expect(result).toContain('commits');
  });

  it('includes the total count', () => {
    const result = renderSparklineRow('commits', [3, 4, 5], { colored: false });
    expect(result).toContain('12');
  });
});
