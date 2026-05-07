const {
  parseRateLimitHeaders,
  secondsUntilReset,
  formatRateLimit,
  isRateLimitLow,
} = require('./ratelimit');

describe('parseRateLimitHeaders', () => {
  it('parses all rate limit headers correctly', () => {
    const headers = {
      'x-ratelimit-limit': '60',
      'x-ratelimit-remaining': '42',
      'x-ratelimit-reset': '1700000000',
      'x-ratelimit-used': '18',
    };
    const result = parseRateLimitHeaders(headers);
    expect(result).toEqual({ limit: 60, remaining: 42, reset: 1700000000, used: 18 });
  });

  it('falls back to defaults when headers are missing', () => {
    const result = parseRateLimitHeaders({});
    expect(result.limit).toBe(60);
    expect(result.remaining).toBe(60);
    expect(result.reset).toBe(0);
    expect(result.used).toBe(0);
  });
});

describe('secondsUntilReset', () => {
  it('returns 0 for a timestamp in the past', () => {
    expect(secondsUntilReset(0)).toBe(0);
    expect(secondsUntilReset(1)).toBe(0);
  });

  it('returns positive seconds for a future timestamp', () => {
    const future = Math.floor(Date.now() / 1000) + 300;
    const secs = secondsUntilReset(future);
    expect(secs).toBeGreaterThan(0);
    expect(secs).toBeLessThanOrEqual(300);
  });
});

describe('formatRateLimit', () => {
  it('includes limit, remaining, and used in output', () => {
    const info = { limit: 60, remaining: 20, reset: 0, used: 40 };
    const str = formatRateLimit(info);
    expect(str).toContain('20/60');
    expect(str).toContain('40 used');
  });

  it('shows reset-unknown when reset is 0', () => {
    const info = { limit: 60, remaining: 10, reset: 0, used: 50 };
    expect(formatRateLimit(info)).toContain('reset unknown');
  });

  it('shows minutes until reset for future timestamp', () => {
    const future = Math.floor(Date.now() / 1000) + 120;
    const info = { limit: 60, remaining: 10, reset: future, used: 50 };
    expect(formatRateLimit(info)).toMatch(/resets in \d+m/);
  });
});

describe('isRateLimitLow', () => {
  it('returns true when remaining is at or below threshold', () => {
    expect(isRateLimitLow({ remaining: 5 })).toBe(true);
    expect(isRateLimitLow({ remaining: 0 })).toBe(true);
  });

  it('returns false when remaining is above threshold', () => {
    expect(isRateLimitLow({ remaining: 6 })).toBe(false);
    expect(isRateLimitLow({ remaining: 30 })).toBe(false);
  });

  it('respects a custom threshold', () => {
    expect(isRateLimitLow({ remaining: 10 }, 10)).toBe(true);
    expect(isRateLimitLow({ remaining: 11 }, 10)).toBe(false);
  });
});
