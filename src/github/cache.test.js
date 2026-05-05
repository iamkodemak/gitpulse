import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readCache, writeCache, clearCache } from './cache.js';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';

vi.mock('fs');
vi.mock('os', () => ({ homedir: () => '/mock/home' }));
vi.mock('crypto', () => ({
  createHash: () => ({ update: () => ({ digest: () => 'abc123' }) })
}));

describe('cache', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    existsSync.mockReturnValue(true);
  });

  describe('readCache', () => {
    it('returns null when cache file does not exist', () => {
      existsSync.mockReturnValue(false);
      const result = readCache('torvalds', 'events');
      expect(result).toBeNull();
    });

    it('returns null when cache is expired', () => {
      const expired = { data: [], timestamp: Date.now() - 999999, ttl: 300000 };
      readFileSync.mockReturnValue(JSON.stringify(expired));
      const result = readCache('torvalds', 'events');
      expect(result).toBeNull();
    });

    it('returns data when cache is valid', () => {
      const fresh = { data: [{ id: 1 }], timestamp: Date.now(), ttl: 300000 };
      readFileSync.mockReturnValue(JSON.stringify(fresh));
      const result = readCache('torvalds', 'events');
      expect(result).toEqual([{ id: 1 }]);
    });

    it('returns null when file content is invalid JSON', () => {
      readFileSync.mockReturnValue('not-json');
      const result = readCache('torvalds', 'events');
      expect(result).toBeNull();
    });
  });

  describe('writeCache', () => {
    it('writes serialized cache entry to disk', () => {
      writeCache('torvalds', 'events', [{ id: 2 }]);
      expect(writeFileSync).toHaveBeenCalledOnce();
      const written = JSON.parse(writeFileSync.mock.calls[0][1]);
      expect(written.data).toEqual([{ id: 2 }]);
      expect(written.ttl).toBe(300000);
      expect(written.timestamp).toBeLessThanOrEqual(Date.now());
    });

    it('creates cache directory if it does not exist', () => {
      existsSync.mockReturnValue(false);
      writeCache('torvalds', 'events', []);
      expect(mkdirSync).toHaveBeenCalledWith(expect.stringContaining('.gitpulse'), { recursive: true });
    });
  });
});
