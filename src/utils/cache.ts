import { LRUCache } from 'lru-cache';

export interface CacheKey {
  text: string;
  font: string;
  options: {
    horizontalLayout: string;
    verticalLayout: string;
    width: number;
    whitespaceBreak: boolean;
  };
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  hitRate: number;
}

/**
 * ASCII Art Cache Manager
 * 
 * Provides LRU caching for figlet ASCII art generation to improve performance
 * by avoiding regeneration of identical text/font combinations.
 */
export class AsciiCache {
  private cache: LRUCache<string, string>;
  private stats = {
    hits: 0,
    misses: 0
  };

  constructor(options: {
    maxSize?: number;
    maxAge?: number;
    updateAgeOnGet?: boolean;
  } = {}) {
    const {
      maxSize = 1000,           // Store up to 1000 ASCII art entries
      maxAge = 1000 * 60 * 30,  // 30 minutes TTL
      updateAgeOnGet = true     // Reset TTL on access
    } = options;

    this.cache = new LRUCache({
      max: maxSize,
      ttl: maxAge,
      updateAgeOnGet,
      // Calculate memory usage based on string length
      sizeCalculation: (value: string) => value.length,
      // Optional: Set max memory usage (in characters)
      maxSize: maxSize * 1000, // Roughly 1MB for 1000 entries
    });
  }

  /**
   * Generate a cache key from text, font, and figlet options
   */
  private generateKey(cacheKey: CacheKey): string {
    return JSON.stringify({
      text: cacheKey.text,
      font: cacheKey.font,
      options: cacheKey.options
    });
  }

  /**
   * Get ASCII art from cache
   */
  get(cacheKey: CacheKey): string | undefined {
    const key = this.generateKey(cacheKey);
    const result = this.cache.get(key);
    
    if (result !== undefined) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    
    return result;
  }

  /**
   * Store ASCII art in cache
   */
  set(cacheKey: CacheKey, asciiArt: string): void {
    const key = this.generateKey(cacheKey);
    this.cache.set(key, asciiArt);
  }

  /**
   * Check if a cache entry exists
   */
  has(cacheKey: CacheKey): boolean {
    const key = this.generateKey(cacheKey);
    return this.cache.has(key);
  }

  /**
   * Remove a specific cache entry
   */
  delete(cacheKey: CacheKey): boolean {
    const key = this.generateKey(cacheKey);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      maxSize: this.cache.max || 0,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0
    };
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSizeInBytes(): number {
    return this.cache.calculatedSize || 0;
  }

  /**
   * Prune expired entries manually
   */
  prune(): void {
    this.cache.purgeStale();
  }

  /**
   * Get all cache keys (for debugging)
   */
  getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
  }
}

// Global cache instance with environment-based configuration
const getCacheConfig = () => {
  const maxSize = parseInt(process.env.OHMYLOGO_CACHE_SIZE || '1000', 10);
  const maxAge = parseInt(process.env.OHMYLOGO_CACHE_TTL || '1800000', 10); // 30 minutes default
  
  return {
    maxSize: Math.max(10, Math.min(maxSize, 10000)), // Clamp between 10-10000
    maxAge: Math.max(60000, Math.min(maxAge, 3600000)), // Clamp between 1min-1hour
    updateAgeOnGet: true
  };
};

export const globalAsciiCache = new AsciiCache(getCacheConfig());

/**
 * Utility function to create cache-aware ASCII generation
 */
export function withCache<T extends any[], R>(
  fn: (...args: T) => R,
  getCacheKey: (...args: T) => CacheKey
) {
  return (...args: T): R => {
    const cacheKey = getCacheKey(...args);
    
    // Try to get from cache first
    const cached = globalAsciiCache.get(cacheKey);
    if (cached !== undefined) {
      return cached as R;
    }
    
    // Generate new result
    const result = fn(...args);
    
    // Store in cache if it's a string (ASCII art)
    if (typeof result === 'string') {
      globalAsciiCache.set(cacheKey, result);
    }
    
    return result;
  };
}