/**
 * Centralized cache manager for ASCII art generation
 * Manages multiple specialized caches with memory limits and performance monitoring
 */

import { LRUCache, type CacheStats } from './LRUCache.js';

export interface CacheConfig {
  figletCacheSize: number;
  gradientCacheSize: number;
  paletteCacheSize: number;
  inkCacheSize: number;
  maxMemoryMB: number;
}

export interface GlobalCacheStats {
  figlet: CacheStats;
  gradient: CacheStats;
  palette: CacheStats;
  ink: CacheStats;
  totalMemoryUsage: number;
  totalHitRate: number;
}

class CacheManager {
  private figletCache: LRUCache<string>;
  private gradientCache: LRUCache<any>;
  private paletteCache: LRUCache<string[]>;
  private inkCache: LRUCache<Promise<void>>;
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      figletCacheSize: 500,
      gradientCacheSize: 200,
      paletteCacheSize: 50,
      inkCacheSize: 100,
      maxMemoryMB: 50,
      ...config
    };

    this.figletCache = new LRUCache<string>(this.config.figletCacheSize);
    this.gradientCache = new LRUCache<any>(this.config.gradientCacheSize);
    this.paletteCache = new LRUCache<string[]>(this.config.paletteCacheSize);
    this.inkCache = new LRUCache<Promise<void>>(this.config.inkCacheSize);

    // Start memory monitoring
    this.startMemoryMonitoring();
  }

  // Figlet cache methods
  getFigletArt(key: string): string | null {
    return this.figletCache.get(key);
  }

  setFigletArt(key: string, art: string): void {
    this.figletCache.set(key, art);
  }

  // Gradient cache methods
  getGradient(key: string): any | null {
    return this.gradientCache.get(key);
  }

  setGradient(key: string, gradient: any): void {
    this.gradientCache.set(key, gradient);
  }

  // Palette cache methods
  getPalette(key: string): string[] | null {
    return this.paletteCache.get(key);
  }

  setPalette(key: string, palette: string[]): void {
    this.paletteCache.set(key, palette);
  }

  // Ink cache methods
  getInkRender(key: string): Promise<void> | null {
    return this.inkCache.get(key);
  }

  setInkRender(key: string, promise: Promise<void>): void {
    this.inkCache.set(key, promise);
  }

  // Cache management
  clearAll(): void {
    this.figletCache.clear();
    this.gradientCache.clear();
    this.paletteCache.clear();
    this.inkCache.clear();
  }

  clearFigletCache(): void {
    this.figletCache.clear();
  }

  clearGradientCache(): void {
    this.gradientCache.clear();
  }

  clearPaletteCache(): void {
    this.paletteCache.clear();
  }

  clearInkCache(): void {
    this.inkCache.clear();
  }

  // Statistics and monitoring
  getStats(): GlobalCacheStats {
    const figletStats = this.figletCache.getStats();
    const gradientStats = this.gradientCache.getStats();
    const paletteStats = this.paletteCache.getStats();
    const inkStats = this.inkCache.getStats();

    const totalHits = figletStats.hits + gradientStats.hits + paletteStats.hits + inkStats.hits;
    const totalRequests = totalHits + figletStats.misses + gradientStats.misses + paletteStats.misses + inkStats.misses;

    return {
      figlet: figletStats,
      gradient: gradientStats,
      palette: paletteStats,
      ink: inkStats,
      totalMemoryUsage: figletStats.memoryUsage + gradientStats.memoryUsage + paletteStats.memoryUsage + inkStats.memoryUsage,
      totalHitRate: totalRequests > 0 ? totalHits / totalRequests : 0
    };
  }

  getHotKeys(): {
    figlet: Array<{ key: string; accessCount: number }>;
    gradient: Array<{ key: string; accessCount: number }>;
    palette: Array<{ key: string; accessCount: number }>;
    ink: Array<{ key: string; accessCount: number }>;
  } {
    return {
      figlet: this.figletCache.getHotKeys(5),
      gradient: this.gradientCache.getHotKeys(5),
      palette: this.paletteCache.getHotKeys(5),
      ink: this.inkCache.getHotKeys(5)
    };
  }

  // Memory management
  private startMemoryMonitoring(): void {
    // Check memory usage every 30 seconds
    setInterval(() => {
      this.checkMemoryUsage();
    }, 30000);
  }

  private checkMemoryUsage(): void {
    const stats = this.getStats();
    const memoryUsageMB = stats.totalMemoryUsage / (1024 * 1024);

    if (memoryUsageMB > this.config.maxMemoryMB) {
      console.warn(`Cache memory usage (${memoryUsageMB.toFixed(2)}MB) exceeds limit (${this.config.maxMemoryMB}MB). Clearing least used caches.`);
      
      // Clear caches in order of least hit rate
      const caches = [
        { name: 'ink', stats: stats.ink, clear: () => this.clearInkCache() },
        { name: 'gradient', stats: stats.gradient, clear: () => this.clearGradientCache() },
        { name: 'palette', stats: stats.palette, clear: () => this.clearPaletteCache() },
        { name: 'figlet', stats: stats.figlet, clear: () => this.clearFigletCache() }
      ].sort((a, b) => a.stats.hitRate - b.stats.hitRate);

      // Clear the cache with lowest hit rate
      if (caches.length > 0) {
        caches[0].clear();
        console.log(`Cleared ${caches[0].name} cache (hit rate: ${(caches[0].stats.hitRate * 100).toFixed(1)}%)`);
      }
    }
  }

  // Performance optimization methods
  preloadCommonPatterns(): void {
    // Preload common text patterns
    const commonTexts = ['HELLO', 'WORLD', 'LOGO', 'DEMO', 'TEST', 'APP', 'API', 'WEB'];
    const commonFonts = ['Standard', 'Big', 'Small'];
    
    console.log('Preloading common patterns...');
    
    // This would be called during app initialization
    // The actual preloading would happen when these patterns are first used
  }

  optimizeForFrequentPatterns(): void {
    const hotKeys = this.getHotKeys();
    
    // Log most frequently accessed patterns for optimization insights
    console.log('Most accessed patterns:', {
      figlet: hotKeys.figlet.slice(0, 3),
      gradient: hotKeys.gradient.slice(0, 3),
      palette: hotKeys.palette.slice(0, 3)
    });
  }
}

// Singleton instance
export const cacheManager = new CacheManager();

// Export for testing and advanced usage
export { CacheManager };