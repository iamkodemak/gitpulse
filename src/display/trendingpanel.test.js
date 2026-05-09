const { renderSpikeRow, renderTrendingRepoRow, renderTrendingPanel } = require('./trendingpanel');
const { detectSpikes, topReposByKey } = require('../github/trending');

describe('detectSpikes', () => {
  test('returns empty array for empty map', () => {
    expect(detectSpikes({})).toEqual([]);
  });

  test('returns empty array when all counts are zero', () => {
    expect(detectSpikes({ '2024-01-01': 0, '2024-01-02': 0 })).toEqual([]);
  });

  test('detects days above multiplier threshold', () => {
    const map = {
      '2024-01-01': 1,
      '2024-01-02': 1,
      '2024-01-03': 1,
      '2024-01-04': 10, // spike
    };
    const spikes = detectSpikes(map, 2.0);
    expect(spikes.length).toBe(1);
    expect(spikes[0].date).toBe('2024-01-04');
    expect(spikes[0].count).toBe(10);
    expect(spikes[0].ratio).toBeGreaterThan(2);
  });

  test('sorts spikes by count descending', () => {
    const map = { '2024-01-01': 1, '2024-01-02': 20, '2024-01-03': 15 };
    const spikes = detectSpikes(map, 1.5);
    expect(spikes[0].count).toBeGreaterThanOrEqual(spikes[1]?.count ?? 0);
  });
});

describe('topReposByKey', () => {
  const repos = [
    { name: 'a', stargazers_count: 5 },
    { name: 'b', stargazers_count: 50 },
    { name: 'c', stargazers_count: 20 },
  ];

  test('returns top N repos sorted by key', () => {
    const top = topReposByKey(repos, 'stargazers_count', 2);
    expect(top[0].name).toBe('b');
    expect(top[1].name).toBe('c');
    expect(top.length).toBe(2);
  });

  test('returns empty array for non-array input', () => {
    expect(topReposByKey(null)).toEqual([]);
  });
});

describe('renderSpikeRow', () => {
  test('returns a non-empty string', () => {
    const row = renderSpikeRow({ date: '2024-03-15', count: 12, ratio: 3.2 });
    expect(typeof row).toBe('string');
    expect(row.length).toBeGreaterThan(0);
  });
});

describe('renderTrendingRepoRow', () => {
  test('includes repo name', () => {
    const row = renderTrendingRepoRow({ name: 'gitpulse', stargazers_count: 42, language: 'JavaScript' });
    expect(row).toContain('gitpulse');
  });
});

describe('renderTrendingPanel', () => {
  test('shows no spikes message when empty', () => {
    const out = renderTrendingPanel([], []);
    expect(out).toContain('No notable spikes');
  });

  test('renders spike rows when provided', () => {
    const spikes = [{ date: '2024-04-01', count: 20, ratio: 4.0 }];
    const out = renderTrendingPanel(spikes, []);
    expect(out).toContain('2024-04-01');
  });

  test('renders repo rows when provided', () => {
    const repos = [{ name: 'cool-repo', stargazers_count: 99, language: 'TypeScript' }];
    const out = renderTrendingPanel([], repos);
    expect(out).toContain('cool-repo');
  });
});
