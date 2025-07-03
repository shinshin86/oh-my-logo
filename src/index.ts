#!/usr/bin/env node

import { Command } from 'commander';
import { render, renderFilled, getPaletteNames, getPalettePreview, PALETTES, DEFAULT_FONT, DEFAULT_PALETTE, resolveColors } from './lib.js';
import { shouldUseColor, stripAnsiCodes } from './utils/stdout.js';
import { PaletteError, InputError } from './utils/errors.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));

const program = new Command();

program
  .name('oh-my-logo')
  .description('Display giant ASCII art logos with colorful gradients in your terminal')
  .version(packageJson.version)
  .argument('<text>', 'Text to display (use "\\n" for newlines or "-" for stdin)')
  .argument('[palette]', 'Color palette to use', DEFAULT_PALETTE)
  .option('-f, --font <name>', 'Figlet font name', process.env.OHMYLOGO_FONT || DEFAULT_FONT)
  .option('-l, --list-palettes', 'List available palettes')
  .option('--color', 'Force color output even in pipes')
  .option('--no-color', 'Disable color output')
  .option('-d, --direction <dir>', 'Gradient direction: horizontal, vertical, or diagonal', 'vertical')
  .option('--filled', 'Use filled characters instead of outlined ASCII art')
  .action(async (text: string, paletteArg: string, options) => {
    try {
      if (options.listPalettes) {
        console.log('Available palettes:');
        getPaletteNames().forEach(name => {
          const preview = getPalettePreview(name as keyof typeof PALETTES);
          console.log(`  - ${name.padEnd(12)} ${preview}`);
        });
        process.exit(0);
      }

      let inputText = text;
      
      if (text === '-') {
        inputText = readFileSync(0, 'utf-8').trim();
      }
      
      if (!inputText || inputText.trim() === '') {
        throw new InputError('Text must not be empty');
      }
      
      inputText = inputText.replace(/\\n/g, '\n');
      
      // Validate palette
      try {
        resolveColors(paletteArg);
      } catch {
        if (paletteArg !== DEFAULT_PALETTE) {
          throw new PaletteError(paletteArg);
        }
      }
      
      if (options.filled) {
        // Use Ink for filled characters
        await renderFilled(inputText, { palette: paletteArg });
        
        // Force exit after Ink rendering completes
        setTimeout(() => {
          process.exit(0);
        }, 100);
      } else {
        // Use figlet for outlined ASCII art
        const logo = await render(inputText, {
          palette: paletteArg,
          font: options.font,
          direction: options.direction
        });
        
        const useColor = shouldUseColor({
          forceColor: options.color,
          noColor: !options.color && options.noColor
        });
        
        const output = useColor ? logo : stripAnsiCodes(logo);
        console.log(output);
        
        // Exit immediately for regular ASCII art
        process.exit(0);
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

// Handle process signals for clean exit
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

// Ensure process exits if it hangs
const exitTimeout = setTimeout(() => {
  console.error('Process timeout - forcing exit');
  process.exit(1);
}, 5000); // 5 second timeout

// Clear timeout if process exits normally
process.on('exit', () => {
  clearTimeout(exitTimeout);
});

program.parse();