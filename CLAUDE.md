# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- `npm run dev -- "TEXT" [palette] [options]` - Run in development mode with tsx
- `npm run build` - Build TypeScript to JavaScript in `dist/`
- `npm run start` - Run with ts-node (ESM mode)

### Testing
- `npm test` - Run all tests with Vitest
- `npm run test:ui` - Run tests with interactive UI
- `npm run test:coverage` - Run tests with coverage report

### Testing the CLI
```bash
# Test basic functionality
node dist/index.js "HELLO" sunset

# Test filled rendering
node dist/index.js "LOGO" fire --filled

# Test gradient directions
node dist/index.js "TEXT" ocean -d horizontal
node dist/index.js "TEXT" ocean -d diagonal

# List all palettes
node dist/index.js "" --list-palettes

# Cache management
node dist/index.js "" --cache-stats
node dist/index.js "" --clear-cache
```

## Architecture Overview

This is a CLI tool that generates ASCII art logos with gradient colors. There are **two distinct rendering systems** with **LRU caching** for performance:

### 1. Traditional ASCII Art (Default)
- **Entry**: `src/renderer.ts` → `renderLogo()`
- **Tech**: `figlet` + `gradient-string` + **LRU cache**
- **Output**: Outlined ASCII characters with gradient colors
- **Supports**: 3 gradient directions (vertical, horizontal, diagonal)
- **Caching**: ASCII art generation cached by text + font combination

### 2. Filled Block Characters (--filled flag)
- **Entry**: `src/InkRenderer.tsx` → `renderInkLogo()`
- **Tech**: React + `ink` + `ink-big-text` + `ink-gradient`
- **Output**: Solid block characters with gradient fills
- **Supports**: Multi-line text, custom color palettes
- **Caching**: Not cached (React/Ink rendering is already fast)

### Core Components

**`src/index.ts`**: CLI entry point using Commander.js. Routes between the two rendering systems based on `--filled` flag. Includes cache management commands (`--cache-stats`, `--clear-cache`).

**`src/lib.ts`**: Library API entry point. Exports `render()` and `renderFilled()` functions for programmatic use, along with shared constants, utilities, and cache management functions.

**`src/palettes.ts`**: Centralized color palette definitions (13 palettes). All colors are hex values in arrays. The `PALETTES` object uses `as const` for type safety.

**`src/utils/cache.ts`**: **NEW** - LRU cache implementation using `lru-cache` npm package. Provides:
- `AsciiCache` class with configurable size, TTL, and memory limits
- Global cache instance with environment-based configuration
- Cache statistics tracking (hits, misses, hit rate)
- Utility functions for cache-aware operations

**`src/utils/stdout.ts`**: TTY detection and ANSI color handling. Determines when to strip colors for non-TTY outputs. Supports environment variables like `NO_COLOR` and `FORCE_COLOR`.

**`src/utils/errors.ts`**: Custom error classes (`PaletteError`, `InputError`, `FontError`) for better error handling.

## Key Implementation Details

### LRU Caching System
- **Cache Key**: Combination of text + font + figlet options (width, layout, etc.)
- **Cache Value**: Generated ASCII art string (before color application)
- **Default Config**: 1000 entries max, 30-minute TTL, ~1MB memory limit
- **Environment Variables**:
  - `OHMYLOGO_CACHE_SIZE`: Maximum cache entries (10-10000, default: 1000)
  - `OHMYLOGO_CACHE_TTL`: Cache TTL in milliseconds (1min-1hour, default: 30min)
- **Performance**: Significant speedup for repeated text/font combinations
- **Memory Management**: LRU eviction + TTL expiration + size-based limits

### Gradient Rendering Strategies
- **Vertical**: Uses `gradient().multiline()` for smooth top-to-bottom gradients
- **Horizontal**: Applies gradient per line for left-to-right effects  
- **Diagonal**: Custom implementation that shifts palette colors based on line position

### Color Palette System
Palettes are defined as readonly arrays of hex colors:
```typescript
'sunset': ['#ff9966', '#ff5e62', '#ffa34e']
```
The `resolvePalette()` function returns a copy `[...palette]` to avoid readonly issues with gradient-string.

### ESM + TypeScript Setup
- Uses `"type": "module"` with ESM imports
- TypeScript with `"jsx": "react-jsx"` for TSX support
- `"moduleResolution": "bundler"` to handle ink dependencies
- Builds to `dist/` with declarations and sourcemaps

### Ink Rendering Process
The Ink renderer uses React components and automatically unmounts after 100ms to allow the process to exit cleanly. This prevents hanging CLI processes.

## Environment Variables

- `OHMYLOGO_FONT`: Override default figlet font (defaults to "Standard")
- `OHMYLOGO_CACHE_SIZE`: Maximum cache entries (defaults to 1000)
- `OHMYLOGO_CACHE_TTL`: Cache TTL in milliseconds (defaults to 1800000 = 30min)

## Cache Management

### CLI Commands
```bash
# View cache statistics
oh-my-logo "" --cache-stats

# Clear the cache
oh-my-logo "" --clear-cache
```

### Library API
```typescript
import { getCacheStats, clearCache, pruneCache } from 'oh-my-logo';

// Get cache performance metrics
const stats = getCacheStats();
console.log(`Hit rate: ${stats.hitRate}%`);

// Clear all cached entries
clearCache();

// Remove expired entries
pruneCache();
```

### Cache Behavior
- **What's Cached**: ASCII art generation (figlet output)
- **Cache Key**: text + font + figlet options
- **Not Cached**: Color application (gradients are applied after cache lookup)
- **Eviction**: LRU + TTL + memory limits
- **Thread Safety**: Single-threaded Node.js environment

## Adding New Palettes

Add to the `PALETTES` object in `src/palettes.ts`:
```typescript
'my-palette': ['#color1', '#color2', '#color3']
```

The TypeScript compiler will automatically update the `PaletteName` type union.

## Library vs CLI Usage

This project supports **dual usage patterns**:

### CLI Tool
```bash
# Direct CLI usage
npx oh-my-logo "HELLO WORLD" sunset --filled

# After global install
oh-my-logo "WORLD" fire -d horizontal

# Cache management
oh-my-logo "" --cache-stats
```

### Programmatic Library
```typescript
import { render, renderFilled, PALETTES, getCacheStats } from 'oh-my-logo';

// ASCII art rendering (cached)
const logo = await render('HELLO WORLD', {
  palette: 'sunset',
  direction: 'horizontal',
  font: 'Standard'
});
console.log(logo);

// Filled block rendering (not cached)
await renderFilled('AWESOME', { palette: 'fire' });

// Cache monitoring
const stats = getCacheStats();
console.log(`Cache hit rate: ${stats.hitRate}%`);
```

### Package.json Configuration
- **`main`**: Points to `dist/lib.js` (library entry)
- **`bin`**: Points to `dist/index.js` (CLI entry)  
- **`exports`**: Defines multiple entry points for different usage patterns

## Testing Strategy

The project uses **Vitest** for comprehensive testing:

### Test Structure
```
src/__tests__/
├── lib.test.ts           # Library API functions
├── palettes.test.ts      # Color palette system
├── renderer.test.ts      # ASCII art rendering (with mocks)
└── utils/
    ├── cache.test.ts     # NEW - LRU cache functionality
    ├── errors.test.ts    # Custom error classes
    └── stdout.test.ts    # TTY/color detection
```

### Coverage Goals
- **100+ tests** covering critical functionality including cache
- **100% coverage** on business logic (lib.ts, palettes.ts, utils/)
- **Mocked external dependencies** (figlet, ink, gradient-string, lru-cache)
- **Edge cases and error scenarios** thoroughly tested
- **Cache behavior testing** (hits, misses, eviction, TTL)

### Running Tests
- Development: `npm test` (watch mode)
- CI/Coverage: `npm run test:coverage`
- Interactive: `npm run test:ui`

## Performance Optimization

### Cache Performance
- **First render**: Cache miss, full figlet generation
- **Subsequent renders**: Cache hit, ~90% faster
- **Memory usage**: ~500 bytes per cached entry
- **Optimal hit rate**: 70-90% in typical usage

### Cache Tuning
- **High hit rate**: Increase `OHMYLOGO_CACHE_SIZE`
- **Memory constraints**: Decrease cache size or TTL
- **Development**: Use `--clear-cache` to reset state
- **Production**: Monitor with `getCacheStats()`

### Best Practices
- Cache is most effective for repeated text/font combinations
- Color palette changes don't affect cache (applied post-generation)
- Use cache statistics to optimize configuration
- Consider TTL based on usage patterns