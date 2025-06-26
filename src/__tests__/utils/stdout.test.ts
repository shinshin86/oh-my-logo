import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shouldUseColor, stripAnsiCodes } from '../../utils/stdout.js';

// Mock process.stdout and process.env
const mockProcess = {
  stdout: {
    isTTY: true
  },
  env: {} as Record<string, string | undefined>
};

vi.stubGlobal('process', mockProcess);

describe('utils/stdout', () => {
  beforeEach(() => {
    // Reset process mock state
    mockProcess.stdout.isTTY = true;
    mockProcess.env = {} as Record<string, string | undefined>;
    vi.clearAllMocks();
  });

  describe('shouldUseColor', () => {
    describe('forceColor option', () => {
      it('should return true when forceColor is true', () => {
        mockProcess.stdout.isTTY = false;
        const result = shouldUseColor({ forceColor: true });
        expect(result).toBe(true);
      });

      it('should return true when forceColor is true even with NO_COLOR set', () => {
        mockProcess.env.NO_COLOR = '1';
        const result = shouldUseColor({ forceColor: true });
        expect(result).toBe(true);
      });
    });

    describe('noColor option', () => {
      it('should return false when noColor is true', () => {
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor({ noColor: true });
        expect(result).toBe(false);
      });

      it('should return false when noColor is true even in TTY', () => {
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor({ noColor: true });
        expect(result).toBe(false);
      });
    });

    describe('forceColor takes precedence over noColor', () => {
      it('should return true when both forceColor and noColor are true', () => {
        const result = shouldUseColor({ forceColor: true, noColor: true });
        expect(result).toBe(true);
      });
    });

    describe('environment variables', () => {
      it('should return false when NO_COLOR is set', () => {
        mockProcess.env.NO_COLOR = '1';
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor({});
        expect(result).toBe(false);
      });

      it('should return false when NO_COLOR is set to any non-empty value', () => {
        mockProcess.env.NO_COLOR = 'true';
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor({});
        expect(result).toBe(false);
      });

      it('should return true when NO_COLOR is empty string', () => {
        mockProcess.env.NO_COLOR = '';
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor({});
        expect(result).toBe(true);
      });

      it('should return true when FORCE_COLOR is set', () => {
        mockProcess.env.FORCE_COLOR = '1';
        mockProcess.stdout.isTTY = false;
        const result = shouldUseColor({});
        expect(result).toBe(true);
      });

      it('should return true when FORCE_COLOR is set to any non-empty value', () => {
        mockProcess.env.FORCE_COLOR = 'true';
        mockProcess.stdout.isTTY = false;
        const result = shouldUseColor({});
        expect(result).toBe(true);
      });

      it('should return false when FORCE_COLOR is empty string', () => {
        mockProcess.env.FORCE_COLOR = '';
        mockProcess.stdout.isTTY = false;
        const result = shouldUseColor({});
        expect(result).toBe(false);
      });

      it('should prioritize NO_COLOR over FORCE_COLOR', () => {
        mockProcess.env.NO_COLOR = '1';
        mockProcess.env.FORCE_COLOR = '1';
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor({});
        expect(result).toBe(false);
      });
    });

    describe('TTY detection', () => {
      it('should return true when stdout is TTY and no options provided', () => {
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor({});
        expect(result).toBe(true);
      });

      it('should return false when stdout is not TTY and no options provided', () => {
        mockProcess.stdout.isTTY = false;
        const result = shouldUseColor({});
        expect(result).toBe(false);
      });

      it('should handle missing isTTY property', () => {
        delete (mockProcess.stdout as any).isTTY;
        const result = shouldUseColor({});
        expect(result).toBe(false);
      });
    });

    describe('CI environment detection', () => {
      it('should return true when CI is set and supports color', () => {
        mockProcess.env.CI = 'true';
        mockProcess.env.COLORTERM = 'truecolor';
        mockProcess.stdout.isTTY = false;
        const result = shouldUseColor({});
        expect(result).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should handle undefined options', () => {
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor(undefined as any);
        expect(result).toBe(true);
      });

      it('should handle empty options object', () => {
        mockProcess.stdout.isTTY = true;
        const result = shouldUseColor({});
        expect(result).toBe(true);
      });
    });
  });

  describe('stripAnsiCodes', () => {
    it('should remove basic ANSI color codes', () => {
      const input = '\u001b[31mRed text\u001b[39m';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Red text');
    });

    it('should remove multiple ANSI codes', () => {
      const input = '\u001b[31m\u001b[1mBold red text\u001b[22m\u001b[39m';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Bold red text');
    });

    it('should remove RGB color codes', () => {
      const input = '\u001b[38;2;255;0;0mRGB red text\u001b[39m';
      const result = stripAnsiCodes(input);
      expect(result).toBe('RGB red text');
    });

    it('should remove background color codes', () => {
      const input = '\u001b[41m\u001b[37mWhite text on red background\u001b[49m\u001b[39m';
      const result = stripAnsiCodes(input);
      expect(result).toBe('White text on red background');
    });

    it('should remove cursor movement codes', () => {
      const input = '\u001b[2J\u001b[H\u001b[1;1HClear screen and home';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Clear screen and home');
    });

    it('should handle text without ANSI codes', () => {
      const input = 'Plain text with no colors';
      const result = stripAnsiCodes(input);
      expect(result).toBe(input);
    });

    it('should handle empty string', () => {
      const result = stripAnsiCodes('');
      expect(result).toBe('');
    });

    it('should handle multiline text with ANSI codes', () => {
      const input = '\u001b[31mLine 1\u001b[39m\n\u001b[32mLine 2\u001b[39m\n\u001b[34mLine 3\u001b[39m';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Line 1\nLine 2\nLine 3');
    });

    it('should handle complex gradient-string output', () => {
      // Simulate typical gradient-string output with multiple escape sequences
      const input = '\u001b[38;2;255;153;102mH\u001b[38;2;255;94;98me\u001b[38;2;255;163;78ml\u001b[38;2;255;94;98ml\u001b[38;2;255;153;102mo';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Hello');
    });

    it('should handle mixed content', () => {
      const input = 'Normal text \u001b[31mRed\u001b[39m more normal \u001b[32mGreen\u001b[39m text';
      const result = stripAnsiCodes(input);
      expect(result).toBe('Normal text Red more normal Green text');
    });

    it('should handle malformed ANSI codes gracefully', () => {
      const input = '\u001b[31mRed\u001b[39 incomplete code';
      const result = stripAnsiCodes(input);
      // Should remove complete codes and leave incomplete ones
      expect(result).toBe('Red\u001b[39 incomplete code');
    });

    describe('edge cases', () => {
      it('should handle only ANSI codes with no text', () => {
        const input = '\u001b[31m\u001b[39m\u001b[32m\u001b[39m';
        const result = stripAnsiCodes(input);
        expect(result).toBe('');
      });

      it('should handle consecutive ANSI codes', () => {
        const input = '\u001b[31m\u001b[1m\u001b[4mText\u001b[24m\u001b[22m\u001b[39m';
        const result = stripAnsiCodes(input);
        expect(result).toBe('Text');
      });

      it('should preserve whitespace', () => {
        const input = '\u001b[31m   Spaced   text   \u001b[39m';
        const result = stripAnsiCodes(input);
        expect(result).toBe('   Spaced   text   ');
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work together - color detection and stripping', () => {
      const coloredText = '\u001b[31mRed text\u001b[39m';
      
      // When color should be used, return original
      mockProcess.stdout.isTTY = true;
      const useColor = shouldUseColor({});
      const result1 = useColor ? coloredText : stripAnsiCodes(coloredText);
      expect(result1).toBe(coloredText);
      
      // When color should not be used, strip codes
      mockProcess.stdout.isTTY = false;
      const noColor = shouldUseColor({});
      const result2 = noColor ? coloredText : stripAnsiCodes(coloredText);
      expect(result2).toBe('Red text');
    });

    it('should handle force color with stripping', () => {
      const coloredText = '\u001b[32mGreen text\u001b[39m';
      
      // Force color should keep ANSI codes
      const result1 = shouldUseColor({ forceColor: true }) ? coloredText : stripAnsiCodes(coloredText);
      expect(result1).toBe(coloredText);
      
      // No color should strip ANSI codes
      const result2 = shouldUseColor({ noColor: true }) ? coloredText : stripAnsiCodes(coloredText);
      expect(result2).toBe('Green text');
    });
  });
});