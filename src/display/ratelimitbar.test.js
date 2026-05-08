import { rateLimitColor, renderUsageBar, renderRateLimitBar } from './ratelimitbar.js';

describe('rateLimitColor', () => {
  it('returns green color when usage is low', () => {
    const color = rateLimitColor(10, 60);
    expect(color).toBeDefined();
  });

  it('returns yellow color when usage is moderate', () => {
    const color = rateLimitColor(40, 60);
    expect(color).toBeDefined();
  });

  it('returns red color when usage is high', () => {
    const color = rateLimitColor(55, 60);
    expect(color).toBeDefined();
  });

  it('handles zero limit gracefully', () => {
    const color = rateLimitColor(0, 0);
    expect(color).toBeDefined();
  });
});

describe('renderUsageBar', () => {
  it('renders a bar with correct filled length', () => {
    const bar = renderUsageBar(30, 60, 10);
    expect(typeof bar).toBe('string');
    expect(bar.length).toBeGreaterThan(0);
  });

  it('renders full bar when all used', () => {
    const bar = renderUsageBar(60, 60, 10);
    expect(typeof bar).toBe('string');
  });

  it('renders empty bar when none used', () => {
    const bar = renderUsageBar(0, 60, 10);
    expect(typeof bar).toBe('string');
  });
});

describe('renderRateLimitBar', () => {
  it('renders rate limit bar with all fields', () => {
    const info = { used: 20, limit: 60, remaining: 40, resetAt: new Date(Date.now() + 60000) };
    const output = renderRateLimitBar(info);
    expect(typeof output).toBe('string');
    expect(output.length).toBeGreaterThan(0);
  });

  it('includes remaining count in output', () => {
    const info = { used: 10, limit: 60, remaining: 50, resetAt: new Date(Date.now() + 30000) };
    const output = renderRateLimitBar(info);
    expect(output).toContain('50');
  });

  it('handles fully exhausted rate limit', () => {
    const info = { used: 60, limit: 60, remaining: 0, resetAt: new Date(Date.now() + 120000) };
    const output = renderRateLimitBar(info);
    expect(output).toContain('0');
  });
});
