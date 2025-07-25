import { describe, it, expect } from 'vitest';
import {
  PALETTES,
  resolvePalette,
  getPaletteNames,
  getDefaultPalette,
  getPalettePreview,
  type PaletteName
} from '../src/palettes.js';

describe('palettes', () => {
  describe('PALETTES', () => {
    it('should contain all expected palettes', () => {
      const expectedPalettes = [
        'grad-blue', 'sunset', 'dawn', 'nebula', 'mono',
        'ocean', 'fire', 'forest', 'gold', 'purple',
        'mint', 'coral', 'matrix'
      ];
      
      expect(Object.keys(PALETTES)).toEqual(expectedPalettes);
    });

    it('should have valid hex colors for each palette', () => {
      Object.entries(PALETTES).forEach(([name, colors]) => {
        expect(colors.length).toBeGreaterThan(0);
        colors.forEach(color => {
          expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
      });
    });
  });

  describe('resolvePalette', () => {
    it('should return colors for valid palette name', () => {
      const colors = resolvePalette('sunset');
      expect(colors).toEqual(['#ff9966', '#ff5e62', '#ffa34e']);
    });

    it('should return null for invalid palette name', () => {
      const colors = resolvePalette('invalid-palette');
      expect(colors).toBeNull();
    });

    it('should return a copy of the palette array', () => {
      const colors = resolvePalette('grad-blue');
      expect(colors).not.toBe(PALETTES['grad-blue']);
      expect(colors).toEqual(PALETTES['grad-blue']);
    });

    it('should handle all palette names correctly', () => {
      Object.keys(PALETTES).forEach((name) => {
        const colors = resolvePalette(name);
        expect(colors).toEqual([...PALETTES[name as PaletteName]]);
      });
    });
  });

  describe('getPaletteNames', () => {
    it('should return all palette names', () => {
      const names = getPaletteNames();
      expect(names).toEqual(Object.keys(PALETTES));
      expect(names).toHaveLength(13);
    });

    it('should return palette names in correct order', () => {
      const names = getPaletteNames();
      const expectedOrder = [
        'grad-blue', 'sunset', 'dawn', 'nebula', 'mono',
        'ocean', 'fire', 'forest', 'gold', 'purple',
        'mint', 'coral', 'matrix'
      ];
      expect(names).toEqual(expectedOrder);
    });
  });

  describe('getDefaultPalette', () => {
    it('should return grad-blue palette colors', () => {
      const defaultColors = getDefaultPalette();
      expect(defaultColors).toEqual(['#4ea8ff', '#7f88ff']);
    });

    it('should return a copy of the default palette', () => {
      const defaultColors = getDefaultPalette();
      expect(defaultColors).not.toBe(PALETTES['grad-blue']);
      expect(defaultColors).toEqual(PALETTES['grad-blue']);
    });
  });

  describe('getPalettePreview', () => {
    it('should return formatted preview for single color palette', () => {
      const preview = getPalettePreview('mono');
      expect(preview).toBe('#f07178 → #f07178');
    });

    it('should return formatted preview for multi-color palette', () => {
      const preview = getPalettePreview('sunset');
      expect(preview).toBe('#ff9966 → #ff5e62 → #ffa34e');
    });

    it('should work for all palettes', () => {
      Object.keys(PALETTES).forEach((name) => {
        const preview = getPalettePreview(name as PaletteName);
        const expectedColors = PALETTES[name as PaletteName];
        const expectedPreview = expectedColors.join(' → ');
        expect(preview).toBe(expectedPreview);
      });
    });
  });
});