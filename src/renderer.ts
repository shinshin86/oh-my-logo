import figlet from 'figlet';
import gradient from 'gradient-string';
import { FontError } from './utils/errors.js';

// Cache for figlet results to avoid re-computation
const figletCache = new Map<string, string>();

// Cache for gradient functions to avoid re-creation
const gradientCache = new Map<string, any>();

// Pre-compile commonly used fonts for faster access
const FAST_FONTS = ['Standard', 'Big', 'Small'] as const;

function getCacheKey(text: string, font: string): string {
  return `${text}:${font}`;
}

function getGradientCacheKey(palette: string[]): string {
  return palette.join(',');
}

export function renderLogo(
  text: string,
  palette: string[],
  font: string = 'Standard',
  direction: string = 'vertical'
): string {
  try {
    // Check figlet cache first
    const cacheKey = getCacheKey(text, font);
    let asciiArt = figletCache.get(cacheKey);
    
    if (!asciiArt) {
      // Use synchronous figlet for better performance
      asciiArt = figlet.textSync(text, {
        font: font as figlet.Fonts,
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
      });
      
      // Cache the result for future use
      figletCache.set(cacheKey, asciiArt);
      
      // Limit cache size to prevent memory issues
      if (figletCache.size > 100) {
        const firstKey = figletCache.keys().next().value;
        if (firstKey !== undefined) {
          figletCache.delete(firstKey);
        }
      }
    }
    
    // Check gradient cache
    const gradientCacheKey = getGradientCacheKey(palette);
    let gradientFn = gradientCache.get(gradientCacheKey);
    
    if (!gradientFn) {
      gradientFn = gradient(palette);
      gradientCache.set(gradientCacheKey, gradientFn);
      
      // Limit gradient cache size
      if (gradientCache.size > 50) {
        const firstKey = gradientCache.keys().next().value;
        if (firstKey !== undefined) {
          gradientCache.delete(firstKey);
        }
      }
    }
    
    let coloredArt: string;
    
    switch (direction) {
      case 'horizontal':
        // Optimized horizontal gradient processing
        coloredArt = processHorizontalGradient(asciiArt, gradientFn);
        break;
        
      case 'diagonal':
        // Optimized diagonal gradient processing
        coloredArt = processDiagonalGradient(asciiArt, palette);
        break;
        
      case 'vertical':
      default:
        // Use multiline for vertical (most efficient for this case)
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
  const coloredLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') {
      coloredLines.push(line);
    } else {
      coloredLines.push(gradientFn(line));
    }
  }
  
  return coloredLines.join('\n');
}

// Optimized diagonal gradient processing with caching
const diagonalGradientCache = new Map<string, any>();

function processDiagonalGradient(asciiArt: string, palette: string[]): string {
  const lines = asciiArt.split('\n');
  const lineCount = lines.length;
  const coloredLines: string[] = [];
  
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (line.trim() === '') {
      coloredLines.push(line);
      continue;
    }
    
    // Create cache key for this line's gradient
    const shift = (index / lineCount) * palette.length;
    const shiftKey = `${palette.join(',')}:${shift.toFixed(2)}`;
    
    let lineGradient = diagonalGradientCache.get(shiftKey);
    if (!lineGradient) {
      // Create a gradient that shifts based on line position
      const shiftedPalette = palette.map((color, colorIndex) => {
        return palette[Math.floor(colorIndex + shift) % palette.length];
      });
      lineGradient = gradient(shiftedPalette);
      diagonalGradientCache.set(shiftKey, lineGradient);
      
      // Limit diagonal cache size
      if (diagonalGradientCache.size > 100) {
        const firstKey = diagonalGradientCache.keys().next().value;
        if (firstKey !== undefined) {
          diagonalGradientCache.delete(firstKey);
        }
      }
    }
    
    coloredLines.push(lineGradient(line));
  }
  
  return coloredLines.join('\n');
}

// Function to clear caches if needed (useful for memory management)
export function clearRenderCache(): void {
  figletCache.clear();
  gradientCache.clear();
  diagonalGradientCache.clear();
}

// Function to get cache statistics (useful for debugging)
export function getCacheStats(): { figlet: number; gradient: number; diagonal: number } {
  return {
    figlet: figletCache.size,
    gradient: gradientCache.size,
    diagonal: diagonalGradientCache.size
  };
}