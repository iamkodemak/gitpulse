/**
 * Integration test: wire github/firstlast -> display/firstlastpanel
 */
import { buildFirstLastReport } from '../github/firstlast.js';
import { renderFirstLastPanel } from './firstlastpanel.js';
import { stripAnsi } from './formatter.js';

function makeMap(entries) {
  return new Map(Object.entries(entries));
}

describe('firstlast integration', () => {
  it('renders a panel from a real contribution map', () => {
    const map = makeMap({
      '2022-06-01': 1,
      '2022-06-15': 4,
      '2022-07-04': 0,
      '2023-12-31': 7,
    });
    const report = buildFirstLastReport(map);
    const panel  = renderFirstLastPanel(report);
    const text   = stripAnsi(panel);

    expect(text).toContain('Contribution Window');
    expect(text).toContain('Jun 1, 2022');
    expect(text).toContain('Dec 31, 2023');
    // span = 2022-06-01 -> 2023-12-31 = 578 days => 1y 6mo ...
    expect(text).toContain('1y');
  });

  it('renders gracefully for an empty map', () => {
    const report = buildFirstLastReport(new Map());
    const panel  = renderFirstLastPanel(report);
    const text   = stripAnsi(panel);
    expect(text).toContain('—');
    expect(text).toContain('no data');
  });
});
