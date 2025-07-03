/**
 * Performance monitoring and optimization utilities
 */

import { cacheManager } from '../cache/CacheManager.js';

export interface PerformanceMetrics {
  renderTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  operationsPerSecond: number;
}

export class PerformanceMonitor {
  private renderTimes: number[] = [];
  private maxSamples = 100;

  startTiming(): () => number {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.addRenderTime(duration);
      return duration;
    };
  }

  private addRenderTime(time: number): void {
    this.renderTimes.push(time);
    if (this.renderTimes.length > this.maxSamples) {
      this.renderTimes.shift();
    }
  }

  getMetrics(): PerformanceMetrics {
    const stats = cacheManager.getStats();
    const avgRenderTime = this.renderTimes.length > 0 
      ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length 
      : 0;

    return {
      renderTime: avgRenderTime,
      cacheHitRate: stats.totalHitRate,
      memoryUsage: stats.totalMemoryUsage,
      operationsPerSecond: avgRenderTime > 0 ? 1000 / avgRenderTime : 0
    };
  }

  getDetailedReport(): string {
    const metrics = this.getMetrics();
    const stats = cacheManager.getStats();
    const hotKeys = cacheManager.getHotKeys();

    return `
Performance Report:
==================
Average Render Time: ${metrics.renderTime.toFixed(2)}ms
Cache Hit Rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%
Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
Operations/Second: ${metrics.operationsPerSecond.toFixed(1)}

Cache Statistics:
- Figlet: ${stats.figlet.size} entries, ${(stats.figlet.hitRate * 100).toFixed(1)}% hit rate
- Gradient: ${stats.gradient.size} entries, ${(stats.gradient.hitRate * 100).toFixed(1)}% hit rate
- Palette: ${stats.palette.size} entries, ${(stats.palette.hitRate * 100).toFixed(1)}% hit rate
- Ink: ${stats.ink.size} entries, ${(stats.ink.hitRate * 100).toFixed(1)}% hit rate

Most Accessed Patterns:
- Figlet: ${hotKeys.figlet.map(k => `${k.key} (${k.accessCount}x)`).join(', ')}
- Gradient: ${hotKeys.gradient.map(k => `${k.key} (${k.accessCount}x)`).join(', ')}
`;
  }

  reset(): void {
    this.renderTimes = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for performance optimization
export function optimizeForPattern(text: string, palette: string, font: string = 'Standard'): void {
  // This could trigger preloading of related patterns
  console.log(`Optimizing for pattern: ${text} with ${palette} palette`);
}

export function getBenchmarkResults(iterations: number = 100): Promise<{
  avgTime: number;
  minTime: number;
  maxTime: number;
  opsPerSecond: number;
}> {
  return new Promise((resolve) => {
    const times: number[] = [];
    let completed = 0;

    const runBenchmark = async () => {
      const { render } = await import('../lib.js');
      
      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        await render('BENCHMARK', { palette: 'sunset' });
        const end = performance.now();
        times.push(end - start);
        completed++;
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const opsPerSecond = 1000 / avgTime;

      resolve({ avgTime, minTime, maxTime, opsPerSecond });
    };

    runBenchmark();
  });
}