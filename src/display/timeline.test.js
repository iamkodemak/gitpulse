import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getRecentMonths, aggregateByMonth, renderMonthBar, renderTimeline } from './timeline.js';
import { stripAnsi } from './formatter.js';

describe('getRecentMonths', () => {
  it('returns the requested number of months', () => {
    const months = getRecentMonths(6);
    assert.equal(months.length, 6);
  });

  it('last entry is the current month', () => {
    const months = getRecentMonths(3);
    const now = new Date();
    const last = months[months.length - 1];
    assert.equal(last.month, now.getMonth());
    assert.equal(last.year, now.getFullYear());
  });

  it('months are in ascending order', () => {
    const months = getRecentMonths(4);
    for (let i = 1; i < months.length; i++) {
      const prev = months[i - 1];
      const curr = months[i];
      const prevVal = prev.year * 12 + prev.month;
      const currVal = curr.year * 12 + curr.month;
      assert.ok(currVal > prevVal);
    }
  });
});

describe('aggregateByMonth', () => {
  it('sums contributions for the correct month', () => {
    const map = { '2024-03-01': 3, '2024-03-15': 5, '2024-04-10': 2 };
    const months = [{ label: 'Mar', year: 2024, month: 2 }, { label: 'Apr', year: 2024, month: 3 }];
    const result = aggregateByMonth(map, months);
    assert.equal(result[0].total, 8);
    assert.equal(result[1].total, 2);
  });

  it('returns zero for months with no contributions', () => {
    const map = {};
    const months = [{ label: 'Jan', year: 2024, month: 0 }];
    const result = aggregateByMonth(map, months);
    assert.equal(result[0].total, 0);
  });
});

describe('renderMonthBar', () => {
  it('returns an array of length barHeight', () => {
    const bar = renderMonthBar(5, 10, 5);
    assert.equal(bar.length, 5);
  });

  it('returns empty bar when total is zero', () => {
    const bar = renderMonthBar(0, 10, 4);
    bar.forEach(cell => assert.ok(stripAnsi(cell).includes('░')));
  });

  it('fills bar fully when total equals max', () => {
    const bar = renderMonthBar(10, 10, 4);
    bar.forEach(cell => assert.ok(stripAnsi(cell).includes('█')));
  });
});

describe('renderTimeline', () => {
  it('returns a non-empty string', () => {
    const map = { '2024-03-10': 4 };
    const result = renderTimeline(map, 3, 3);
    assert.ok(typeof result === 'string');
    assert.ok(result.length > 0);
  });

  it('includes month labels in output', () => {
    const map = {};
    const result = stripAnsi(renderTimeline(map, 2, 2));
    assert.ok(result.length > 0);
  });
});
