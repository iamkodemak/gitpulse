import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CACHE_DIR = join(homedir(), '.gitpulse', 'cache');
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function getCacheKey(username, type) {
  return createHash('md5').update(`${username}:${type}`).digest('hex');
}

function getCachePath(key) {
  return join(CACHE_DIR, `${key}.json`);
}

export function readCache(username, type) {
  const key = getCacheKey(username, type);
  const cachePath = getCachePath(key);

  if (!existsSync(cachePath)) return null;

  try {
    const raw = readFileSync(cachePath, 'utf8');
    const { data, timestamp, ttl } = JSON.parse(raw);
    const age = Date.now() - timestamp;

    if (age > ttl) return null;

    return data;
  } catch {
    return null;
  }
}

export function writeCache(username, type, data, ttl = DEFAULT_TTL_MS) {
  ensureCacheDir();
  const key = getCacheKey(username, type);
  const cachePath = getCachePath(key);

  const entry = { data, timestamp: Date.now(), ttl };
  writeFileSync(cachePath, JSON.stringify(entry), 'utf8');
}

export function clearCache(username, type) {
  const key = getCacheKey(username, type);
  const cachePath = getCachePath(key);

  if (existsSync(cachePath)) {
    import('fs').then(({ unlinkSync }) => unlinkSync(cachePath));
  }
}
