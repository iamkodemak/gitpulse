import {
  aggregateLanguageBytes,
  bytesToPercent,
  topLanguages,
  primaryLanguageCounts,
} from "./languages.js";

const repos = [
  { language: "JavaScript", languages: { JavaScript: 8000, CSS: 2000 } },
  { language: "Python", languages: { Python: 5000, JavaScript: 1000 } },
  { language: "JavaScript", languages: { JavaScript: 3000 } },
];

describe("aggregateLanguageBytes", () => {
  it("sums bytes across repos", () => {
    const result = aggregateLanguageBytes(repos);
    expect(result.JavaScript).toBe(12000);
    expect(result.Python).toBe(5000);
    expect(result.CSS).toBe(2000);
  });

  it("handles repos without languages", () => {
    const result = aggregateLanguageBytes([{ language: "Go" }]);
    expect(result).toEqual({});
  });
});

describe("bytesToPercent", () => {
  it("converts bytes to percentages summing ~100", () => {
    const pct = bytesToPercent({ JavaScript: 12000, Python: 5000, CSS: 2000 });
    const sum = Object.values(pct).reduce((s, v) => s + v, 0);
    expect(Math.round(sum)).toBe(100);
    expect(pct.JavaScript).toBeGreaterThan(60);
  });

  it("returns empty object for zero total", () => {
    expect(bytesToPercent({})).toEqual({});
  });
});

describe("topLanguages", () => {
  it("returns top N sorted descending", () => {
    const top = topLanguages({ Go: 100, Rust: 500, JS: 300 }, 2);
    expect(top[0].lang).toBe("Rust");
    expect(top[1].lang).toBe("JS");
    expect(top.length).toBe(2);
  });
});

describe("primaryLanguageCounts", () => {
  it("counts primary language occurrences", () => {
    const counts = primaryLanguageCounts(repos);
    expect(counts.JavaScript).toBe(2);
    expect(counts.Python).toBe(1);
  });

  it("ignores repos with no language", () => {
    const counts = primaryLanguageCounts([{ languages: { Go: 100 } }]);
    expect(Object.keys(counts).length).toBe(0);
  });
});
