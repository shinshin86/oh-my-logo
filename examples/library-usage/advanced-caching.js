/**
 * Advanced Caching Examples
 * Demonstrates sophisticated caching strategies and optimization
 */

import { 
  render, 
  renderFilled, 
  cacheManager,
  getPerformanceStats 
} from 'oh-my-logo';

console.log('🧠 Advanced Caching Examples\n');

// Example 1: Cache warming strategy
console.log('1. Cache Warming Strategy:');

async function warmCache() {
  console.log('Warming cache with common patterns...');
  const startTime = performance.now();
  
  const commonTexts = ['LOGO', 'APP', 'API', 'WEB', 'DEV'];
  const commonPalettes = ['sunset', 'ocean', 'fire'];
  const commonFonts = ['Standard', 'Big'];
  
  let warmedCount = 0;
  
  for (const text of commonTexts) {
    for (const palette of commonPalettes) {
      for (const font of commonFonts) {
        try {
          await render(text, { palette, font });
          warmedCount++;
        } catch (error) {
          // Skip if font not available
        }
      }
    }
  }
  
  const endTime = performance.now();
  console.log(`Warmed ${warmedCount} patterns in ${(endTime - startTime).toFixed(2)}ms`);
}

await warmCache();

// Show cache statistics after warming
const warmedStats = getPerformanceStats();
console.log(`Cache entries after warming: ${warmedStats.cacheStats.figlet.size}`);
console.log('\n' + '='.repeat(50) + '\n');

// Example 2: Cache hit rate demonstration
console.log('2. Cache Hit Rate Demonstration:');

// First render (cache miss)
console.time('First render (cache miss)');
await render('CACHE', { palette: 'purple' });
console.timeEnd('First render (cache miss)');

// Second render (cache hit)
console.time('Second render (cache hit)');
await render('CACHE', { palette: 'purple' });
console.timeEnd('Second render (cache hit)');

// Show the performance difference
const hitRateStats = getPerformanceStats();
console.log(`Current hit rate: ${(hitRateStats.totalHitRate * 100).toFixed(1)}%`);
console.log('\n' + '='.repeat(50) + '\n');

// Example 3: Memory-efficient batch processing
console.log('3. Memory-Efficient Batch Processing:');

async function processBatch(texts, options = {}) {
  console.log(`Processing batch of ${texts.length} texts...`);
  const results = [];
  
  // Process in smaller chunks to manage memory
  const chunkSize = 5;
  for (let i = 0; i < texts.length; i += chunkSize) {
    const chunk = texts.slice(i, i + chunkSize);
    
    const chunkResults = await Promise.all(
      chunk.map(text => render(text, options))
    );
    
    results.push(...chunkResults);
    
    // Show memory usage after each chunk
    const stats = getPerformanceStats();
    console.log(`Chunk ${Math.floor(i/chunkSize) + 1}: ${stats.memoryUsageMB.toFixed(2)}MB`);
  }
  
  return results;
}

const batchTexts = ['BATCH1', 'BATCH2', 'BATCH3', 'BATCH4', 'BATCH5', 'BATCH6', 'BATCH7'];
await processBatch(batchTexts, { palette: 'mint' });

console.log('\n' + '='.repeat(50) + '\n');

// Example 4: Smart cache management
console.log('4. Smart Cache Management:');

class SmartCacheManager {
  constructor() {
    this.accessPatterns = new Map();
  }
  
  async renderWithTracking(text, options = {}) {
    const key = `${text}:${JSON.stringify(options)}`;
    
    // Track access patterns
    this.accessPatterns.set(key, (this.accessPatterns.get(key) || 0) + 1);
    
    const startTime = performance.now();
    const result = await render(text, options);
    const endTime = performance.now();
    
    return {
      result,
      renderTime: endTime - startTime,
      accessCount: this.accessPatterns.get(key)
    };
  }
  
  getPopularPatterns(limit = 5) {
    return Array.from(this.accessPatterns.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([pattern, count]) => ({ pattern, count }));
  }
  
  optimizeCache() {
    const popular = this.getPopularPatterns();
    console.log('Most popular patterns:');
    popular.forEach(({ pattern, count }) => {
      console.log(`• ${pattern} (${count} accesses)`);
    });
  }
}

const smartCache = new SmartCacheManager();

// Simulate various access patterns
await smartCache.renderWithTracking('POPULAR', { palette: 'sunset' });
await smartCache.renderWithTracking('POPULAR', { palette: 'sunset' }); // Repeat
await smartCache.renderWithTracking('POPULAR', { palette: 'sunset' }); // Repeat
await smartCache.renderWithTracking('RARE', { palette: 'ocean' });
await smartCache.renderWithTracking('MEDIUM', { palette: 'fire' });
await smartCache.renderWithTracking('MEDIUM', { palette: 'fire' }); // Repeat

smartCache.optimizeCache();

console.log('\n' + '='.repeat(50) + '\n');

// Example 5: Cache persistence simulation
console.log('5. Cache Persistence Simulation:');

function simulateCachePersistence() {
  const stats = getPerformanceStats();
  
  // Simulate saving cache state
  const cacheSnapshot = {
    timestamp: Date.now(),
    stats: stats.cacheStats,
    hotKeys: stats.hotKeys,
    memoryUsage: stats.memoryUsageMB
  };
  
  console.log('Cache snapshot created:');
  console.log(`• Timestamp: ${new Date(cacheSnapshot.timestamp).toISOString()}`);
  console.log(`• Figlet entries: ${cacheSnapshot.stats.figlet.size}`);
  console.log(`• Gradient entries: ${cacheSnapshot.stats.gradient.size}`);
  console.log(`• Memory usage: ${cacheSnapshot.memoryUsage.toFixed(2)}MB`);
  
  return cacheSnapshot;
}

const snapshot = simulateCachePersistence();

console.log('\n' + '='.repeat(50) + '\n');

// Example 6: Performance recommendations
console.log('6. Performance Recommendations:');

function generateRecommendations() {
  const stats = getPerformanceStats();
  const recommendations = [];
  
  if (stats.totalHitRate < 0.7) {
    recommendations.push('• Consider preloading common patterns to improve cache hit rate');
  }
  
  if (stats.memoryUsageMB > 20) {
    recommendations.push('• Memory usage is high, consider clearing unused caches');
  }
  
  if (stats.cacheStats.figlet.size > 200) {
    recommendations.push('• Figlet cache is large, consider reducing cache size');
  }
  
  if (stats.totalHitRate > 0.9) {
    recommendations.push('• Excellent cache performance! Consider increasing cache size for even better performance');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('• Cache performance is optimal');
  }
  
  return recommendations;
}

const recommendations = generateRecommendations();
console.log('Performance Recommendations:');
recommendations.forEach(rec => console.log(rec));

console.log('\n✅ Advanced caching examples completed!');