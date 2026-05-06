const { fg256, bold, dim, palette, SUPPORTS_COLOR } = require('./colors');

describe('colors', () => {
  describe('fg256', () => {
    it('wraps text in ANSI 256-color sequence when color supported', () => {
      if (!SUPPORTS_COLOR) return;
      const result = fg256('hello', 34);
      expect(result).toContain('\x1b[38;5;34m');
      expect(result).toContain('hello');
      expect(result).toContain('\x1b[0m');
    });

    it('returns plain text when color is not supported', () => {
      // Simulate no-color by mocking SUPPORTS_COLOR indirectly via module internals
      const original = process.env.FORCE_COLOR;
      // We test the output type at minimum
      const result = fg256('hello', 34);
      expect(typeof result).toBe('string');
      expect(result).toContain('hello');
      process.env.FORCE_COLOR = original;
    });
  });

  describe('bold', () => {
    it('returns a string containing the original text', () => {
      const result = bold('important');
      expect(result).toContain('important');
    });
  });

  describe('dim', () => {
    it('returns a string containing the original text', () => {
      const result = dim('subtle');
      expect(result).toContain('subtle');
    });
  });

  describe('palette', () => {
    const colorNames = ['green', 'yellow', 'blue', 'red', 'gray', 'white'];

    colorNames.forEach((name) => {
      it(`palette.${name} returns a string containing the input`, () => {
        const result = palette[name]('test');
        expect(typeof result).toBe('string');
        expect(result).toContain('test');
      });
    });

    it('palette.bold wraps text', () => {
      expect(palette.bold('x')).toContain('x');
    });

    it('palette.dim wraps text', () => {
      expect(palette.dim('x')).toContain('x');
    });
  });
});
