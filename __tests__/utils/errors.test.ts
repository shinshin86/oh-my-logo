import { describe, it, expect } from 'vitest';
import { PaletteError, InputError, FontError } from '../../src/utils/errors.js';

describe('utils/errors', () => {
  describe('PaletteError', () => {
    it('should create error with correct message and palette name', () => {
      const error = new PaletteError('invalid-palette');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(PaletteError);
      expect(error.name).toBe('PaletteError');
      expect(error.message).toBe('Unknown palette: invalid-palette');
      expect(error.palette).toBe('invalid-palette');
    });

    it('should handle empty palette name', () => {
      const error = new PaletteError('');

      expect(error.message).toBe('Unknown palette: ');
      expect(error.palette).toBe('');
    });

    it('should handle special characters in palette name', () => {
      const paletteName = 'my-special-palette_123!';
      const error = new PaletteError(paletteName);

      expect(error.message).toBe(`Unknown palette: ${paletteName}`);
      expect(error.palette).toBe(paletteName);
    });

    it('should be catchable as generic Error', () => {
      const error = new PaletteError('test');

      expect(() => {
        throw error;
      }).toThrow(Error);
    });

    it('should have proper error stack', () => {
      const error = new PaletteError('test');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('PaletteError');
    });
  });

  describe('InputError', () => {
    it('should create error with correct message and input', () => {
      const error = new InputError('invalid input');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(InputError);
      expect(error.name).toBe('InputError');
      expect(error.message).toBe('Invalid input: invalid input');
      expect(error.input).toBe('invalid input');
    });

    it('should handle empty input', () => {
      const error = new InputError('');

      expect(error.message).toBe('Invalid input: ');
      expect(error.input).toBe('');
    });

    it('should handle multiline input', () => {
      const input = 'line1\nline2\nline3';
      const error = new InputError(input);

      expect(error.message).toBe(`Invalid input: ${input}`);
      expect(error.input).toBe(input);
    });

    it('should be catchable as generic Error', () => {
      const error = new InputError('test');

      expect(() => {
        throw error;
      }).toThrow(Error);
    });

    it('should have proper error stack', () => {
      const error = new InputError('test input');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('InputError');
    });
  });

  describe('FontError', () => {
    it('should create error with correct message and font name', () => {
      const error = new FontError('invalid-font');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(FontError);
      expect(error.name).toBe('FontError');
      expect(error.message).toBe('Font not found: invalid-font');
      expect(error.font).toBe('invalid-font');
    });

    it('should handle empty font name', () => {
      const error = new FontError('');

      expect(error.message).toBe('Font not found: ');
      expect(error.font).toBe('');
    });

    it('should handle font names with spaces', () => {
      const fontName = 'Big Money';
      const error = new FontError(fontName);

      expect(error.message).toBe(`Font not found: ${fontName}`);
      expect(error.font).toBe(fontName);
    });

    it('should be catchable as generic Error', () => {
      const error = new FontError('test');

      expect(() => {
        throw error;
      }).toThrow(Error);
    });

    it('should have proper error stack', () => {
      const error = new FontError('invalid-font');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('FontError');
    });
  });

  describe('error inheritance', () => {
    it('should have different error types', () => {
      const paletteError = new PaletteError('test');
      const inputError = new InputError('test');
      const fontError = new FontError('test');

      expect(paletteError).not.toBeInstanceOf(InputError);
      expect(paletteError).not.toBeInstanceOf(FontError);
      expect(inputError).not.toBeInstanceOf(PaletteError);
      expect(inputError).not.toBeInstanceOf(FontError);
      expect(fontError).not.toBeInstanceOf(PaletteError);
      expect(fontError).not.toBeInstanceOf(InputError);
    });

    it('should all be instances of Error', () => {
      const errors = [
        new PaletteError('test'),
        new InputError('test'),
        new FontError('test'),
      ];

      errors.forEach((error) => {
        expect(error).toBeInstanceOf(Error);
      });
    });
  });

  describe('error catching scenarios', () => {
    it('should be distinguishable when catching', () => {
      const testError = (error: Error) => {
        if (error instanceof PaletteError) {
          return 'palette';
        } else if (error instanceof InputError) {
          return 'input';
        } else if (error instanceof FontError) {
          return 'font';
        }
        return 'unknown';
      };

      expect(testError(new PaletteError('test'))).toBe('palette');
      expect(testError(new InputError('test'))).toBe('input');
      expect(testError(new FontError('test'))).toBe('font');
      expect(testError(new Error('test'))).toBe('unknown');
    });
  });
});
