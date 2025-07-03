/**
 * Performance Features Examples
 * Demonstrates new caching and performance monitoring capabilities
 */

import { 
  render, 
  renderFilled, 
  getPerformanceStats, 
  clearAllCaches,
  preloadCommonPatterns,
  cacheManager 
} from 'oh-my-logo';

import { performanceMonitor, getBenchmarkResults } from 'oh-my-logo/dist/utils/performance.js';

console.log('⚡ Performance Features Examples\n');

// Example 1: Performance monitoring
console.log('1. Performance Monitoring:');
const timer = performanceMonitor.startTiming();

await render('PERFORMANCE', { palette: 'sunset' });
const renderTime = timer();

console.log(`Render time: ${renderTime.toFixed(2)}ms`);
console.log('\n' + '='.repeat(50) + '\n');

// Example 2: Cache statistics
console.log('2. Cache Statistics:');
const stats = getPerformanceStats();

console.log('Cache Performance:');
console.log(`• Memory Usage: ${stats.memoryUsageMB.toFixed(2)}MB`);
console.log(`• Total Hit Rate: ${(stats.totalHitRate * 100).toFixed(1)}%`);
console.log(`• Cache Entries: ${stats.cacheStats.figlet.size + stats.cacheStats.gradient.size}`);

console.log('\nHot Keys (Most Accessed):');
stats.hotKeys.figlet.forEach(item => {
  console.log(`• Figlet: "${item.key}" (${item.accessCount} accesses)`);
});

console.log('\n' + '='.repeat(50) + '\n');

// Example 3: Preloading for better performance
console.log('3. Preloading Common Patterns:');
console.time('Preload Time');
await preloadCommonPatterns();
console.timeEnd('Preload Time');

// Now these renders should be much faster due to caching
console.log('\nTesting preloaded patterns (should be faster):');
console.time('Cached Render');
await render('HELLO', { palette: 'sunset' });
await render('WORLD', { palette: 'ocean' });
await render('DEMO', { palette: 'fire' });
console.timeEnd('Cached Render');

console.log('\n' + '='.repeat(50) + '\n');

// Example 4: Benchmark comparison
console.log('4. Performance Benchmark:');
console.log('Running benchmark (100 iterations)...');

const benchmarkResults = await getBenchmarkResults(100);

console.log('Benchmark Results:');
console.log(`• Average Time: ${benchmarkResults.avgTime.toFixed(2)}ms`);
console.log(`• Min Time: ${benchmarkResults.minTime.toFixed(2)}ms`);
console.log(`• Max Time: ${benchmarkResults.maxTime.toFixed(2)}ms`);
console.log(`• Operations/Second: ${benchmarkResults.opsPerSecond.toFixed(1)}`);

console.log('\n' + '='.repeat(50) + '\n');

// Example 5: Memory management
console.log('5. Memory Management:');
console.log('Before cache clear:');
const statsBefore = getPerformanceStats();
console.log(`Memory: ${statsBefore.memoryUsageMB.toFixed(2)}MB`);

clearAllCaches();

console.log('After cache clear:');
const statsAfter = getPerformanceStats();
console.log(`Memory: ${statsAfter.memoryUsageMB.toFixed(2)}MB`);

console.log('\n' + '='.repeat(50) + '\n');

// Example 6: Detailed performance report
console.log('6. Detailed Performance Report:');
// Generate some activity first
await render('REPORT', { palette: 'matrix' });
await render('TEST', { palette: 'gold' });
await renderFilled('FILLED', { palette: 'coral' });

console.log(performanceMonitor.getDetailedReport());