#!/usr/bin/env node

import { Command } from 'commander';
import {
  render,
  renderFilled,
  getPaletteNames,
  getPalettePreview,
  PALETTES,
  DEFAULT_FONT,
  DEFAULT_PALETTE,
  resolveColors,
} from './lib.js';
import { shouldUseColor, stripAnsiCodes } from './utils/stdout.js';
import { PaletteError, InputError } from './utils/errors.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);

const program = new Command();

function stripWrappingQuotes(value: string): string {
  return value.replace(/^['"]+/, '').replace(/['"]+$/, '');
}

function parseJsonPalette(value: string): string[] {
  const candidates = [value];

  if (value.includes("'")) {
    candidates.push(value.replace(/'/g, '"'));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (!Array.isArray(parsed)) {
        continue;
      }

      const normalized = parsed.map((color) => {
        if (typeof color !== 'string') {
          throw new InputError('custom palette colors must be strings');
        }

        const trimmedColor = color.trim();
        if (!trimmedColor) {
          throw new InputError('custom palette colors must not be empty');
        }

        return trimmedColor;
      });

      if (normalized.length === 0) {
        throw new InputError('custom palette must include at least one color');
      }

      return normalized;
    } catch (error) {
      if (error instanceof InputError) {
        throw error;
      }
    }
  }

  throw new InputError('custom palette JSON could not be parsed');
}

function parseCommaSeparatedPalette(value: string): string[] {
  const colors = value
    .split(',')
    .map((part) => stripWrappingQuotes(part.trim()).trim())
    .filter((part) => part.length > 0);

  if (colors.length === 0) {
    throw new InputError('custom palette must include at least one color');
  }

  return colors;
}

function parsePaletteArgument(paletteArg: string): string {
  const trimmedArg = paletteArg.trim();

  if (!trimmedArg) {
    return DEFAULT_PALETTE;
  }

  return stripWrappingQuotes(trimmedArg).trim();
}

function parsePaletteColorsOption(colors: string): string[] {
  if (!colors || !colors.trim()) {
    throw new InputError('custom palette must include at least one color');
  }

  const trimmed = colors.trim();
  const unwrapped = stripWrappingQuotes(trimmed).trim();

  const looksLikeJson = unwrapped.startsWith('[') && unwrapped.endsWith(']');
  if (looksLikeJson) {
    return parseJsonPalette(unwrapped);
  }

  return parseCommaSeparatedPalette(unwrapped);
}

program
  .name('oh-my-logo')
  .description(
    'Display giant ASCII art logos with colorful gradients in your terminal'
  )
  .version(packageJson.version)
  .argument(
    '[text]',
    'Text to display (use "\\n" for newlines or "-" for stdin)'
  )
  .argument('[palette]', 'Color palette to use', DEFAULT_PALETTE)
  .option(
    '--palette-colors <colors>',
    'Custom colors as JSON array or comma-separated list'
  )
  .option(
    '-f, --font <name>',
    'Figlet font name',
    process.env.OHMYLOGO_FONT || DEFAULT_FONT
  )
  .option('-l, --list-palettes', 'List available palettes')
  .option('--gallery', 'Render text in all available palettes')
  .option('--color', 'Force color output even in pipes')
  .option('--no-color', 'Disable color output')
  .option(
    '-d, --direction <dir>',
    'Gradient direction: horizontal, vertical, or diagonal',
    'vertical'
  )
  .option('--filled', 'Use filled characters instead of outlined ASCII art')
  .option(
    '--block-font <font>',
    'Font for filled mode (3d, block, chrome, grid, huge, pallet, shade, simple, simple3d, simpleBlock, slick, tiny)',
    'block'
  )
  .option(
    '--letter-spacing <number>',
    'Letter spacing for filled mode',
    parseInt
  )
  .option('--reverse-gradient', 'Reverse gradient colors')
  .action(async (text: string | undefined, paletteArg: string, options) => {
    try {
      if (options.listPalettes) {
        console.log('Available palettes:');
        getPaletteNames().forEach((name) => {
          const preview = getPalettePreview(name as keyof typeof PALETTES);
          console.log(`  - ${name.padEnd(12)} ${preview}`);
        });
        process.exit(0);
      }

      if (!text) {
        throw new InputError(
          'Text is required when not using --list-palettes or --gallery'
        );
      }

      if (options.gallery) {
        // Render in all palettes
        let inputText = text;

        if (text === '-') {
          inputText = readFileSync(0, 'utf-8').trim();
        }

        if (!inputText || inputText.trim() === '') {
          throw new InputError('Text must not be empty');
        }

        inputText = inputText.replace(/\\n/g, '\n');

        const paletteNames = getPaletteNames();

        for (const paletteName of paletteNames) {
          console.log(
            `\n=== ${paletteName.toUpperCase()}${options.reverseGradient ? ' (reversed)' : ''} ===\n`
          );

          let paletteColors = resolveColors(paletteName);
          if (options.reverseGradient) {
            paletteColors = [...paletteColors].reverse();
          }

          if (options.filled) {
            // Validate letter spacing
            if (
              options.letterSpacing !== undefined &&
              options.letterSpacing < 0
            ) {
              throw new InputError('Letter spacing must be 0 or greater');
            }

            await renderFilled(inputText, {
              palette: paletteColors,
              font: options.blockFont,
              letterSpacing: options.letterSpacing,
            });
          } else {
            const logo = await render(inputText, {
              palette: paletteColors,
              font: options.font,
              direction: options.direction,
            });

            const useColor = shouldUseColor({
              forceColor: options.color,
              noColor: !options.color && options.noColor,
            });

            const output = useColor ? logo : stripAnsiCodes(logo);
            console.log(output);
          }
        }

        process.exit(0);
      }

      if (!text) {
        throw new InputError('Text is required when not using --list-palettes');
      }

      let inputText = text;

      if (text === '-') {
        inputText = readFileSync(0, 'utf-8').trim();
      }

      if (!inputText || inputText.trim() === '') {
        throw new InputError('Text must not be empty');
      }

      inputText = inputText.replace(/\\n/g, '\n');

      const paletteInput =
        options.paletteColors !== undefined && options.paletteColors !== null
          ? parsePaletteColorsOption(options.paletteColors)
          : parsePaletteArgument(paletteArg);

      // Validate and resolve palette
      let paletteColors: string[];
      try {
        paletteColors = resolveColors(paletteInput);
      } catch {
        if (
          typeof paletteInput === 'string' &&
          paletteInput !== DEFAULT_PALETTE
        ) {
          throw new PaletteError(paletteInput);
        }
        paletteColors = resolveColors(DEFAULT_PALETTE);
      }

      // Reverse colors if requested
      if (options.reverseGradient) {
        paletteColors = [...paletteColors].reverse();
      }

      if (options.filled) {
        // Validate letter spacing
        if (options.letterSpacing !== undefined && options.letterSpacing < 0) {
          throw new InputError('Letter spacing must be 0 or greater');
        }

        // Use Ink for filled characters
        await renderFilled(inputText, {
          palette: paletteColors,
          font: options.blockFont,
          letterSpacing: options.letterSpacing,
        });
      } else {
        // Use figlet for outlined ASCII art
        const logo = await render(inputText, {
          palette: paletteColors,
          font: options.font,
          direction: options.direction,
        });

        const useColor = shouldUseColor({
          forceColor: options.color,
          noColor: !options.color && options.noColor,
        });

        const output = useColor ? logo : stripAnsiCodes(logo);
        console.log(output);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error('An unexpected error occurred');
      }
      process.exit(1);
    }
  });

program.parse();
