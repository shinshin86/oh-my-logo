/**
 * TypeScript Usage Examples
 * Demonstrates type-safe usage with full TypeScript support
 */

import { 
  render, 
  renderFilled, 
  PALETTES,
  type RenderOptions,
  type RenderInkOptions,
  type PaletteName,
  type Fonts,
  getPerformanceStats,
  cacheManager
} from 'oh-my-logo';

import { 
  performanceMonitor, 
  type PerformanceMetrics 
} from 'oh-my-logo/dist/utils/performance.js';

console.log('🔷 TypeScript Usage Examples\n');

// Example 1: Type-safe render options
console.log('1. Type-safe Render Options:');

interface LogoConfig {
  text: string;
  palette: PaletteName | string[];
  font?: Fonts;
  direction?: 'vertical' | 'horizontal' | 'diagonal';
}

const logoConfigs: LogoConfig[] = [
  {
    text: 'TYPESCRIPT',
    palette: 'sunset',
    font: 'Standard',
    direction: 'horizontal'
  },
  {
    text: 'SAFE',
    palette: ['#ff0080', '#8000ff', '#0080ff'],
    direction: 'diagonal'
  },
  {
    text: 'TYPES',
    palette: 'matrix',
    font: 'Big'
  }
];

for (const config of logoConfigs) {
  console.log(`Rendering: ${config.text}`);
  const logo = await render(config.text, {
    palette: config.palette,
    font: config.font,
    direction: config.direction
  });
  console.log(logo);
  console.log();
}

console.log('='.repeat(50) + '\n');

// Example 2: Type-safe palette handling
console.log('2. Type-safe Palette Handling:');

class PaletteManager {
  private readonly availablePalettes: readonly PaletteName[] = [
    'grad-blue', 'sunset', 'dawn', 'nebula', 'ocean', 
    'fire', 'forest', 'gold', 'purple', 'mint', 'coral', 'matrix', 'mono'
  ];

  isPaletteValid(palette: string): palette is PaletteName {
    return this.availablePalettes.includes(palette as PaletteName);
  }

  async renderWithValidation(text: string, palette: string): Promise<string> {
    if (!this.isPaletteValid(palette)) {
      throw new Error(`Invalid palette: ${palette}. Available: ${this.availablePalettes.join(', ')}`);
    }

    return render(text, { palette });
  }

  getRandomPalette(): PaletteName {
    const randomIndex = Math.floor(Math.random() * this.availablePalettes.length);
    return this.availablePalettes[randomIndex];
  }

  getPaletteColors(name: PaletteName): readonly string[] {
    return PALETTES[name];
  }
}

const paletteManager = new PaletteManager();

try {
  const validLogo = await paletteManager.renderWithValidation('VALID', 'sunset');
  console.log('✅ Valid palette used successfully');
} catch (error) {
  console.log(`❌ Error: ${error.message}`);
}

try {
  await paletteManager.renderWithValidation('INVALID', 'nonexistent');
} catch (error) {
  console.log(`❌ Expected error: ${error.message}`);
}

const randomPalette = paletteManager.getRandomPalette();
console.log(`🎲 Random palette: ${randomPalette}`);
const randomColors = paletteManager.getPaletteColors(randomPalette);
console.log(`Colors: ${randomColors.join(' → ')}`);

console.log('\n' + '='.repeat(50) + '\n');

// Example 3: Performance monitoring with types
console.log('3. Performance Monitoring with Types:');

interface RenderResult {
  logo: string;
  metrics: PerformanceMetrics;
  renderTime: number;
}

class PerformanceAwareRenderer {
  async renderWithMetrics(text: string, options: RenderOptions = {}): Promise<RenderResult> {
    const timer = performanceMonitor.startTiming();
    
    const logo = await render(text, options);
    const renderTime = timer();
    const metrics = performanceMonitor.getMetrics();
    
    return {
      logo,
      metrics,
      renderTime
    };
  }

  async batchRenderWithAnalysis(
    requests: Array<{ text: string; options?: RenderOptions }>
  ): Promise<{
    results: RenderResult[];
    analysis: {
      totalTime: number;
      averageTime: number;
      fastestRender: number;
      slowestRender: number;
    };
  }> {
    const results: RenderResult[] = [];
    const renderTimes: number[] = [];

    for (const request of requests) {
      const result = await this.renderWithMetrics(request.text, request.options);
      results.push(result);
      renderTimes.push(result.renderTime);
    }

    const totalTime = renderTimes.reduce((sum, time) => sum + time, 0);
    const averageTime = totalTime / renderTimes.length;
    const fastestRender = Math.min(...renderTimes);
    const slowestRender = Math.max(...renderTimes);

    return {
      results,
      analysis: {
        totalTime,
        averageTime,
        fastestRender,
        slowestRender
      }
    };
  }
}

const performanceRenderer = new PerformanceAwareRenderer();

const batchRequests = [
  { text: 'BATCH1', options: { palette: 'sunset' as PaletteName } },
  { text: 'BATCH2', options: { palette: 'ocean' as PaletteName } },
  { text: 'BATCH3', options: { palette: 'fire' as PaletteName } }
];

const batchResult = await performanceRenderer.batchRenderWithAnalysis(batchRequests);

console.log('Batch Analysis:');
console.log(`• Total time: ${batchResult.analysis.totalTime.toFixed(2)}ms`);
console.log(`• Average time: ${batchResult.analysis.averageTime.toFixed(2)}ms`);
console.log(`• Fastest render: ${batchResult.analysis.fastestRender.toFixed(2)}ms`);
console.log(`• Slowest render: ${batchResult.analysis.slowestRender.toFixed(2)}ms`);

console.log('\n' + '='.repeat(50) + '\n');

// Example 4: Advanced cache management with types
console.log('4. Advanced Cache Management:');

interface CacheConfiguration {
  figletCacheSize: number;
  gradientCacheSize: number;
  paletteCacheSize: number;
  inkCacheSize: number;
  maxMemoryMB: number;
}

class TypedCacheManager {
  private config: CacheConfiguration;

  constructor(config: Partial<CacheConfiguration> = {}) {
    this.config = {
      figletCacheSize: 500,
      gradientCacheSize: 200,
      paletteCacheSize: 50,
      inkCacheSize: 100,
      maxMemoryMB: 50,
      ...config
    };
  }

  getDetailedStats(): {
    cacheStats: ReturnType<typeof getPerformanceStats>['cacheStats'];
    memoryUsage: number;
    recommendations: string[];
  } {
    const stats = getPerformanceStats();
    const recommendations: string[] = [];

    if (stats.totalHitRate < 0.7) {
      recommendations.push('Consider preloading common patterns');
    }

    if (stats.memoryUsageMB > this.config.maxMemoryMB) {
      recommendations.push('Memory usage exceeds configured limit');
    }

    return {
      cacheStats: stats.cacheStats,
      memoryUsage: stats.memoryUsageMB,
      recommendations
    };
  }

  async optimizeCache(): Promise<void> {
    const stats = this.getDetailedStats();
    
    console.log('Cache Optimization Report:');
    console.log(`• Memory usage: ${stats.memoryUsage.toFixed(2)}MB`);
    console.log(`• Figlet cache: ${stats.cacheStats.figlet.size} entries`);
    console.log(`• Gradient cache: ${stats.cacheStats.gradient.size} entries`);
    
    if (stats.recommendations.length > 0) {
      console.log('Recommendations:');
      stats.recommendations.forEach(rec => console.log(`  - ${rec}`));
    } else {
      console.log('✅ Cache is optimally configured');
    }
  }
}

const typedCacheManager = new TypedCacheManager({
  maxMemoryMB: 30,
  figletCacheSize: 300
});

await typedCacheManager.optimizeCache();

console.log('\n' + '='.repeat(50) + '\n');

// Example 5: Error handling with custom types
console.log('5. Type-safe Error Handling:');

type RenderError = 
  | { type: 'PALETTE_ERROR'; palette: string }
  | { type: 'FONT_ERROR'; font: string }
  | { type: 'INPUT_ERROR'; input: string }
  | { type: 'UNKNOWN_ERROR'; message: string };

class SafeRenderer {
  async safeRender(
    text: string, 
    options: RenderOptions = {}
  ): Promise<{ success: true; logo: string } | { success: false; error: RenderError }> {
    try {
      // Validate input
      if (!text || text.trim() === '') {
        return {
          success: false,
          error: { type: 'INPUT_ERROR', input: text }
        };
      }

      const logo = await render(text, options);
      return { success: true, logo };

    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('palette')) {
          return {
            success: false,
            error: { 
              type: 'PALETTE_ERROR', 
              palette: typeof options.palette === 'string' ? options.palette : 'custom'
            }
          };
        }
        
        if (error.message.includes('font')) {
          return {
            success: false,
            error: { 
              type: 'FONT_ERROR', 
              font: options.font || 'Standard'
            }
          };
        }
      }

      return {
        success: false,
        error: { 
          type: 'UNKNOWN_ERROR', 
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  formatError(error: RenderError): string {
    switch (error.type) {
      case 'PALETTE_ERROR':
        return `Invalid palette: ${error.palette}`;
      case 'FONT_ERROR':
        return `Font not found: ${error.font}`;
      case 'INPUT_ERROR':
        return `Invalid input: "${error.input}"`;
      case 'UNKNOWN_ERROR':
        return `Unknown error: ${error.message}`;
    }
  }
}

const safeRenderer = new SafeRenderer();

// Test various scenarios
const testCases = [
  { text: 'SUCCESS', options: { palette: 'sunset' as PaletteName } },
  { text: '', options: {} }, // Empty input
  { text: 'INVALID', options: { palette: 'nonexistent' } }, // Invalid palette
];

for (const testCase of testCases) {
  const result = await safeRenderer.safeRender(testCase.text, testCase.options);
  
  if (result.success) {
    console.log(`✅ Success: "${testCase.text}"`);
  } else {
    console.log(`❌ Error: ${safeRenderer.formatError(result.error)}`);
  }
}

console.log('\n✅ TypeScript examples completed!');
console.log('\n🔷 Key TypeScript Features Demonstrated:');
console.log('• Full type safety with interfaces and generics');
console.log('• Discriminated unions for error handling');
console.log('• Type guards for runtime validation');
console.log('• Strongly typed configuration objects');
console.log('• Type-safe performance monitoring');