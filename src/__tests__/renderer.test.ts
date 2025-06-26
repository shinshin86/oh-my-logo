import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderLogo } from '../renderer.js';

// Mock figlet
vi.mock('figlet', () => ({
  default: {
    textSync: vi.fn()
  }
}));

// Mock gradient-string
vi.mock('gradient-string', () => ({
  default: vi.fn()
}));

import figlet from 'figlet';
import gradient from 'gradient-string';

describe('renderer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('renderLogo', () => {
    const mockAsciiArt = ' _____ _____ _____ _____ \n|_   _|  ___|  ___|_   _|\n  | | | |_  | |_    | |  \n  | | |  _| |  _|   | |  \n  |_| |_|   |_|     |_|  ';
    const mockPalette = ['#ff0000', '#00ff00', '#0000ff'];

    beforeEach(() => {
      vi.mocked(figlet.textSync).mockReturnValue(mockAsciiArt);
    });

    describe('vertical gradient (default)', () => {
      it('should render with vertical gradient', () => {
        const mockGradient = {
          multiline: vi.fn().mockReturnValue('colored ascii art')
        };
        vi.mocked(gradient).mockReturnValue(mockGradient as any);

        const result = renderLogo('TEST', mockPalette);

        expect(figlet.textSync).toHaveBeenCalledWith('TEST', {
          font: 'Standard',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true
        });
        expect(gradient).toHaveBeenCalledWith(mockPalette);
        expect(mockGradient.multiline).toHaveBeenCalledWith(mockAsciiArt);
        expect(result).toBe('colored ascii art');
      });

      it('should use custom font', () => {
        const mockGradient = {
          multiline: vi.fn().mockReturnValue('colored ascii art')
        };
        vi.mocked(gradient).mockReturnValue(mockGradient as any);

        renderLogo('TEST', mockPalette, 'Big');

        expect(figlet.textSync).toHaveBeenCalledWith('TEST', {
          font: 'Big',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true
        });
      });
    });

    describe('horizontal gradient', () => {
      it('should render with horizontal gradient', () => {
        const mockGradientFn = vi.fn().mockReturnValue('colored line');
        vi.mocked(gradient).mockReturnValue(mockGradientFn as any);

        const result = renderLogo('TEST', mockPalette, 'Standard', 'horizontal');

        expect(gradient).toHaveBeenCalledWith(mockPalette);
        
        // Should call gradient function for each non-empty line
        const lines = mockAsciiArt.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim() !== '');
        expect(mockGradientFn).toHaveBeenCalledTimes(nonEmptyLines.length);
        
        expect(result).toContain('colored line');
      });

      it('should preserve empty lines', () => {
        const artWithEmptyLines = 'LINE1\n\nLINE3\n\nLINE5';
        vi.mocked(figlet.textSync).mockReturnValue(artWithEmptyLines);
        
        const mockGradientFn = vi.fn().mockReturnValue('colored');
        vi.mocked(gradient).mockReturnValue(mockGradientFn as any);

        const result = renderLogo('TEST', mockPalette, 'Standard', 'horizontal');

        // Should only call gradient for non-empty lines (3 times)
        expect(mockGradientFn).toHaveBeenCalledTimes(3);
        expect(mockGradientFn).toHaveBeenCalledWith('LINE1');
        expect(mockGradientFn).toHaveBeenCalledWith('LINE3');
        expect(mockGradientFn).toHaveBeenCalledWith('LINE5');
        
        // Result should maintain line structure
        const resultLines = result.split('\n');
        expect(resultLines).toHaveLength(5);
        expect(resultLines[1]).toBe(''); // Empty line preserved
        expect(resultLines[3]).toBe(''); // Empty line preserved
      });
    });

    describe('diagonal gradient', () => {
      it('should render with diagonal gradient', () => {
        const mockGradientFn = vi.fn().mockReturnValue('colored line');
        vi.mocked(gradient).mockReturnValue(mockGradientFn as any);

        const result = renderLogo('TEST', mockPalette, 'Standard', 'diagonal');

        // Should create a new gradient for each line with shifted palette
        const lines = mockAsciiArt.split('\n');
        const nonEmptyLines = lines.filter(line => line.trim() !== '');
        
        // First call creates the main gradient function, then one call per non-empty line
        expect(gradient).toHaveBeenCalledTimes(1 + nonEmptyLines.length);
        expect(mockGradientFn).toHaveBeenCalledTimes(nonEmptyLines.length);
        
        expect(result).toContain('colored line');
      });

      it('should shift palette colors based on line position', () => {
        const artWithMultipleLines = 'LINE1\nLINE2\nLINE3\nLINE4';
        vi.mocked(figlet.textSync).mockReturnValue(artWithMultipleLines);
        
        const mockGradientFn = vi.fn().mockReturnValue('colored');
        vi.mocked(gradient).mockReturnValue(mockGradientFn as any);

        renderLogo('TEST', mockPalette, 'Standard', 'diagonal');

        // Should call gradient with different palette shifts for each line
        expect(gradient).toHaveBeenCalledTimes(5); // 1 initial + 4 lines
        
        // Each call should have a shifted version of the palette
        const gradientCalls = vi.mocked(gradient).mock.calls;
        expect(gradientCalls).toHaveLength(5);
        
        // Verify each call has an array of 3 colors (same length as original palette)
        gradientCalls.forEach(call => {
          expect(call[0]).toHaveLength(3);
          expect(Array.isArray(call[0])).toBe(true);
        });
      });
    });

    describe('error handling', () => {
      it('should throw FontError when figlet throws font-related error', () => {
        const fontError = new Error('Font "InvalidFont" not found');
        vi.mocked(figlet.textSync).mockImplementation(() => {
          throw fontError;
        });

        expect(() => renderLogo('TEST', mockPalette, 'InvalidFont')).toThrow();
      });

      it('should re-throw non-font errors', () => {
        const genericError = new Error('Generic error');
        vi.mocked(figlet.textSync).mockImplementation(() => {
          throw genericError;
        });

        expect(() => renderLogo('TEST', mockPalette)).toThrow('Generic error');
      });

      it('should handle empty text input', () => {
        vi.mocked(figlet.textSync).mockReturnValue('');
        const mockGradient = {
          multiline: vi.fn().mockReturnValue('')
        };
        vi.mocked(gradient).mockReturnValue(mockGradient as any);

        const result = renderLogo('', mockPalette);

        expect(figlet.textSync).toHaveBeenCalledWith('', expect.any(Object));
        expect(result).toBe('');
      });
    });

    describe('edge cases', () => {
      it('should handle single character input', () => {
        vi.mocked(figlet.textSync).mockReturnValue('A');
        const mockGradient = {
          multiline: vi.fn().mockReturnValue('A')
        };
        vi.mocked(gradient).mockReturnValue(mockGradient as any);

        const result = renderLogo('A', mockPalette);

        expect(result).toBe('A');
      });

      it('should handle very long text', () => {
        const longText = 'A'.repeat(100);
        vi.mocked(figlet.textSync).mockReturnValue('long ascii art');
        const mockGradient = {
          multiline: vi.fn().mockReturnValue('colored long ascii art')
        };
        vi.mocked(gradient).mockReturnValue(mockGradient as any);

        const result = renderLogo(longText, mockPalette);

        expect(figlet.textSync).toHaveBeenCalledWith(longText, expect.any(Object));
        expect(result).toBe('colored long ascii art');
      });

      it('should handle single color palette', () => {
        const singleColorPalette = ['#ff0000'];
        const mockGradient = {
          multiline: vi.fn().mockReturnValue('single color art')
        };
        vi.mocked(gradient).mockReturnValue(mockGradient as any);

        const result = renderLogo('TEST', singleColorPalette);

        expect(gradient).toHaveBeenCalledWith(singleColorPalette);
        expect(result).toBe('single color art');
      });
    });
  });
});