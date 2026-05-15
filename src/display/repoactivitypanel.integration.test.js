import { describe, it, expect } from 'vitest';
import { buildRepoActivityReport } from '../github/repoactivity.js';
import { renderRepoActivityPanel } from './repoactivitypanel.js';
import { stripAnsi } from './formatter.js';

const makeEvents = (repos) => repos.map((name) => ({ repo: { name } }));

describe('repoactivitypanel integration', () => {
  it('renders a full pipeline from events to panel', () => {
    const events = makeEvents([
      'org/frontend', 'org/frontend', 'org/frontend',
      'org/backend', 'org/backend',
      'org/infra',
    ]);
    const report = buildRepoActivityReport(events, 3);
    const panel = stripAnsi(renderRepoActivityPanel(report));

    expect(panel).toContain('frontend');
    expect(panel).toContain('backend');
    expect(panel).toContain('infra');
    expect(panel).toContain('Total events: 6');
  });

  it('top repo has the largest bar', () => {
    const events = makeEvents([
      'a/one', 'a/one', 'a/one', 'a/one',
      'a/two',
    ]);
    const report = buildRepoActivityReport(events, 2);
    const panel = stripAnsi(renderRepoActivityPanel(report));
    const lines = panel.split('\n').filter((l) => l.includes('█'));
    // first bar should have more blocks than second
    const blocks = lines.map((l) => (l.match(/█/g) ?? []).length);
    expect(blocks[0]).toBeGreaterThan(blocks[1]);
  });
});
