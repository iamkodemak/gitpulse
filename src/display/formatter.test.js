const {
  padEnd,
  stripAnsi,
  formatNumber,
  labelValue,
  sectionHeader,
  divider,
} = require('./formatter');

describe('formatter', () => {
  describe('stripAnsi', () => {
    it('removes ANSI escape codes', () => {
      expect(stripAnsi('\x1b[32mhello\x1b[0m')).toBe('hello');
    });

    it('returns plain string unchanged', () => {
      expect(stripAnsi('plain text')).toBe('plain text');
    });
  });

  describe('padEnd', () => {
    it('pads a plain string to the given width', () => {
      const result = padEnd('hi', 6);
      expect(stripAnsi(result)).toBe('hi    ');
    });

    it('does not truncate strings longer than width', () => {
      const result = padEnd('toolong', 4);
      expect(stripAnsi(result)).toBe('toolong');
    });

    it('accounts for ANSI codes when padding', () => {
      const colored = '\x1b[32mhi\x1b[0m';
      const result = padEnd(colored, 6);
      expect(stripAnsi(result)).toBe('hi    ');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with comma separators', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
    });

    it('returns small numbers unchanged in format', () => {
      expect(formatNumber(42)).toBe('42');
    });
  });

  describe('labelValue', () => {
    it('returns a string containing the label and value', () => {
      const result = stripAnsi(labelValue('Total commits', 99));
      expect(result).toContain('Total commits');
      expect(result).toContain('99');
    });
  });

  describe('sectionHeader', () => {
    it('contains the title text', () => {
      const result = stripAnsi(sectionHeader('Overview'));
      expect(result).toContain('Overview');
    });
  });

  describe('divider', () => {
    it('returns a string of dashes', () => {
      const result = stripAnsi(divider(10));
      expect(result).toBe('─'.repeat(10));
    });
  });
});
