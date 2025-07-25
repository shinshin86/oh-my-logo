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
```

## Architecture Overview

This is a CLI tool that generates ASCII art logos with gradient colors. There are **two distinct rendering systems**:

### 1. Traditional ASCII Art (Default)
- **Entry**: `src/renderer.ts` → `renderLogo()`
- **Tech**: `figlet` + `gradient-string`
- **Output**: Outlined ASCII characters with gradient colors
- **Supports**: 3 gradient directions (vertical, horizontal, diagonal)

### 2. Filled Block Characters (--filled flag)
- **Entry**: `src/InkRenderer.tsx` → `renderInkLogo()`
- **Tech**: React + `ink` + `ink-big-text` + `ink-gradient`
- **Output**: Solid block characters with gradient fills
- **Supports**: Multi-line text, custom color palettes

### Core Components

**`src/index.ts`**: CLI entry point using Commander.js. Routes between the two rendering systems based on `--filled` flag.

**`src/lib.ts`**: Library API entry point. Exports `render()` and `renderFilled()` functions for programmatic use, along with shared constants and utilities.

**`src/palettes.ts`**: Centralized color palette definitions (13 palettes). All colors are hex values in arrays. The `PALETTES` object uses `as const` for type safety.

**`src/utils/stdout.ts`**: TTY detection and ANSI color handling. Determines when to strip colors for non-TTY outputs. Supports environment variables like `NO_COLOR` and `FORCE_COLOR`.

**`src/utils/errors.ts`**: Custom error classes (`PaletteError`, `InputError`, `FontError`) for better error handling.

## Key Implementation Details

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
npx oh-my-logo "HELLO" sunset --filled

# After global install
oh-my-logo "WORLD" fire -d horizontal
```

### Programmatic Library
```typescript
import { render, renderFilled, PALETTES } from 'oh-my-logo';

// ASCII art rendering
const logo = await render('HELLO WORLD', {
  palette: 'sunset',
  direction: 'horizontal',
  font: 'Standard'
});
console.log(logo);

// Filled block rendering
await renderFilled('AWESOME', { palette: 'fire' });
```

### Package.json Configuration
- **`main`**: Points to `dist/lib.js` (library entry)
- **`bin`**: Points to `dist/index.js` (CLI entry)  
- **`exports`**: Defines multiple entry points for different usage patterns

## Testing Strategy

The project uses **Vitest** for comprehensive testing:

### Test Structure
```
__tests__/
├── lib.test.ts           # Library API functions
├── palettes.test.ts      # Color palette system
├── renderer.test.ts      # ASCII art rendering (with mocks)
└── utils/
    ├── errors.test.ts    # Custom error classes
    └── stdout.test.ts    # TTY/color detection
```

### Coverage Goals
- **94 tests** covering critical functionality
- **100% coverage** on business logic (lib.ts, palettes.ts, utils/)
- **Mocked external dependencies** (figlet, ink, gradient-string)
- **Edge cases and error scenarios** thoroughly tested

### Running Tests
- Development: `npm test` (watch mode)
- CI/Coverage: `npm run test:coverage`
- Interactive: `npm run test:ui`