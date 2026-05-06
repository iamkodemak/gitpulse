import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseCliArgs, validateArgs } from './args.js';

describe('parseCliArgs', () => {
  it('parses --user and --token flags', () => {
    const args = parseCliArgs(['--user', 'octocat', '--token', 'ghp_abc']);
    assert.equal(args.user, 'octocat');
    assert.equal(args.token, 'ghp_abc');
  });

  it('parses short flags -u and -t', () => {
    const args = parseCliArgs(['-u', 'octocat', '-t', 'ghp_abc']);
    assert.equal(args.user, 'octocat');
    assert.equal(args.token, 'ghp_abc');
  });

  it('defaults days to 90', () => {
    const args = parseCliArgs([]);
    assert.equal(args.days, 90);
  });

  it('parses --days flag', () => {
    const args = parseCliArgs(['--days', '30']);
    assert.equal(args.days, 30);
  });

  it('clamps days between 1 and 365', () => {
    assert.equal(parseCliArgs(['--days', '0']).days, 1);
    assert.equal(parseCliArgs(['--days', '999']).days, 365);
  });

  it('defaults no-cache to false', () => {
    const args = parseCliArgs([]);
    assert.equal(args.noCache, false);
  });

  it('parses --no-cache flag', () => {
    const args = parseCliArgs(['--no-cache']);
    assert.equal(args.noCache, true);
  });

  it('defaults help to false', () => {
    const args = parseCliArgs([]);
    assert.equal(args.help, false);
  });

  it('parses --help flag', () => {
    const args = parseCliArgs(['--help']);
    assert.equal(args.help, true);
  });
});

describe('validateArgs', () => {
  it('returns no errors when user and token are set', () => {
    const errors = validateArgs({ user: 'octocat', token: 'ghp_abc' });
    assert.deepEqual(errors, []);
  });

  it('returns error when user is missing', () => {
    const errors = validateArgs({ user: null, token: 'ghp_abc' });
    assert.equal(errors.length, 1);
    assert.match(errors[0], /username is required/);
  });

  it('returns error when token is missing', () => {
    const errors = validateArgs({ user: 'octocat', token: null });
    assert.equal(errors.length, 1);
    assert.match(errors[0], /token is required/);
  });

  it('returns both errors when user and token are missing', () => {
    const errors = validateArgs({ user: null, token: null });
    assert.equal(errors.length, 2);
  });
});
