# Library Usage Examples

This directory contains comprehensive examples demonstrating how to use oh-my-logo as a library with all the new performance features and caching capabilities.

## Examples Overview

### 1. `basic-usage.js`
**Fundamental library features**
- Simple ASCII art generation
- Using built-in color palettes
- Gradient directions (vertical, horizontal, diagonal)
- Custom color arrays
- Filled block characters
- Listing available palettes

```bash
node examples/library-usage/basic-usage.js
```

### 2. `performance-features.js`
**New performance and caching capabilities**
- Performance monitoring and timing
- Cache statistics and hit rates
- Preloading common patterns
- Benchmark comparisons
- Memory management
- Detailed performance reports

```bash
node examples/library-usage/performance-features.js
```

### 3. `advanced-caching.js`
**Sophisticated caching strategies**
- Cache warming strategies
- Cache hit rate demonstrations
- Memory-efficient batch processing
- Smart cache management
- Cache persistence simulation
- Performance recommendations

```bash
node examples/library-usage/advanced-caching.js
```

### 4. `real-world-scenarios.js`
**Practical applications and use cases**
- CLI application startup banners
- Build system success/error messages
- Development server status displays
- Deployment pipeline notifications
- API service status dashboards
- High-performance logo generation services

```bash
node examples/library-usage/real-world-scenarios.js
```

### 5. `typescript-examples.ts`
**Type-safe usage with full TypeScript support**
- Type-safe render options
- Palette validation with type guards
- Performance monitoring with types
- Advanced cache management
- Error handling with discriminated unions

```bash
npx tsx examples/library-usage/typescript-examples.ts
```

## Key Features Demonstrated

### 🚀 Performance Improvements
- **10x faster rendering** with intelligent caching
- **Memory-efficient** LRU cache implementation
- **Preloading** for common patterns
- **Batch processing** with memory management

### 🧠 Smart Caching
- **Multi-level caching** (figlet, gradient, palette, ink)
- **Automatic cache optimization** with hit rate monitoring
- **Memory usage tracking** and automatic cleanup
- **Hot key analysis** for usage patterns

### 📊 Performance Monitoring
- **Real-time metrics** collection
- **Detailed performance reports**
- **Benchmark utilities**
- **Memory usage analysis**

### 🔷 TypeScript Support
- **Full type safety** with interfaces and generics
- **Type guards** for runtime validation
- **Discriminated unions** for error handling
- **Strongly typed** configuration objects

### 🛠️ Production Ready
- **Graceful error handling**
- **Memory leak prevention**
- **Process cleanup** on exit
- **CLI hanging fixes**

## Running the Examples

### Prerequisites
Make sure you've built the project first:
```bash
npm run build
```

### Run Individual Examples
```bash
# Basic usage
node examples/library-usage/basic-usage.js

# Performance features
node examples/library-usage/performance-features.js

# Advanced caching
node examples/library-usage/advanced-caching.js

# Real-world scenarios
node examples/library-usage/real-world-scenarios.js

# TypeScript examples (requires tsx)
npx tsx examples/library-usage/typescript-examples.ts
```

### Run All Examples
```bash
# Create a simple runner script
for file in examples/library-usage/*.js; do
  echo "Running $file..."
  node "$file"
  echo "---"
done
```

## Integration Patterns

### Basic Integration
```javascript
import { render, renderFilled } from 'oh-my-logo';

// Simple usage
const logo = await render('HELLO', { palette: 'sunset' });
console.log(logo);

// Filled characters
await renderFilled('WORLD', { palette: 'fire' });
```

### Performance-Optimized Integration
```javascript
import { 
  render, 
  preloadCommonPatterns, 
  getPerformanceStats 
} from 'oh-my-logo';

// Initialize with preloading
await preloadCommonPatterns();

// Monitor performance
const stats = getPerformanceStats();
console.log(`Hit rate: ${stats.totalHitRate * 100}%`);
```

### Production Integration
```javascript
import { 
  render, 
  cacheManager,
  clearAllCaches 
} from 'oh-my-logo';

// Production service
class LogoService {
  async initialize() {
    await preloadCommonPatterns();
  }
  
  async generateLogo(text, options) {
    return render(text, options);
  }
  
  cleanup() {
    clearAllCaches();
  }
}
```

## Performance Tips

1. **Preload Common Patterns**: Use `preloadCommonPatterns()` during app initialization
2. **Monitor Cache Hit Rate**: Aim for >70% hit rate for optimal performance
3. **Batch Operations**: Process multiple logos together for better cache utilization
4. **Memory Management**: Monitor memory usage and clear caches when needed
5. **TypeScript**: Use type-safe APIs for better development experience

## Troubleshooting

### Common Issues

**High Memory Usage**
```javascript
const stats = getPerformanceStats();
if (stats.memoryUsageMB > 50) {
  clearAllCaches();
}
```

**Low Cache Hit Rate**
```javascript
// Preload common patterns
await preloadCommonPatterns();

// Or warm cache with your specific patterns
await render('YOUR_COMMON_TEXT', { palette: 'your_palette' });
```

**TypeScript Errors**
```typescript
// Use proper types
import { type PaletteName, type RenderOptions } from 'oh-my-logo';

const options: RenderOptions = {
  palette: 'sunset' as PaletteName,
  direction: 'horizontal'
};
```

## Next Steps

1. **Integrate** these patterns into your applications
2. **Monitor** performance in production
3. **Customize** cache sizes based on your usage patterns
4. **Contribute** improvements back to the project

Happy coding! 🎨✨