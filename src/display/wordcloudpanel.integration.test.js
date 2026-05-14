const { buildWordCloud } = require('../github/wordcloud');
const { renderWordCloudPanel } = require('./wordcloudpanel');
const { stripAnsi } = require('./formatter');

const mockEvents = [
  {
    type: 'PushEvent',
    repo: { name: 'alice/awesome-cli' },
    payload: {
      commits: [
        { message: 'refactor: extract authentication module' },
        { message: 'feat: add dashboard component' },
        { message: 'refactor: simplify authentication logic' },
        { message: 'test: add tests for dashboard' }
      ]
    }
  },
  {
    type: 'PushEvent',
    repo: { name: 'alice/backend-api' },
    payload: {
      commits: [
        { message: 'chore: update dependencies' },
        { message: 'feat: implement rate limiting middleware' }
      ]
    }
  },
  {
    type: 'CreateEvent',
    repo: { name: 'alice/data-pipeline' },
    payload: {}
  }
];

describe('wordcloud integration', () => {
  it('builds and renders without errors', () => {
    const data = buildWordCloud(mockEvents, 15);
    expect(() => renderWordCloudPanel(data, 60)).not.toThrow();
  });

  it('top word appears in rendered output', () => {
    const data = buildWordCloud(mockEvents, 15);
    const output = stripAnsi(renderWordCloudPanel(data, 60));
    // 'refactor' appears twice in messages
    expect(output).toContain('refactor');
  });

  it('rendered output contains section header', () => {
    const data = buildWordCloud(mockEvents, 15);
    const output = stripAnsi(renderWordCloudPanel(data, 60));
    expect(output).toContain('Commit Word Cloud');
  });

  it('word counts are consistent between data and display', () => {
    const data = buildWordCloud(mockEvents, 15);
    const refactorEntry = data.words.find(w => w.word === 'refactor');
    expect(refactorEntry).toBeDefined();
    const output = stripAnsi(renderWordCloudPanel(data, 60));
    expect(output).toContain(`(${refactorEntry.count})`);
  });
});
