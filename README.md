# oh-my-logo

![Logo](./images/logo.png)

Create stunning ASCII art logos with beautiful gradient colors in your terminal! Perfect for project banners, startup logos, or just making your terminal look awesome.

## ✨ Features

- 🎨 **Two Rendering Modes**: Choose between outlined ASCII art or filled block characters
- 🌈 **13 Beautiful Palettes**: From sunset gradients to matrix green
- 📐 **Gradient Directions**: Vertical, horizontal, and diagonal gradients
- 🔤 **Multi-line Support**: Create logos with multiple lines of text
- ⚡ **Zero Dependencies**: Run instantly with `npx` - no installation required
- 🎛️ **Customizable**: Use different fonts and create your own color schemes

## 🚀 Quick Start

No installation needed! Try it right now:

```bash
npx oh-my-logo "HELLO WORLD"
```

Want filled characters? Add the `--filled` flag:

```bash
npx oh-my-logo "YOUR LOGO" sunset --filled
```

## 📦 Installation

### Global Installation (CLI)
```bash
npm install -g oh-my-logo
```

### Or Use Directly with npx
```bash
npx oh-my-logo "Your Text"
```

### As a Library
```bash
npm install oh-my-logo
```

## 🎯 Usage

### CLI Usage

```bash
oh-my-logo <text> [palette] [options]
```

### Library Usage

```javascript
import { render, renderFilled, PALETTES, getPaletteNames } from 'oh-my-logo';

// Basic ASCII art rendering
const logo = await render('HELLO WORLD', {
  palette: 'sunset',
  direction: 'horizontal'
});
console.log(logo);

// Using custom colors
const customLogo = await render('MY BRAND', {
  palette: ['#ff0000', '#00ff00', '#0000ff'],
  font: 'Big',
  direction: 'diagonal'
});
console.log(customLogo);

// Filled block characters
await renderFilled('AWESOME', {
  palette: 'fire'
});

// TypeScript usage
import { render, RenderOptions, PaletteName } from 'oh-my-logo';

const options: RenderOptions = {
  palette: 'ocean' as PaletteName,
  direction: 'vertical',
  font: 'Standard'
};

const typedLogo = await render('TYPESCRIPT', options);
console.log(typedLogo);

// Access palette information
console.log('Available palettes:', getPaletteNames());
console.log('Sunset colors:', PALETTES.sunset);
```

### Arguments

- **`<text>`**: Text to display
  - Use `"\n"` for newlines: `"LINE1\nLINE2"`
  - Use `"-"` to read from stdin
- **`[palette]`**: Color palette name (default: `grad-blue`)

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-f, --font <name>` | Figlet font name | `Standard` |
| `-d, --direction <dir>` | Gradient direction (`vertical`, `horizontal`, `diagonal`) | `vertical` |
| `--filled` | Use filled block characters instead of outlined ASCII | `false` |
| `-l, --list-palettes` | Show all available color palettes | - |
| `--color` | Force color output (useful for pipes) | - |
| `--no-color` | Disable color output | - |
| `-v, --version` | Show version number | - |
| `-h, --help` | Show help information | - |

## 🎨 Available Palettes (13 Total)

View all palettes with preview colors:

```bash
npx oh-my-logo "" --list-palettes
```

| Palette | Colors | Description |
|---------|--------|-------------|
| `grad-blue` | `#4ea8ff → #7f88ff` | Blue gradient (default) |
| `sunset` | `#ff9966 → #ff5e62 → #ffa34e` | Warm sunset colors |
| `dawn` | `#00c6ff → #0072ff` | Cool morning blues |
| `nebula` | `#654ea3 → #eaafc8` | Purple space nebula |
| `ocean` | `#667eea → #764ba2` | Deep ocean blues |
| `fire` | `#ff0844 → #ffb199` | Intense fire colors |
| `forest` | `#134e5e → #71b280` | Natural green tones |
| `gold` | `#f7971e → #ffd200` | Luxurious gold gradient |
| `purple` | `#667db6 → #0082c8 → #0078ff` | Royal purple to blue |
| `mint` | `#00d2ff → #3a7bd5` | Fresh mint colors |
| `coral` | `#ff9a9e → #fecfef` | Soft coral pink |
| `matrix` | `#00ff41 → #008f11` | Classic matrix green |
| `mono` | `#f07178 → #f07178` | Single coral color |

## 💡 Examples

### Basic Usage

```bash
# Simple logo with default blue gradient
npx oh-my-logo "STARTUP"

# Multi-line company logo
npx oh-my-logo "MY\nCOMPANY" sunset

# Matrix-style hacker text
npx oh-my-logo "HACK THE PLANET" matrix --filled
```

### Different Rendering Modes

```bash
# Outlined ASCII art (default)
npx oh-my-logo "CODE" fire

# Filled block characters
npx oh-my-logo "CODE" fire --filled
```

### Gradient Directions

```bash
# Vertical gradient (default)
npx oh-my-logo "LOGO" ocean

# Horizontal gradient
npx oh-my-logo "LOGO" ocean -d horizontal

# Diagonal gradient
npx oh-my-logo "LOGO" ocean -d diagonal
```

### Custom Fonts

```bash
# List available fonts (depends on your figlet installation)
figlet -f

# Use a different font
npx oh-my-logo "RETRO" purple -f "Big"
```

### Pipeline and Scripting

```bash
# Read from stdin
echo "DYNAMIC LOGO" | npx oh-my-logo - gold --filled

# Force colors in scripts
npx oh-my-logo "DEPLOY SUCCESS" forest --color

# Plain text output
npx oh-my-logo "LOG ENTRY" --no-color
```

## 🎭 Use Cases

- **Project Banners**: Add eye-catching headers to your README files
- **Terminal Startup**: Display your company logo when opening terminals  
- **CI/CD Pipelines**: Make deployment logs more visually appealing
- **Development Tools**: Brand your CLI applications
- **Presentations**: Create stunning terminal demos
- **Personal Branding**: Add flair to your shell prompt or scripts

## ⚙️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OHMYLOGO_FONT` | Default figlet font | `export OHMYLOGO_FONT="Big"` |

## 📚 Library API

### Core Functions

#### `render(text, options?)`
Renders ASCII art with gradient colors.

```typescript
async function render(text: string, options?: RenderOptions): Promise<string>
```

- **text** (string): Text to display
- **options.palette** (PaletteName | string[]): Color palette name or custom colors
- **options.font** (string): Figlet font name (default: 'Standard')
- **options.direction** ('vertical' | 'horizontal' | 'diagonal'): Gradient direction

Returns: `Promise<string>` - The colored ASCII art

#### `renderFilled(text, options?)`
Renders filled block characters with gradient.

```typescript
async function renderFilled(text: string, options?: RenderInkOptions): Promise<void>
```

- **text** (string): Text to display
- **options.palette** (PaletteName | string[]): Color palette name or custom colors

Returns: `Promise<void>` - Renders directly to stdout

### Palette Functions

- **`PALETTES`**: Object containing all built-in color palettes
- **`resolvePalette(name)`**: Get palette colors by name
- **`getPaletteNames()`**: Get array of all palette names
- **`getDefaultPalette()`**: Get the default palette colors
- **`getPalettePreview(name)`**: Get a preview string of palette colors

### Type Definitions

```typescript
type PaletteName = 'grad-blue' | 'sunset' | 'dawn' | 'nebula' | 'ocean' | 
                   'fire' | 'forest' | 'gold' | 'purple' | 'mint' | 
                   'coral' | 'matrix' | 'mono';

interface RenderOptions {
  palette?: PaletteName | string[];
  font?: string;
  direction?: 'vertical' | 'horizontal' | 'diagonal';
}

interface RenderInkOptions {
  palette?: PaletteName | string[];
}
```

## 🛠️ Development

Want to contribute or customize?

```bash
git clone https://github.com/yourusername/oh-my-logo.git
cd oh-my-logo
npm install

# Development mode
npm run dev -- "TEST" sunset --filled

# Build
npm run build

# Test the built version
node dist/index.js "HELLO" matrix --filled
```

### Adding New Palettes

Edit `src/palettes.ts` to add your own color combinations:

```typescript
export const PALETTES = {
  // ... existing palettes
  'my-palette': ['#ff0000', '#00ff00', '#0000ff'],
} as const;
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Whether it's:

- 🎨 New color palettes
- 🔧 Bug fixes
- ✨ New features
- 📖 Documentation improvements

## 📄 License

MIT © [Your Name]

---

**Made with ❤️ for the terminal lovers**

*Transform your boring text into stunning visual logos!*