/**
 * Advanced oh-my-logo Library Usage Examples
 * 
 * This file demonstrates advanced features like custom colors, gradient directions,
 * and different font options.
 * Run with: node examples/advanced.js (after compilation) or deno run examples/advanced.ts
 */

import { render, type RenderOptions } from "../dist/lib.js";

/**
 * Example 1: Gradient Direction Comparison
 */
async function gradientDirectionExample() {
  console.log("🌈 Example 1: Gradient Direction Comparison\n");
  
  const text = "GRAD";
  const palette = "sunset";
  const directions: Array<"vertical" | "horizontal" | "diagonal"> = [
    "vertical", "horizontal", "diagonal"
  ];
  
  for (const direction of directions) {
    console.log(`Direction: ${direction.toUpperCase()}`);
    console.log("-".repeat(direction.length + 11));
    
    const logo = await render(text, {
      palette,
      direction
    });
    
    console.log(logo);
    console.log();
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 2: Custom Color Palettes
 */
async function customColorsExample() {
  console.log("🎨 Example 2: Custom Color Palettes\n");
  
  const text = "CUSTOM";
  
  // Define custom color palettes
  const customPalettes = {
    "neon": ["#ff00ff", "#00ffff", "#ffff00"], // Neon colors
    "earth": ["#8B4513", "#228B22", "#4169E1"], // Earth tones
    "pastel": ["#FFB6C1", "#98FB98", "#87CEEB"], // Pastel colors
    "monochrome": ["#000000", "#666666", "#FFFFFF"] // Black to white
  };
  
  for (const [name, colors] of Object.entries(customPalettes)) {
    console.log(`Custom palette: ${name}`);
    console.log(`Colors: ${colors.join(" → ")}`);
    
    const logo = await render(text, {
      palette: colors,
      direction: "horizontal"
    });
    
    console.log(logo);
    console.log();
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 3: Font Comparison
 * Note: Available fonts depend on your system's figlet installation
 */
async function fontExample() {
  console.log("🔤 Example 3: Different Fonts\n");
  
  const text = "FONT";
  const fonts = ["Standard", "Big", "Small"];
  
  for (const font of fonts) {
    console.log(`Font: ${font}`);
    console.log("-".repeat(font.length + 6));
    
    try {
      const logo = await render(text, {
        palette: "ocean",
        font: font,
        direction: "vertical"
      });
      
      console.log(logo);
    } catch (error) {
      console.log(`❌ Font "${font}" not available on this system`);
      console.log(`Error: ${(error as Error).message}`);
    }
    
    console.log();
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 4: Complex Combinations
 */
async function complexExample() {
  console.log("🚀 Example 4: Complex Feature Combinations\n");
  
  const configurations: Array<{
    name: string;
    text: string;
    options: RenderOptions;
  }> = [
    {
      name: "Neon Diagonal",
      text: "NEON",
      options: {
        palette: ["#ff0080", "#8000ff", "#0080ff"],
        direction: "diagonal",
        font: "Standard"
      }
    },
    {
      name: "Fire Horizontal",
      text: "FIRE",
      options: {
        palette: "fire",
        direction: "horizontal",
        font: "Standard"
      }
    },
    {
      name: "Matrix Vertical",
      text: "MATRIX",
      options: {
        palette: "matrix",
        direction: "vertical",
        font: "Standard"
      }
    }
  ];
  
  for (const config of configurations) {
    console.log(`Configuration: ${config.name}`);
    console.log(`Text: "${config.text}"`);
    console.log(`Options:`, config.options);
    console.log("-".repeat(40));
    
    const logo = await render(config.text, config.options);
    console.log(logo);
    console.log();
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 5: Real-world Use Cases
 */
async function realWorldExample() {
  console.log("💼 Example 5: Real-world Use Cases\n");
  
  // Startup logo
  console.log("🏢 Startup Logo:");
  const startupLogo = await render("STARTUP", {
    palette: "gold",
    direction: "horizontal"
  });
  console.log(startupLogo);
  console.log();
  
  // Game title
  console.log("🎮 Game Title:");
  const gameTitle = await render("GAME", {
    palette: ["#ff4444", "#ff8844", "#ffff44"],
    direction: "diagonal"
  });
  console.log(gameTitle);
  console.log();
  
  // Developer signature
  console.log("👨‍💻 Developer Signature:");
  const devSignature = await render("DEV", {
    palette: "nebula",
    direction: "vertical"
  });
  console.log(devSignature);
  console.log();
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 6: Performance Comparison
 */
async function performanceExample() {
  console.log("⚡ Example 6: Performance Test\n");
  
  const text = "PERF";
  const iterations = 10;
  
  console.log(`Rendering "${text}" ${iterations} times...`);
  
  const startTime = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    await render(text, {
      palette: "sunset",
      direction: "vertical"
    });
  }
  
  const endTime = performance.now();
  const totalTime = endTime - startTime;
  const avgTime = totalTime / iterations;
  
  console.log(`Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`Average time per render: ${avgTime.toFixed(2)}ms`);
  console.log(`Renders per second: ${(1000 / avgTime).toFixed(1)}`);
  
  console.log("\n=".repeat(60) + "\n");
}

/**
 * Main function to run all advanced examples
 */
async function main() {
  console.log("🎯 oh-my-logo Advanced Examples\n");
  console.log("Exploring gradient directions, custom colors, and more!\n");
  console.log("=".repeat(60) + "\n");
  
  try {
    await gradientDirectionExample();
    await customColorsExample();
    await fontExample();
    await complexExample();
    await realWorldExample();
    await performanceExample();
    
    console.log("✅ All advanced examples completed!");
    console.log("\nNext steps:");
    console.log("• Try filled.ts for block character rendering");
    console.log("• Check error-handling.ts for robust error handling");
    console.log("• Create your own custom combinations!");
    
  } catch (error) {
    console.error("❌ Error running advanced examples:", error);
    console.error("\nMake sure you've run 'npm run build' first!");
  }
}

// Check if this is the main module (works in both Node.js and Deno)
const isMain = typeof require !== 'undefined' && require.main === module ||
               typeof import.meta !== 'undefined' && import.meta.url === `file://${process.argv[1]}`;

// Run the advanced examples
if (isMain) {
  main();
}

// Export for potential use as a module
export { main };