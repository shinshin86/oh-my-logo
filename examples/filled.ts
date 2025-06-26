/**
 * Filled Character Rendering Examples
 * 
 * This file demonstrates the renderFilled() function which creates solid block
 * characters using React/Ink instead of traditional ASCII art.
 * Run with: deno run examples/filled.ts
 */

import { 
  renderFilled, 
  getPaletteNames, 
  getPalettePreview,
  type PaletteName,
  type RenderInkOptions 
} from "../dist/lib.js";

/**
 * Example 1: Basic filled character rendering
 */
async function basicFilledExample() {
  console.log("🔲 Example 1: Basic Filled Character Rendering\n");
  
  console.log("Rendering 'FILLED' with default settings...");
  await renderFilled("FILLED");
  
  console.log("\n" + "=".repeat(50) + "\n");
}

/**
 * Example 2: Palette comparison with filled characters
 */
async function paletteComparisonExample() {
  console.log("🌈 Example 2: Palette Comparison (Filled)\n");
  
  const palettes: PaletteName[] = ["sunset", "ocean", "fire", "matrix"];
  const text = "DEMO";
  
  for (const palette of palettes) {
    console.log(`Palette: ${palette} (${getPalettePreview(palette)})`);
    await renderFilled(text, { palette });
    console.log(); // Add some spacing
  }
  
  console.log("=".repeat(50) + "\n");
}

/**
 * Example 3: Custom colors with filled rendering
 */
async function customColorsFilledExample() {
  console.log("🎨 Example 3: Custom Colors (Filled)\n");
  
  const customPalettes = {
    "neon": ["#ff00ff", "#00ffff", "#ffff00"],
    "earth": ["#8B4513", "#228B22", "#4169E1"],
    "pastel": ["#FFB6C1", "#98FB98", "#87CEEB"],
  };
  
  const text = "COLOR";
  
  for (const [name, colors] of Object.entries(customPalettes)) {
    console.log(`Custom palette: ${name}`);
    console.log(`Colors: ${colors.join(" → ")}`);
    
    await renderFilled(text, { palette: colors });
    console.log();
  }
  
  console.log("=".repeat(50) + "\n");
}

/**
 * Example 4: Multi-line text with filled characters
 */
async function multiLineFilledExample() {
  console.log("📝 Example 4: Multi-line Filled Text\n");
  
  console.log("Rendering multi-line text: OH MY LOGO");
  await renderFilled("OH\\nMY\\nLOGO", {
    palette: "purple"
  });
  
  console.log();
  console.log("Rendering with fire palette:");
  await renderFilled("MULTI\\nLINE", {
    palette: "fire"
  });
  
  console.log("\n" + "=".repeat(50) + "\n");
}

/**
 * Example 5: Short text examples
 */
async function shortTextExample() {
  console.log("📏 Example 5: Short Text Examples\n");
  
  const shortTexts = ["A", "OK", "YES", "GO"];
  const palettes: PaletteName[] = ["grad-blue", "sunset", "ocean", "matrix"];
  
  for (let i = 0; i < shortTexts.length; i++) {
    const text = shortTexts[i];
    const palette = palettes[i];
    
    console.log(`Text: "${text}" with ${palette} palette`);
    await renderFilled(text, { palette });
    console.log();
  }
  
  console.log("=".repeat(50) + "\n");
}

/**
 * Example 6: Comparing ASCII vs Filled rendering
 */
async function comparisonExample() {
  console.log("⚖️ Example 6: ASCII vs Filled Comparison\n");
  
  // Import render function for comparison
  const { render } = await import("../dist/lib.js");
  
  const text = "COMPARE";
  const palette = "sunset";
  
  console.log("Traditional ASCII Art:")
  console.log("-".repeat(25));
  const asciiResult = await render(text, { palette });
  console.log(asciiResult);
  
  console.log("\nFilled Block Characters:");
  console.log("-".repeat(25));
  await renderFilled(text, { palette });
  
  console.log("\n" + "=".repeat(50) + "\n");
}

/**
 * Example 7: All available palettes showcase
 */
async function showcaseAllPalettes() {
  console.log("🎭 Example 7: All Palettes Showcase\n");
  
  const allPalettes = getPaletteNames();
  const text = "DEMO";
  
  console.log(`Showcasing all ${allPalettes.length} available palettes:\n`);
  
  for (const palette of allPalettes) {
    console.log(`${palette}:`);
    await renderFilled(text, { palette: palette as PaletteName });
    console.log();
  }
  
  console.log("=".repeat(50) + "\n");
}

/**
 * Example 8: Performance timing
 */
async function performanceExample() {
  console.log("⚡ Example 8: Performance Test\n");
  
  const text = "PERF";
  const iterations = 5;
  
  console.log(`Rendering "${text}" ${iterations} times with filled characters...`);
  
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    await renderFilled(text, { palette: "sunset" });
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per render: ${avgTime.toFixed(2)}ms`);
  
  console.log("\n=".repeat(50) + "\n");
}

/**
 * Helper function to add delay between examples
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function to run all filled examples
 */
async function main() {
  console.log("🔲 oh-my-logo Filled Character Examples\n");
  console.log("Exploring solid block character rendering with React/Ink!\n");
  console.log("=".repeat(50) + "\n");
  
  try {
    await basicFilledExample();
    await delay(500); // Small delay for better readability
    
    await paletteComparisonExample();
    await delay(500);
    
    await customColorsFilledExample();
    await delay(500);
    
    await multiLineFilledExample();
    await delay(500);
    
    await shortTextExample();
    await delay(500);
    
    await comparisonExample();
    await delay(500);
    
    // Uncomment to see all palettes (takes a while)
    // console.log("⏳ Running full palette showcase (this may take a moment)...");
    // await showcaseAllPalettes();
    
    await performanceExample();
    
    console.log("✅ All filled character examples completed!");
    console.log("\nKey differences from ASCII rendering:");
    console.log("• Uses solid block characters instead of outlined text");
    console.log("• Powered by React and Ink for rendering");
    console.log("• Better for bold, impactful text displays");
    console.log("• Renders directly to stdout (returns void)");
    console.log("\nTry error-handling.ts next for robust error handling!");
    
  } catch (error) {
    console.error("❌ Error running filled examples:", error);
    console.error("\nMake sure you've run 'npm run build' first!");
    console.error("Note: Filled rendering requires React/Ink dependencies.");
  }
}

// Run the filled examples
if (import.meta.main) {
  main();
}