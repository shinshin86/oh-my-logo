# oh-my-logo Examples

This directory contains example scripts showing how to use oh-my-logo as a library with Deno.

## Prerequisites

Before running any examples, you must build the project:

```bash
# From the project root directory
npm run build
```

This generates the compiled JavaScript files in the `dist/` directory that the examples import.

## Deno Installation

If you don't have Deno installed:

```bash
# macOS/Linux
curl -fsSL https://deno.land/install.sh | sh

# Windows
irm https://deno.land/install.ps1 | iex

# Or using package managers
brew install deno        # macOS
choco install deno       # Windows
```

## Running Examples

All examples can be run directly with Deno from the project root:

```bash
# Basic usage examples
deno run --allow-env --allow-read examples/basic.ts

# Advanced features (gradients, fonts, custom colors)
deno run --allow-env --allow-read examples/advanced.ts

# Filled character rendering (may need additional permissions)
deno run --allow-env --allow-read --allow-write examples/filled.ts

# Error handling examples
deno run --allow-env --allow-read examples/error-handling.ts

# Rainbow animation with cycling colors/fonts and progressive text display
# Use $'...' syntax to interpret escape sequences like \n
deno run --allow-env --allow-read examples/rainbow.ts $'YOUR\nTEXT'
```

**Note**: The `--allow-env` and `--allow-read` flags are required because oh-my-logo accesses environment variables and reads font files.

## Examples Overview

### basic.ts
- Simple ASCII art generation
- Using built-in color palettes
- Listing available palettes
- Basic error handling

### advanced.ts
- Custom color palettes
- Different gradient directions (vertical, horizontal, diagonal)
- Using different fonts
- Combining multiple options

### filled.ts
- Using `renderFilled()` for solid block characters
- Comparing different palettes with filled rendering
- Demonstration of React/Ink-based rendering

### error-handling.ts
- Handling invalid palette names
- Proper error catching and reporting
- Best practices for library usage

### rainbow.ts
- Animated logo with cycling color palettes
- Progressive text display (character-by-character)
- Rotating through different fonts
- Graceful exit handling (Ctrl+C)
- Example of real-time rendering loop

## Library Import Pattern

All examples use relative path imports:

```typescript
import { render, renderFilled, PALETTES } from "../dist/lib.js";
```

This works because:
1. The examples are in the `examples/` subdirectory
2. The built library is in the `dist/` directory at the project root
3. Deno supports direct JavaScript imports from relative paths

## TypeScript Support

Deno has built-in TypeScript support, so you can also create `.ts` files and run them directly. The examples include full type annotations for educational purposes.

## Troubleshooting

### "Module not found" error
- Make sure you've run `npm run build` first
- Check that `dist/lib.js` exists in the project root

### "Permission denied" errors
- Deno requires explicit permission flags for security
- Use `--allow-env --allow-read` for most examples
- Add `--allow-write` for filled character examples if needed
- Example: `deno run --allow-env --allow-read examples/basic.ts`

### TypeScript errors
- Ensure you're using a recent version of Deno
- Check that the import path is correct: `../dist/lib.js`

## Next Steps

After trying these examples, you can:
1. Create your own scripts using the library
2. Integrate oh-my-logo into your Deno projects
3. Explore the CLI version: `npm install -g oh-my-logo`
4. Check out the main README.md for more usage patterns