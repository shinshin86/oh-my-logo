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
import { cacheManager } from './cache/CacheManager.js';
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

export function resolveColors(palette: PaletteName | string[] | string): string[] {
  if (Array.isArray(palette)) {
    return palette;
  }
  
  const colors = resolvePalette(palette);
  if (!colors) {
    throw new Error(`Unknown palette: ${palette}`);
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

// Performance utilities with enhanced caching
export function clearAllCaches(): void {
  cacheManager.clearAll();
}

export function getPerformanceStats() {
  const stats = cacheManager.getStats();
  const hotKeys = cacheManager.getHotKeys();
  
  return {
    cacheStats: stats,
    hotKeys,
    memoryUsageMB: stats.totalMemoryUsage / (1024 * 1024),
    totalHitRate: stats.totalHitRate,
    recommendations: generatePerformanceRecommendations(stats)
  };
}

function generatePerformanceRecommendations(stats: any): string[] {
  const recommendations: string[] = [];
  
  if (stats.totalHitRate < 0.7) {
    recommendations.push('Consider preloading common patterns to improve cache hit rate');
  }
  
  if (stats.totalMemoryUsage > 50 * 1024 * 1024) { // 50MB
    recommendations.push('Memory usage is high, consider clearing unused caches');
  }
  
  if (stats.figlet.size > 400) {
    recommendations.push('Figlet cache is large, consider reducing cache size or clearing old entries');
  }
  
  return recommendations;
}

// Preloading utilities for common patterns
export async function preloadCommonPatterns(): Promise<void> {
  const commonTexts = ['HELLO', 'WORLD', 'LOGO', 'DEMO', 'TEST', 'APP', 'API', 'WEB'];
  const commonPalettes: PaletteName[] = ['grad-blue', 'sunset', 'ocean', 'fire', 'matrix'];
  const commonFonts = ['Standard', 'Big'];
  
  console.log('Preloading common ASCII patterns...');
  
  const startTime = performance.now();
  let preloadCount = 0;
  
  for (const text of commonTexts) {
    for (const palette of commonPalettes) {
      for (const font of commonFonts) {
        try {
          await render(text, { palette, font });
          preloadCount++;
        } catch (error) {
          // Skip if font not available
        }
      }
    }
  }
  
  const endTime = performance.now();
  console.log(`Preloaded ${preloadCount} patterns in ${(endTime - startTime).toFixed(2)}ms`);
}

export {
  PALETTES,
  type PaletteName,
  resolvePalette,
  getPaletteNames,
  getDefaultPalette,
  getPalettePreview,
  clearRenderCache,
  clearInkCache,
  cacheManager
};

export type { Fonts };