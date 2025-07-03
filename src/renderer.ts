import figlet from 'figlet';
import gradient from 'gradient-string';
import { FontError } from './utils/errors.js';
import { cacheManager } from './cache/CacheManager.js';

// Performance optimized cache keys
function getFigletCacheKey(text: string, font: string): string {
  return `${text}:${font}`;
}

function getGradientCacheKey(palette: string[]): string {
  return palette.join(',');
}

function getDiagonalCacheKey(palette: string[], shift: number): string {
  return `${palette.join(',')}:${shift.toFixed(2)}`;
}

export function renderLogo(
  text: string,
  palette: string[],
  font: string = 'Standard',
  direction: string = 'vertical'
): string {
  try {
    // Check figlet cache first
    const figletKey = getFigletCacheKey(text, font);
    let asciiArt = cacheManager.getFigletArt(figletKey);
    
    if (!asciiArt) {
      // Generate ASCII art
      asciiArt = figlet.textSync(text, {
        font: font as figlet.Fonts,
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
      });
      
      // Cache the result
      cacheManager.setFigletArt(figletKey, asciiArt);
    }
    
    // Check gradient cache
    const gradientKey = getGradientCacheKey(palette);
    let gradientFn = cacheManager.getGradient(gradientKey);
    
    if (!gradientFn) {
      gradientFn = gradient(palette);
      cacheManager.setGradient(gradientKey, gradientFn);
    }
    
    let coloredArt: string;
    
    switch (direction) {
      case 'horizontal':
        coloredArt = processHorizontalGradient(asciiArt, gradientFn);
        break;
        
      case 'diagonal':
        coloredArt = processDiagonalGradient(asciiArt, palette);
        break;
        
      case 'vertical':
      default:
        coloredArt = gradientFn.multiline(asciiArt);
        break;
    }
    
    return coloredArt;
  } catch (error) {
    if (error instanceof Error && error.message.includes('font')) {
      throw new FontError(font);
    }
    throw error;
  }
}

// Optimized horizontal gradient processing
function processHorizontalGradient(asciiArt: string, gradientFn: any): string {
  const lines = asciiArt.split('\n');
  const coloredLines: string[] = new Array(lines.length);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    coloredLines[i] = line.trim() === '' ? line : gradientFn(line);
  }
  
  return coloredLines.join('\n');
}

// Optimized diagonal gradient processing with advanced caching
function processDiagonalGradient(asciiArt: string, palette: string[]): string {
  const lines = asciiArt.split('\n');
  const lineCount = lines.length;
  const coloredLines: string[] = new Array(lines.length);
  
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (line.trim() === '') {
      coloredLines[index] = line;
      continue;
    }
    
    // Create cache key for this line's gradient
    const shift = (index / lineCount) * palette.length;
    const diagonalKey = getDiagonalCacheKey(palette, shift);
    
    let lineGradient = cacheManager.getGradient(diagonalKey);
    if (!lineGradient) {
      // Create a gradient that shifts based on line position
      const shiftedPalette = palette.map((_, colorIndex) => {
        return palette[Math.floor(colorIndex + shift) % palette.length];
      });
      lineGradient = gradient(shiftedPalette);
      cacheManager.setGradient(diagonalKey, lineGradient);
    }
    
    coloredLines[index] = lineGradient(line);
  }
  
  return coloredLines.join('\n');
}

// Export cache management functions
export function clearRenderCache(): void {
  cacheManager.clearFigletCache();
  cacheManager.clearGradientCache();
}

export function getCacheStats() {
  const stats = cacheManager.getStats();
  return {
    figlet: stats.figlet.size,
    gradient: stats.gradient.size,
    hitRate: stats.totalHitRate,
    memoryUsage: stats.totalMemoryUsage
  };
}