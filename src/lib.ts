import { renderLogo, clearRenderCache } from './renderer.js';
import { renderInkLogo, clearInkCache } from './InkRenderer.js';
import { 
  PALETTES, 
  type PaletteName, 
  resolvePalette, 
  getPaletteNames, 
  getDefaultPalette,
  getPalettePreview 
} from './palettes.js';
import type { Fonts } from 'figlet';

export const DEFAULT_PALETTE: PaletteName = 'grad-blue';
export const DEFAULT_FONT = 'Standard';
export const DEFAULT_DIRECTION = 'vertical';

export interface RenderOptions {
  palette?: PaletteName | string[] | string;
  font?: Fonts | string;
  direction?: 'vertical' | 'horizontal' | 'diagonal';
}

export interface RenderInkOptions {
  palette?: PaletteName | string[] | string;
}

// Cache for resolved colors to avoid repeated palette lookups
const colorCache = new Map<string, string[]>();

export function resolveColors(palette: PaletteName | string[] | string): string[] {
  if (Array.isArray(palette)) {
    return palette;
  }
  
  // Check cache first
  if (colorCache.has(palette)) {
    return colorCache.get(palette)!;
  }
  
  const colors = resolvePalette(palette);
  if (!colors) {
    throw new Error(`Unknown palette: ${palette}`);
  }
  
  // Cache the result
  colorCache.set(palette, colors);
  
  // Limit cache size
  if (colorCache.size > 50) {
    const firstKey = colorCache.keys().next().value;
    colorCache.delete(firstKey);
  }
  
  return colors;
}

export async function render(text: string, options: RenderOptions = {}): Promise<string> {
  const {
    palette = DEFAULT_PALETTE,
    font = DEFAULT_FONT,
    direction = DEFAULT_DIRECTION
  } = options;

  const paletteColors = resolveColors(palette);
  
  // Use synchronous rendering for better performance
  return renderLogo(text, paletteColors, font, direction);
}

export async function renderFilled(text: string, options: RenderInkOptions = {}): Promise<void> {
  const { palette = DEFAULT_PALETTE } = options;
  const paletteColors = resolveColors(palette);
  return renderInkLogo(text, paletteColors);
}

// Performance utilities
export function clearAllCaches(): void {
  clearRenderCache();
  clearInkCache();
  colorCache.clear();
}

export function getPerformanceStats(): {
  colorCacheSize: number;
  renderCacheStats?: any;
} {
  return {
    colorCacheSize: colorCache.size,
    // Add render cache stats if needed for debugging
  };
}

export {
  PALETTES,
  type PaletteName,
  resolvePalette,
  getPaletteNames,
  getDefaultPalette,
  getPalettePreview,
  clearRenderCache,
  clearInkCache
};

export type { Fonts };