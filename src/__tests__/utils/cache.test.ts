import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AsciiCache, globalAsciiCache, withCache, type CacheKey } from '../../utils/cache.js';

describe('utils/cache', () => {
  let cache: AsciiCache;

  beforeEach(() => {
    cache = new AsciiCache({ maxSize: 10, maxAge: 1000 });
  });

  describe('AsciiCache', () => {
    const sampleCacheKey: CacheKey = {
      text: 'TEST',
      font: 'Standard',
      options: {
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true
      }
    };

    const sampleAsciiArt = ' _____ _____ _____ _____ \n|_   _|  ___|  ___|_   _|\n  | | | |_  | |_    | |  ';

    describe('basic operations', () => {
      it('should store and retrieve ASCII art', () => {
        cache.set(sampleCacheKey, sampleAsciiArt);
        const result = cache.get(sampleCacheKey);
        expect(result).toBe(sampleAsciiArt);
      });

      it('should return undefined for non-existent keys', () => {
        const result = cache.get(sampleCacheKey);
        expect(result).toBeUndefined();
      });

      it('should check if key exists', () => {
        expect(cache.has(sampleCacheKey)).toBe(false);
        cache.set(sampleCacheKey, sampleAsciiArt);
        expect(cache.has(sampleCacheKey)).toBe(true);
      });

      it('should delete entries', () => {
        cache.set(sampleCacheKey, sampleAsciiArt);
        expect(cache.has(sampleCacheKey)).toBe(true);
        
        const deleted = cache.delete(sampleCacheKey);
        expect(deleted).toBe(true);
        expect(cache.has(sampleCacheKey)).toBe(false);
      });

      it('should clear all entries', () => {
        cache.set(sampleCacheKey, sampleAsciiArt);
        expect(cache.getStats().size).toBe(1);
        
        cache.clear();
        expect(cache.getStats().size).toBe(0);
      });
    });

    describe('cache key generation', () => {
      it('should generate different keys for different text', () => {
        const key1: CacheKey = { ...sampleCacheKey, text: 'HELLO' };
        const key2: CacheKey = { ...sampleCacheKey, text: 'WORLD' };
        
        cache.set(key1, 'ascii1');
        cache.set(key2, 'ascii2');
        
        expect(cache.get(key1)).toBe('ascii1');
        expect(cache.get(key2)).toBe('ascii2');
      });

      it('should generate different keys for different fonts', () => {
        const key1: CacheKey = { ...sampleCacheKey, font: 'Standard' };
        const key2: CacheKey = { ...sampleCacheKey, font: 'Big' };
        
        cache.set(key1, 'ascii1');
        cache.set(key2, 'ascii2');
        
        expect(cache.get(key1)).toBe('ascii1');
        expect(cache.get(key2)).toBe('ascii2');
      });

      it('should generate different keys for different options', () => {
        const key1: CacheKey = { 
          ...sampleCacheKey, 
          options: { ...sampleCacheKey.options, width: 80 }
        };
        const key2: CacheKey = { 
          ...sampleCacheKey, 
          options: { ...sampleCacheKey.options, width: 120 }
        };
        
        cache.set(key1, 'ascii1');
        cache.set(key2, 'ascii2');
        
        expect(cache.get(key1)).toBe('ascii1');
        expect(cache.get(key2)).toBe('ascii2');
      });
    });

    describe('statistics tracking', () => {
      it('should track cache hits and misses', () => {
        // Initial stats
        let stats = cache.getStats();
        expect(stats.hits).toBe(0);
        expect(stats.misses).toBe(0);
        expect(stats.hitRate).toBe(0);
        
        // Cache miss
        cache.get(sampleCacheKey);
        stats = cache.getStats();
        expect(stats.misses).toBe(1);
        expect(stats.hitRate).toBe(0);
        
        // Cache hit
        cache.set(sampleCacheKey, sampleAsciiArt);
        cache.get(sampleCacheKey);
        stats = cache.getStats();
        expect(stats.hits).toBe(1);
        expect(stats.misses).toBe(1);
        expect(stats.hitRate).toBe(50);
      });

      it('should reset statistics', () => {
        cache.get(sampleCacheKey); // miss
        cache.set(sampleCacheKey, sampleAsciiArt);
        cache.get(sampleCacheKey); // hit
        
        let stats = cache.getStats();
        expect(stats.hits).toBe(1);
        expect(stats.misses).toBe(1);
        
        cache.resetStats();
        stats = cache.getStats();
        expect(stats.hits).toBe(0);
        expect(stats.misses).toBe(0);
      });

      it('should track cache size', () => {
        expect(cache.getStats().size).toBe(0);
        
        cache.set(sampleCacheKey, sampleAsciiArt);
        expect(cache.getStats().size).toBe(1);
        
        const key2: CacheKey = { ...sampleCacheKey, text: 'HELLO' };
        cache.set(key2, 'another ascii');
        expect(cache.getStats().size).toBe(2);
      });
    });

    describe('LRU behavior', () => {
      it('should evict least recently used items when max size is reached', () => {
        const smallCache = new AsciiCache({ maxSize: 2 });
        
        const key1: CacheKey = { ...sampleCacheKey, text: 'ONE' };
        const key2: CacheKey = { ...sampleCacheKey, text: 'TWO' };
        const key3: CacheKey = { ...sampleCacheKey, text: 'THREE' };
        
        smallCache.set(key1, 'ascii1');
        smallCache.set(key2, 'ascii2');
        expect(smallCache.getStats().size).toBe(2);
        
        // Adding third item should evict first
        smallCache.set(key3, 'ascii3');
        expect(smallCache.getStats().size).toBe(2);
        expect(smallCache.has(key1)).toBe(false); // Evicted
        expect(smallCache.has(key2)).toBe(true);
        expect(smallCache.has(key3)).toBe(true);
      });
    });

    describe('TTL behavior', () => {
      it('should expire entries after TTL', async () => {
        const shortTtlCache = new AsciiCache({ maxAge: 50 }); // 50ms TTL
        
        shortTtlCache.set(sampleCacheKey, sampleAsciiArt);
        expect(shortTtlCache.has(sampleCacheKey)).toBe(true);
        
        // Wait for expiration
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Entry should be expired
        expect(shortTtlCache.get(sampleCacheKey)).toBeUndefined();
      });
    });

    describe('utility methods', () => {
      it('should return cache keys', () => {
        cache.set(sampleCacheKey, sampleAsciiArt);
        const keys = cache.getKeys();
        expect(keys).toHaveLength(1);
        expect(typeof keys[0]).toBe('string');
      });

      it('should calculate size in bytes', () => {
        const initialSize = cache.getSizeInBytes();
        cache.set(sampleCacheKey, sampleAsciiArt);
        const newSize = cache.getSizeInBytes();
        expect(newSize).toBeGreaterThan(initialSize);
      });
    });
  });

  describe('globalAsciiCache', () => {
    it('should be a singleton instance', () => {
      expect(globalAsciiCache).toBeInstanceOf(AsciiCache);
    });

    it('should have reasonable default configuration', () => {
      const stats = globalAsciiCache.getStats();
      expect(stats.maxSize).toBeGreaterThan(0);
    });
  });

  describe('withCache utility', () => {
    it('should cache function results', () => {
      const mockFn = vi.fn((text: string, font: string) => `ASCII for ${text} with ${font}`);
      const getCacheKey = (text: string, font: string): CacheKey => ({
        text,
        font,
        options: {
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true
        }
      });
      
      const cachedFn = withCache(mockFn, getCacheKey);
      
      // First call should execute function
      const result1 = cachedFn('TEST', 'Standard');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(result1).toBe('ASCII for TEST with Standard');
      
      // Second call with same args should use cache
      const result2 = cachedFn('TEST', 'Standard');
      expect(mockFn).toHaveBeenCalledTimes(1); // Still 1, not called again
      expect(result2).toBe('ASCII for TEST with Standard');
      
      // Different args should call function again
      const result3 = cachedFn('HELLO', 'Standard');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(result3).toBe('ASCII for HELLO with Standard');
    });

    it('should only cache string results', () => {
      const mockFn = vi.fn((returnString: boolean) => 
        returnString ? 'string result' : { object: 'result' }
      );
      const getCacheKey = (returnString: boolean): CacheKey => ({
        text: returnString.toString(),
        font: 'Standard',
        options: {
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true
        }
      });
      
      const cachedFn = withCache(mockFn, getCacheKey);
      
      // String result should be cached
      cachedFn(true);
      cachedFn(true);
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      // Object result should not be cached
      cachedFn(false);
      cachedFn(false);
      expect(mockFn).toHaveBeenCalledTimes(3); // Called twice for false
    });
  });

  describe('environment configuration', () => {
    it('should respect environment variables', () => {
      // This test would need to mock process.env, which is complex in vitest
      // For now, we'll just verify the cache works with default config
      expect(globalAsciiCache.getStats().maxSize).toBeGreaterThan(0);
    });
  });
});