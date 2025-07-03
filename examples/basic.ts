/**
 * Basic oh-my-logo Library Usage Examples
 * 
 * This file demonstrates the fundamental features of oh-my-logo as a library.
 * Run with: node examples/basic.js (after compilation) or deno run examples/basic.ts
 */

import { 
  render, 
  PALETTES, 
  getPaletteNames, 
  getPalettePreview,
  type PaletteName 
} from "../dist/lib.js";

/**
 * Example 1: Simple ASCII art generation
 */
async function basicExample() {
  console.log("🎨 Example 1: Basic ASCII Art\n");
  
  // Generate ASCII art with default settings
  const logo = await render("HELLO");
  console.log(logo);
  console.log("\n" + "=".repeat(50) + "\n");
}

/**
 * Example 2: Using different color palettes
 */
async function paletteExample() {
  console.log("🌈 Example 2: Different Color Palettes\n");
  
  // Try a few different palettes
  const palettes: PaletteName[] = ["sunset", "ocean", "fire"];
  
  for (const palette of palettes) {
    console.log(`Palette: ${palette} (${getPalettePreview(palette)})`);
    const logo = await render("DEMO", { palette });
    console.log(logo);
    console.log();
  }
  
  console.log("=".repeat(50) + "\n");
}

/**
 * Example 3: List all available palettes
 */
function listPalettes() {
  console.log("🎭 Example 3: Available Color Palettes\n");
  
  const paletteNames = getPaletteNames();
  console.log(`Total palettes available: ${paletteNames.length}\n`);
  
  paletteNames.forEach((name: string) => {
    const colors = getPalettePreview(name as PaletteName);
    console.log(`• ${name.padEnd(12)} ${colors}`);
  });
  
  console.log("\n" + "=".repeat(50) + "\n");
}

/**
 * Example 4: Custom text with specific options
 */
async function customTextExample() {
  console.log("✨ Example 4: Custom Text and Options\n");
  
  // Your custom text here
  const customText = "NODE";
  
  console.log(`Rendering: "${customText}"`);
  console.log("Palette: matrix (classic green matrix colors)");
  
  const logo = await render(customText, {
    palette: "matrix",
    font: "Standard"
  });
  
  console.log(logo);
  console.log("\n" + "=".repeat(50) + "\n");
}

/**
 * Example 5: Working with PALETTES object
 */
function paletteObjectExample() {
  console.log("🔍 Example 5: Exploring Palette Colors\n");
  
  // Access palette colors directly
  console.log("Sunset palette colors:");
  console.log(PALETTES.sunset);
  
  console.log("\nFire palette colors:");
  console.log(PALETTES.fire);
  
  console.log("\nMatrix palette colors:");
  console.log(PALETTES.matrix);
  
  console.log("\n" + "=".repeat(50) + "\n");
}

/**
 * Example 6: Multi-line text
 */
async function multiLineExample() {
  console.log("📝 Example 6: Multi-line Text\n");
  
  const multiLineText = "OH\nMY\nLOGO";
  
  console.log(`Rendering multi-line text: "${multiLineText.replace(/\n/g, ' → ')}""`);
  
  const logo = await render(multiLineText, {
    palette: "purple"
  });
  
  console.log(logo);
  console.log("\n" + "=".repeat(50) + "\n");
}

/**
 * Main function to run all examples
 */
async function main() {
  console.log("🚀 oh-my-logo Library Examples\n");
  console.log("Make sure you've run 'npm run build' first!\n");
  console.log("=".repeat(50) + "\n");
  
  try {
    // Run all examples in sequence
    await basicExample();
    await paletteExample();
    listPalettes();
    await customTextExample();
    paletteObjectExample();
    await multiLineExample();
    
    console.log("✅ All examples completed successfully!");
    console.log("\nTry modifying the examples or create your own!");
    console.log("Check out advanced.ts for more complex features.");
    
  } catch (error) {
    console.error("❌ Error running examples:", error);
    console.error("\nMake sure you've run 'npm run build' first!");
  }
}

// Check if this is the main module (works in both Node.js and Deno)
const isMain = typeof require !== 'undefined' && require.main === module ||
               typeof import.meta !== 'undefined' && import.meta.url === `file://${process.argv[1]}`;

// Run the examples if this is the main module
if (isMain) {
  main();
}

// Export for potential use as a module
export { main };