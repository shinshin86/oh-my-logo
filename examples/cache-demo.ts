/**
 * Cache Performance Demo
 * 
 * This example demonstrates the performance benefits of the LRU cache
 * by comparing rendering times with and without caching.
 * Run with: deno run --allow-env --allow-read examples/cache-demo.ts
 */

import { render, getCacheStats, clearCache } from "../dist/lib.js";

/**
 * Performance test configuration
 */
const TEST_CONFIG = {
  texts: ["HELLO", "WORLD", "CACHE", "DEMO", "FAST"],
  fonts: ["Standard", "Big"],
  palettes: ["sunset", "ocean", "fire", "matrix"],
  iterations: 50
};

/**
 * Measure execution time of a function
 */
async function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; time: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return { result, time: end - start };
}

/**
 * Generate random combinations for testing
 */
function generateTestCases(count: number) {
  const cases = [];
  for (let i = 0; i < count; i++) {
    cases.push({
      text: TEST_CONFIG.texts[Math.floor(Math.random() * TEST_CONFIG.texts.length)],
      font: TEST_CONFIG.fonts[Math.floor(Math.random() * TEST_CONFIG.fonts.length)],
      palette: TEST_CONFIG.palettes[Math.floor(Math.random() * TEST_CONFIG.palettes.length)]
    });
  }
  return cases;
}

/**
 * Run performance test without cache
 */
async function testWithoutCache() {
  console.log("🚫 Testing WITHOUT cache...");
  
  // Clear cache to ensure clean test
  clearCache();
  
  const testCases = generateTestCases(TEST_CONFIG.iterations);
  const times: number[] = [];
  
  for (const testCase of testCases) {
    // Clear cache before each render to simulate no caching
    clearCache();
    
    const { time } = await measureTime(async () => {
      return await render(testCase.text, {
        font: testCase.font,
        palette: testCase.palette
      });
    });
    
    times.push(time);
  }
  
  const stats = getCacheStats();
  
  return {
    totalTime: times.reduce((sum, time) => sum + time, 0),
    avgTime: times.reduce((sum, time) => sum + time, 0) / times.length,
    minTime: Math.min(...times),
    maxTime: Math.max(...times),
    cacheStats: stats
  };
}

/**
 * Run performance test with cache
 */
async function testWithCache() {
  console.log("⚡ Testing WITH cache...");
  
  // Clear cache to start fresh
  clearCache();
  
  const testCases = generateTestCases(TEST_CONFIG.iterations);
  const times: number[] = [];
  
  for (const testCase of testCases) {
    const { time } = await measureTime(async () => {
      return await render(testCase.text, {
        font: testCase.font,
        palette: testCase.palette
      });
    });
    
    times.push(time);
  }
  
  const stats = getCacheStats();
  
  return {
    totalTime: times.reduce((sum, time) => sum + time, 0),
    avgTime: times.reduce((sum, time) => sum + time, 0) / times.length,
    minTime: Math.min(...times),
    maxTime: Math.max(...times),
    cacheStats: stats
  };
}

/**
 * Demonstrate cache hit rate with repeated renders
 */
async function demonstrateCacheHits() {
  console.log("🎯 Demonstrating cache hit rate...");
  
  clearCache();
  
  const sampleText = "CACHE";
  const sampleFont = "Standard";
  const samplePalette = "sunset";
  
  console.log("\nRendering the same text multiple times:");
  
  for (let i = 1; i <= 5; i++) {
    const { time } = await measureTime(async () => {
      return await render(sampleText, {
        font: sampleFont,
        palette: samplePalette
      });
    });
    
    const stats = getCacheStats();
    console.log(`  Render ${i}: ${time.toFixed(2)}ms (Hit rate: ${stats.hitRate.toFixed(1)}%)`);
  }
  
  const finalStats = getCacheStats();
  console.log(`\nFinal cache stats:`);
  console.log(`  Hits: ${finalStats.hits}`);
  console.log(`  Misses: ${finalStats.misses}`);
  console.log(`  Hit rate: ${finalStats.hitRate.toFixed(1)}%`);
  console.log(`  Cache size: ${finalStats.size} entries`);
}

/**
 * Test cache behavior with different text/font combinations
 */
async function testCacheBehavior() {
  console.log("🔍 Testing cache behavior with different combinations...");
  
  clearCache();
  
  const combinations = [
    { text: "HELLO", font: "Standard", palette: "sunset" },
    { text: "HELLO", font: "Big", palette: "sunset" },      // Different font
    { text: "WORLD", font: "Standard", palette: "sunset" },  // Different text
    { text: "HELLO", font: "Standard", palette: "ocean" },   // Different palette (shouldn't affect cache)
    { text: "HELLO", font: "Standard", palette: "sunset" },  // Same as first (should hit cache)
  ];
  
  console.log("\nTesting different combinations:");
  
  for (let i = 0; i < combinations.length; i++) {
    const combo = combinations[i];
    const { time } = await measureTime(async () => {
      return await render(combo.text, combo);
    });
    
    const stats = getCacheStats();
    const description = i === 4 ? "(should be cache hit)" : 
                       i === 3 ? "(palette doesn't affect ASCII cache)" : 
                       "(should be cache miss)";
    
    console.log(`  ${i + 1}. "${combo.text}" + ${combo.font}: ${time.toFixed(2)}ms ${description}`);
    console.log(`     Cache: ${stats.hits} hits, ${stats.misses} misses (${stats.hitRate.toFixed(1)}% hit rate)`);
  }
}

/**
 * Memory usage demonstration
 */
async function demonstrateMemoryUsage() {
  console.log("💾 Demonstrating memory usage...");
  
  clearCache();
  
  const texts = ["A", "BB", "CCC", "DDDD", "EEEEE"];
  
  console.log("\nAdding entries to cache:");
  
  for (const text of texts) {
    await render(text, { font: "Standard", palette: "sunset" });
    const stats = getCacheStats();
    
    console.log(`  Added "${text}": ${stats.size} entries, ~${Math.round(stats.size * 500 / 1024)}KB`);
  }
}

/**
 * Main demo function
 */
async function main() {
  console.log("🚀 oh-my-logo Cache Performance Demo\n");
  console.log("This demo shows how LRU caching improves ASCII generation performance.\n");
  console.log("=".repeat(60) + "\n");
  
  try {
    // Performance comparison
    console.log("📊 Performance Comparison");
    console.log("-".repeat(30));
    
    const withoutCacheResults = await testWithoutCache();
    console.log(`Without cache: ${withoutCacheResults.avgTime.toFixed(2)}ms average`);
    console.log(`  Total time: ${withoutCacheResults.totalTime.toFixed(2)}ms`);
    console.log(`  Range: ${withoutCacheResults.minTime.toFixed(2)}ms - ${withoutCacheResults.maxTime.toFixed(2)}ms`);
    console.log(`  Cache hits: ${withoutCacheResults.cacheStats.hits} (${withoutCacheResults.cacheStats.hitRate.toFixed(1)}%)\n`);
    
    const withCacheResults = await testWithCache();
    console.log(`With cache: ${withCacheResults.avgTime.toFixed(2)}ms average`);
    console.log(`  Total time: ${withCacheResults.totalTime.toFixed(2)}ms`);
    console.log(`  Range: ${withCacheResults.minTime.toFixed(2)}ms - ${withCacheResults.maxTime.toFixed(2)}ms`);
    console.log(`  Cache hits: ${withCacheResults.cacheStats.hits} (${withCacheResults.cacheStats.hitRate.toFixed(1)}%)\n`);
    
    // Calculate improvement
    const improvement = ((withoutCacheResults.avgTime - withCacheResults.avgTime) / withoutCacheResults.avgTime) * 100;
    console.log(`🎉 Performance improvement: ${improvement.toFixed(1)}% faster with cache!\n`);
    
    console.log("=".repeat(60) + "\n");
    
    // Cache hit demonstration
    await demonstrateCacheHits();
    console.log("\n" + "=".repeat(60) + "\n");
    
    // Cache behavior testing
    await testCacheBehavior();
    console.log("\n" + "=".repeat(60) + "\n");
    
    // Memory usage
    await demonstrateMemoryUsage();
    console.log("\n" + "=".repeat(60) + "\n");
    
    console.log("✅ Cache demo completed!");
    console.log("\nKey takeaways:");
    console.log("• ASCII generation is cached by text + font combination");
    console.log("• Color palettes don't affect ASCII cache (only applied after generation)");
    console.log("• Cache provides significant performance improvements for repeated renders");
    console.log("• LRU eviction ensures memory usage stays bounded");
    console.log("• Cache statistics help monitor performance in production");
    
    console.log("\nEnvironment variables for cache tuning:");
    console.log("• OHMYLOGO_CACHE_SIZE: Maximum cache entries (default: 1000)");
    console.log("• OHMYLOGO_CACHE_TTL: Cache TTL in milliseconds (default: 1800000 = 30min)");
    
  } catch (error) {
    console.error("❌ Error running cache demo:", error);
    console.error("\nMake sure you've run 'npm run build' first!");
  }
}

// Run the cache demo
if (import.meta.main) {
  main();
}