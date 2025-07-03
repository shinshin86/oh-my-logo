# oh-my-logo Examples

This directory contains example scripts showing how to use oh-my-logo as a library with both Node.js and Deno.

## Prerequisites

Before running any examples, you must build the project:

```bash
# From the project root directory
npm run build
```

This generates the compiled JavaScript files in the `dist/` directory that the examples import.

## Running Examples

### With Node.js (Recommended)

First, compile the examples:

```bash
# From the examples directory
tsc

# Or from the project root
npx tsc --project examples/tsconfig.json
```

Then run the compiled JavaScript:

```bash
# Basic usage examples
node examples/basic.js

# Advanced features (gradients, fonts, custom colors)
node examples/advanced.js

# Filled character rendering
node examples/filled.js

# Error handling examples
node examples/error-handling.js

# Cache performance demo
node examples/cache-demo.js

# Rainbow animation
node examples/rainbow.js "YOUR TEXT"
```

### With Deno (Alternative)

You can also run the TypeScript files directly with Deno:

```bash
# Basic usage examples
deno run --allow-env --allow-read examples/basic.ts

# Advanced features
deno run --allow-env --allow-read examples/advanced.ts

# Other examples...
deno run --allow-env --allow-read examples/filled.ts
```

**Note**: The `--allow-env` and `--allow-read` flags are required because oh-my-logo accesses environment variables and reads font files.

## Examples Overview

### basic.ts/js
- Simple ASCII art generation
- Using built-in color palettes
- Listing available palettes
- Basic error handling

### advanced.ts/js
- Custom color palettes
- Different gradient directions (vertical, horizontal, diagonal)
- Using different fonts
- Combining multiple options

### filled.ts/js
- Using `renderFilled()` for solid block characters
- Comparing different palettes with filled rendering
- Demonstration of React/Ink-based rendering

### error-handling.ts/js
- Handling invalid palette names
- Proper error catching and reporting
- Best practices for library usage

### cache-demo.ts/js
- Performance comparison with and without caching
- Cache statistics monitoring
- Memory usage demonstration

### rainbow.ts/js
- Animated logo with cycling color palettes
- Progressive text display (character-by-character)
- Rotating through different fonts
- Graceful exit handling (Ctrl+C)
- Example of real-time rendering loop

## Library Import Pattern

All examples use relative path imports to the built library:

```typescript
import { render, renderFilled, PALETTES } from "../dist/lib.js";
```

This works because:
1. The examples are in the `examples/` subdirectory
2. The built library is in the `dist/` directory at the project root
3. Both Node.js and Deno support direct JavaScript imports from relative paths

## TypeScript Configuration

The examples have their own `tsconfig.json` optimized for:
- ES2022 modules and features
- Bundler module resolution
- Compatibility with both Node.js and Deno patterns

## Troubleshooting

### "Module not found" error
- Make sure you've run `npm run build` first
- Check that `dist/lib.js` exists in the project root

### TypeScript compilation errors
- Use the examples-specific TypeScript config: `npx tsc --project examples/tsconfig.json`
- Ensure you're using a recent version of TypeScript

### Permission errors (Deno only)
- Deno requires explicit permission flags for security
- Use `--allow-env --allow-read` for most examples
- Add `--allow-write` for filled character examples if needed

### Runtime errors
- Ensure all dependencies are installed: `npm install`
- Check that the built library exists in `dist/`

## Next Steps

After trying these examples, you can:
1. Create your own scripts using the library
2. Integrate oh-my-logo into your Node.js or Deno projects
3. Explore the CLI version: `npm install -g oh-my-logo`
4. Check out the main README.md for more usage patterns