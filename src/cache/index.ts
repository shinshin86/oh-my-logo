/**
 * Cache module exports
 * Provides easy access to all caching functionality
 */

export { LRUCache, type CacheNode, type CacheStats } from './LRUCache.js';
export { CacheManager, cacheManager, type CacheConfig, type GlobalCacheStats } from './CacheManager.js';

// Convenience functions for direct cache access
export const cache = {
  // Quick access to cache manager
  manager: () => import('./CacheManager.js').then(m => m.cacheManager),
  
  // Performance utilities
  getStats: async () => (await import('./CacheManager.js')).cacheManager.getStats(),
  clearAll: async () => (await import('./CacheManager.js')).cacheManager.clearAll(),
  
  // Memory management
  checkMemory: async () => {
    const { cacheManager } = await import('./CacheManager.js');
    const stats = cacheManager.getStats();
    return {
      memoryUsageMB: stats.totalMemoryUsage / (1024 * 1024),
      hitRate: stats.totalHitRate,
      totalEntries: stats.figlet.size + stats.gradient.size + stats.palette.size + stats.ink.size
    };
  }
};