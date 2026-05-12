import { langChartColor, renderLangBar, renderLanguageChart } from "./languagechart.js";
import { stripAnsi } from "./formatter.js";

describe("langChartColor", () => {
  it("returns a function that wraps text", () => {
    const color = langChartColor("JavaScript");
    const out = color("hello");
    expect(typeof out).toBe("string");
    expect(stripAnsi(out)).toBe("hello");
  });

  it("falls back for unknown language", () => {
    const color = langChartColor("COBOL");
    expect(stripAnsi(color("x"))).toBe("x");
  });
});

describe("renderLangBar", () => {
  it("includes lang name and percentage", () => {
    const row = renderLangBar("Python", 42.5);
    const plain = stripAnsi(row);
    expect(plain).toContain("Python");
    expect(plain).toContain("42.5%");
  });

  it("renders 0% without filled blocks", () => {
    const row = renderLangBar("Go", 0);
    expect(stripAnsi(row)).toContain("0.0%");
  });

  it("renders 100% as full bar", () => {
    const row = renderLangBar("Rust", 100);
    expect(stripAnsi(row)).toContain("100.0%");
  });
});

describe("renderLanguageChart", () => {
  const langBytes = { JavaScript: 8000, Python: 5000, Go: 3000, Rust: 2000 };

  it("returns a non-empty string", () => {
    const out = renderLanguageChart(langBytes);
    expect(typeof out).toBe("string");
    expect(out.length).toBeGreaterThan(0);
  });

  it("includes all language names", () => {
    const plain = stripAnsi(renderLanguageChart(langBytes));
    expect(plain).toContain("JavaScript");
    expect(plain).toContain("Python");
  });

  it("respects topN limit", () => {
    const plain = stripAnsi(renderLanguageChart(langBytes, 2));
    expect(plain).not.toContain("Rust");
  });

  it("handles empty input gracefully", () => {
    const out = stripAnsi(renderLanguageChart({}));
    expect(out).toContain("No language data");
  });
});
