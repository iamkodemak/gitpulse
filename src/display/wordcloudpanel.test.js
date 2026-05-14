const { wordColor, renderWordToken, renderWordRows, renderWordCloudPanel } = require('./wordcloudpanel');
const { stripAnsi } = require('./formatter');

describe('wordColor', () => {
  it('returns a string (ANSI escape)', () => {
    const result = wordColor(0, 10);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('does not throw for edge indices', () => {
    expect(() => wordColor(0, 1)).not.toThrow();
    expect(() => wordColor(9, 10)).not.toThrow();
  });
});

describe('renderWordToken', () => {
  it('includes the word and count', () => {
    const token = renderWordToken('refactor', 5, '');
    const plain = stripAnsi(token);
    expect(plain).toContain('refactor');
    expect(plain).toContain('5');
  });
});

describe('renderWordRows', () => {
  const words = [
    { word: 'refactor', count: 5 },
    { word: 'authentication', count: 3 },
    { word: 'module', count: 2 },
    { word: 'dashboard', count: 1 }
  ];

  it('returns an array of strings', () => {
    const rows = renderWordRows(words, 40);
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('wraps long lines', () => {
    const manyWords = Array.from({ length: 20 }, (_, i) => ({ word: `word${i}`, count: i + 1 }));
    const rows = renderWordRows(manyWords, 30);
    expect(rows.length).toBeGreaterThan(1);
  });

  it('each row contains visible text', () => {
    const rows = renderWordRows(words, 60);
    for (const row of rows) {
      expect(stripAnsi(row).trim().length).toBeGreaterThan(0);
    }
  });
});

describe('renderWordCloudPanel', () => {
  const data = {
    words: [
      { word: 'refactor', count: 4 },
      { word: 'tests', count: 2 }
    ],
    total: 6
  };

  it('renders a string', () => {
    const output = renderWordCloudPanel(data, 60);
    expect(typeof output).toBe('string');
  });

  it('includes section header', () => {
    const output = stripAnsi(renderWordCloudPanel(data, 60));
    expect(output).toContain('Commit Word Cloud');
  });

  it('shows word count info', () => {
    const output = stripAnsi(renderWordCloudPanel(data, 60));
    expect(output).toContain('6');
  });

  it('handles empty word list gracefully', () => {
    const output = stripAnsi(renderWordCloudPanel({ words: [], total: 0 }, 60));
    expect(output).toContain('No commit messages found');
  });
});
