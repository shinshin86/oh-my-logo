/**
 * Basic Library Usage Examples
 * Demonstrates fundamental oh-my-logo library features
 */

import { render, renderFilled, PALETTES, getPaletteNames } from 'oh-my-logo';

console.log('🎨 Basic Library Usage Examples\n');

// Example 1: Simple ASCII art generation
console.log('1. Simple ASCII Art:');
const logo = await render('HELLO');
console.log(logo);
console.log('\n' + '='.repeat(50) + '\n');

// Example 2: Using different palettes
console.log('2. Different Color Palettes:');
const palettes = ['sunset', 'ocean', 'fire', 'matrix'];

for (const palette of palettes) {
  console.log(`Palette: ${palette}`);
  const coloredLogo = await render('DEMO', { palette });
  console.log(coloredLogo);
  console.log();
}

console.log('='.repeat(50) + '\n');

// Example 3: Gradient directions
console.log('3. Gradient Directions:');
const directions = ['vertical', 'horizontal', 'diagonal'];

for (const direction of directions) {
  console.log(`Direction: ${direction}`);
  const directionLogo = await render('GRAD', { 
    palette: 'purple', 
    direction 
  });
  console.log(directionLogo);
  console.log();
}

console.log('='.repeat(50) + '\n');

// Example 4: Custom colors
console.log('4. Custom Color Arrays:');
const customColors = ['#ff0080', '#8000ff', '#0080ff'];
const customLogo = await render('CUSTOM', { 
  palette: customColors,
  direction: 'horizontal'
});
console.log(customLogo);
console.log('\n' + '='.repeat(50) + '\n');

// Example 5: Filled characters
console.log('5. Filled Block Characters:');
await renderFilled('FILLED', { palette: 'fire' });
console.log('\n' + '='.repeat(50) + '\n');

// Example 6: List all available palettes
console.log('6. Available Palettes:');
const allPalettes = getPaletteNames();
console.log(`Total palettes: ${allPalettes.length}`);
allPalettes.forEach(name => {
  const colors = PALETTES[name];
  console.log(`• ${name.padEnd(12)} ${colors.join(' → ')}`);
});