import { describe, it, expect, vi } from 'vitest';
import {
  render,
  renderFilled,
  resolveColors,
  DEFAULT_PALETTE,
  DEFAULT_FONT,
  DEFAULT_DIRECTION,
  type RenderOptions,
  type RenderInkOptions,
} from '../src/lib.js';

// Mock the dependencies
vi.mock('../src/renderer.js', () => ({
  renderLogo: vi.fn().mockResolvedValue('mocked ascii art'),
}));

vi.mock('../src/InkRenderer.js', () => ({
  renderInkLogo: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../src/palettes.js', async () => {
  const actual = await vi.importActual('../src/palettes.js');
  return {
    ...actual,
    resolvePalette: vi.fn().mockImplementation((name: string) => {
      const palettes: Record<string, string[] | null> = {
        'grad-blue': ['#4ea8ff', '#7f88ff'],
        sunset: ['#ff9966', '#ff5e62', '#ffa34e'],
        invalid: null,
      };
      return palettes[name] || null;
    }),
    getDefaultPalette: vi.fn().mockReturnValue(['#4ea8ff', '#7f88ff']),
  };
});

import { renderLogo } from '../src/renderer.js';
import { renderInkLogo } from '../src/InkRenderer.js';

describe('lib', () => {
  describe('constants', () => {
    it('should have correct default values', () => {
      expect(DEFAULT_PALETTE).toBe('grad-blue');
      expect(DEFAULT_FONT).toBe('Standard');
      expect(DEFAULT_DIRECTION).toBe('vertical');
    });
  });

  describe('resolveColors', () => {
    it('should return array as-is when palette is already an array', () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff'];
      const result = resolveColors(customColors);
      expect(result).toBe(customColors);
    });

    it('should resolve valid palette names', () => {
      const result = resolveColors('grad-blue');
      expect(result).toEqual(['#4ea8ff', '#7f88ff']);
    });

    it('should resolve sunset palette', () => {
      const result = resolveColors('sunset');
      expect(result).toEqual(['#ff9966', '#ff5e62', '#ffa34e']);
    });

    it('should throw error for invalid palette names', () => {
      expect(() => resolveColors('invalid-palette')).toThrow(
        'Unknown palette: invalid-palette'
      );
    });

    it('should handle empty string palette name', () => {
      expect(() => resolveColors('')).toThrow('Unknown palette:');
    });
  });

  describe('render', () => {
    it('should call renderLogo with default options', async () => {
      await render('TEST');

      expect(renderLogo).toHaveBeenCalledWith(
        'TEST',
        ['#4ea8ff', '#7f88ff'],
        DEFAULT_FONT,
        DEFAULT_DIRECTION
      );
    });

    it('should call renderLogo with custom options', async () => {
      const options: RenderOptions = {
        palette: 'sunset',
        font: 'Big',
        direction: 'horizontal',
      };

      await render('CUSTOM', options);

      expect(renderLogo).toHaveBeenCalledWith(
        'CUSTOM',
        ['#ff9966', '#ff5e62', '#ffa34e'],
        'Big',
        'horizontal'
      );
    });

    it('should handle custom color arrays', async () => {
      const customColors = ['#ff0000', '#00ff00'];
      const options: RenderOptions = {
        palette: customColors,
        direction: 'diagonal',
      };

      await render('COLORS', options);

      expect(renderLogo).toHaveBeenCalledWith(
        'COLORS',
        customColors,
        DEFAULT_FONT,
        'diagonal'
      );
    });

    it('should return the result from renderLogo', async () => {
      const result = await render('TEST');
      expect(result).toBe('mocked ascii art');
    });

    it('should handle partial options', async () => {
      await render('PARTIAL', { palette: 'sunset' });

      expect(renderLogo).toHaveBeenCalledWith(
        'PARTIAL',
        ['#ff9966', '#ff5e62', '#ffa34e'],
        DEFAULT_FONT,
        DEFAULT_DIRECTION
      );
    });
  });

  describe('renderFilled', () => {
    it('should call renderInkLogo with default palette', async () => {
      await renderFilled('TEST');

      expect(renderInkLogo).toHaveBeenCalledWith(
        'TEST',
        ['#4ea8ff', '#7f88ff'],
        { font: undefined, letterSpacing: undefined }
      );
    });

    it('should call renderInkLogo with custom palette', async () => {
      const options: RenderInkOptions = {
        palette: 'sunset',
      };

      await renderFilled('FILLED', options);

      expect(renderInkLogo).toHaveBeenCalledWith(
        'FILLED',
        ['#ff9966', '#ff5e62', '#ffa34e'],
        { font: undefined, letterSpacing: undefined }
      );
    });

    it('should pass font option to renderInkLogo', async () => {
      const options: RenderInkOptions = {
        palette: 'sunset',
        font: 'chrome',
      };

      await renderFilled('FONT', options);

      expect(renderInkLogo).toHaveBeenCalledWith(
        'FONT',
        ['#ff9966', '#ff5e62', '#ffa34e'],
        { font: 'chrome', letterSpacing: undefined }
      );
    });

    it('should pass letterSpacing option to renderInkLogo', async () => {
      const options: RenderInkOptions = {
        palette: 'grad-blue',
        letterSpacing: 3,
      };

      await renderFilled('SPACED', options);

      expect(renderInkLogo).toHaveBeenCalledWith(
        'SPACED',
        ['#4ea8ff', '#7f88ff'],
        { font: undefined, letterSpacing: 3 }
      );
    });

    it('should pass both font and letterSpacing options', async () => {
      const options: RenderInkOptions = {
        palette: 'sunset',
        font: 'shade',
        letterSpacing: 2,
      };

      await renderFilled('COMBO', options);

      expect(renderInkLogo).toHaveBeenCalledWith(
        'COMBO',
        ['#ff9966', '#ff5e62', '#ffa34e'],
        { font: 'shade', letterSpacing: 2 }
      );
    });

    it('should handle custom color arrays', async () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff'];
      const options: RenderInkOptions = {
        palette: customColors,
      };

      await renderFilled('COLORS', options);

      expect(renderInkLogo).toHaveBeenCalledWith('COLORS', customColors, {
        font: undefined,
        letterSpacing: undefined,
      });
    });

    it('should return void (Promise<void>)', async () => {
      const result = await renderFilled('TEST');
      expect(result).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should handle errors from renderLogo', async () => {
      vi.mocked(renderLogo).mockRejectedValueOnce(new Error('Figlet error'));

      await expect(render('TEST')).rejects.toThrow('Figlet error');
    });

    it('should reject negative letter spacing in renderFilled', async () => {
      const options: RenderInkOptions = {
        palette: 'sunset',
        letterSpacing: -1,
      };

      await expect(renderFilled('TEST', options)).rejects.toThrow(
        'Letter spacing must be 0 or greater'
      );
    });

    it('should handle errors from renderInkLogo', async () => {
      vi.mocked(renderInkLogo).mockRejectedValueOnce(new Error('Ink error'));

      await expect(renderFilled('TEST')).rejects.toThrow('Ink error');
    });
  });
});
