const { tokenize, buildWordFrequency, topWords, buildWordCloud } = require('./wordcloud');

describe('tokenize', () => {
  it('lowercases and splits on whitespace', () => {
    expect(tokenize('Fix Bug')).toEqual(['fix', 'bug']);
  });

  it('strips punctuation', () => {
    expect(tokenize('feat: add tests!')).toContain('feat');
    expect(tokenize('feat: add tests!')).toContain('tests');
  });

  it('filters words shorter than 3 chars', () => {
    expect(tokenize('do it now')).not.toContain('do');
    expect(tokenize('do it now')).not.toContain('it');
  });
});

describe('buildWordFrequency', () => {
  it('counts word occurrences', () => {
    const freq = buildWordFrequency(['refactor module', 'refactor tests']);
    expect(freq.get('refactor')).toBe(2);
    expect(freq.get('module')).toBe(1);
  });

  it('skips stop words', () => {
    const freq = buildWordFrequency(['fix the bug']);
    expect(freq.has('the')).toBe(false);
    expect(freq.has('fix')).toBe(false); // 'fix' is a stop word
    expect(freq.has('bug')).toBe(true);
  });
});

describe('topWords', () => {
  it('returns top N words sorted by count', () => {
    const freq = new Map([['alpha', 5], ['beta', 3], ['gamma', 8]]);
    const result = topWords(freq, 2);
    expect(result[0]).toEqual({ word: 'gamma', count: 8 });
    expect(result[1]).toEqual({ word: 'alpha', count: 5 });
    expect(result.length).toBe(2);
  });
});

describe('buildWordCloud', () => {
  const events = [
    {
      type: 'PushEvent',
      repo: { name: 'user/myproject' },
      payload: {
        commits: [
          { message: 'refactor authentication module' },
          { message: 'refactor authentication tests' }
        ]
      }
    },
    {
      type: 'CreateEvent',
      repo: { name: 'user/dashboard' },
      payload: {}
    }
  ];

  it('returns words array and total', () => {
    const result = buildWordCloud(events, 10);
    expect(result).toHaveProperty('words');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.words)).toBe(true);
  });

  it('counts commit message words', () => {
    const result = buildWordCloud(events, 10);
    const refactor = result.words.find(w => w.word === 'refactor');
    expect(refactor).toBeDefined();
    expect(refactor.count).toBe(2);
  });

  it('includes repo name tokens', () => {
    const result = buildWordCloud(events, 10);
    const words = result.words.map(w => w.word);
    expect(words).toContain('dashboard');
  });
});
