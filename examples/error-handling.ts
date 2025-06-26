/**
 * Error Handling Examples
 * 
 * This file demonstrates proper error handling when using oh-my-logo as a library.
 * Shows how to handle various error scenarios gracefully.
 * Run with: deno run examples/error-handling.ts
 */

import { 
  render, 
  renderFilled, 
  resolveColors,
  getPaletteNames,
  type RenderOptions,
  type RenderInkOptions 
} from "../dist/lib.js";

/**
 * Example 1: Handling invalid palette names
 */
async function invalidPaletteExample() {
  console.log("❌ Example 1: Invalid Palette Handling\n");
  
  const invalidPalettes = ["invalid-palette", "not-a-palette", ""];
  const text = "ERROR";
  
  for (const palette of invalidPalettes) {
    console.log(`Trying palette: "${palette}"`);
    
    try {
      const logo = await render(text, { palette });
      console.log("✅ Unexpectedly succeeded:", logo);
    } catch (error) {
      console.log(`❌ Expected error: ${error.message}`);
      
      // Fallback to default palette
      console.log("🔄 Falling back to default palette...");
      const fallbackLogo = await render(text);
      console.log("✅ Fallback successful!");
    }
    
    console.log();
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 2: Graceful fallback strategy
 */
async function gracefulFallbackExample() {
  console.log("🛡️ Example 2: Graceful Fallback Strategy\n");
  
  /**
   * Safe render function with fallback strategy
   */
  async function safeRender(
    text: string, 
    options: RenderOptions = {}
  ): Promise<string> {
    const fallbackOptions: RenderOptions = {
      palette: "grad-blue",
      font: "Standard",
      direction: "vertical"
    };
    
    try {
      // Try user options first
      return await render(text, options);
    } catch (error) {
      console.log(`⚠️ Primary render failed: ${error.message}`);
      
      try {
        // Try with fallback palette but keep other options
        const safePalette = Array.isArray(options.palette) 
          ? fallbackOptions.palette 
          : fallbackOptions.palette;
          
        return await render(text, {
          ...options,
          palette: safePalette
        });
      } catch (secondError) {
        console.log(`⚠️ Secondary render failed: ${secondError.message}`);
        
        // Final fallback with all safe options
        return await render(text, fallbackOptions);
      }
    }
  }
  
  // Test the safe render function
  const testCases = [
    { text: "SAFE", options: { palette: "invalid-palette" } },
    { text: "SAFE", options: { palette: "sunset", font: "InvalidFont" } },
    { text: "SAFE", options: { palette: ["not", "enough", "colors"] } }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${JSON.stringify(testCase.options)}`);
    const result = await safeRender(testCase.text, testCase.options);
    console.log("✅ Safe render completed successfully!\n");
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 3: Input validation
 */
async function inputValidationExample() {
  console.log("✅ Example 3: Input Validation\n");
  
  /**
   * Validate input before rendering
   */
  function validateInput(text: string, options: RenderOptions = {}): string[] {
    const errors: string[] = [];
    
    // Check text
    if (typeof text !== "string") {
      errors.push("Text must be a string");
    } else if (text.trim() === "") {
      errors.push("Text cannot be empty");
    } else if (text.length > 50) {
      errors.push("Text is too long (max 50 characters)");
    }
    
    // Check palette
    if (options.palette) {
      if (Array.isArray(options.palette)) {
        if (options.palette.length === 0) {
          errors.push("Palette array cannot be empty");
        } else if (options.palette.some(color => !color.match(/^#[0-9a-fA-F]{6}$/))) {
          errors.push("All palette colors must be valid hex colors (#RRGGBB)");
        }
      } else if (typeof options.palette === "string") {
        const availablePalettes = getPaletteNames();
        if (!availablePalettes.includes(options.palette)) {
          errors.push(`Palette "${options.palette}" is not available. Available: ${availablePalettes.join(", ")}`);
        }
      }
    }
    
    // Check direction
    if (options.direction && !["vertical", "horizontal", "diagonal"].includes(options.direction)) {
      errors.push("Direction must be 'vertical', 'horizontal', or 'diagonal'");
    }
    
    return errors;
  }
  
  // Test validation
  const testInputs = [
    { text: "", options: {} },
    { text: "VALID", options: { palette: "invalid-palette" } },
    { text: "VALID", options: { palette: ["#ff0000", "invalid-color"] } },
    { text: "VALID", options: { direction: "invalid-direction" as any } },
    { text: "VALID", options: { palette: "sunset" } } // This should be valid
  ];
  
  for (const input of testInputs) {
    console.log(`Validating: text="${input.text}", options=${JSON.stringify(input.options)}`);
    
    const errors = validateInput(input.text, input.options);
    
    if (errors.length > 0) {
      console.log("❌ Validation errors:");
      errors.forEach(error => console.log(`   • ${error}`));
    } else {
      console.log("✅ Validation passed!");
      try {
        const result = await render(input.text, input.options);
        console.log("✅ Render successful!");
      } catch (error) {
        console.log(`❌ Render failed despite validation: ${error.message}`);
      }
    }
    
    console.log();
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 4: Error recovery patterns
 */
async function errorRecoveryExample() {
  console.log("🔄 Example 4: Error Recovery Patterns\n");
  
  /**
   * Retry with exponential backoff (useful for temporary failures)
   */
  async function renderWithRetry(
    text: string, 
    options: RenderOptions = {},
    maxRetries: number = 3
  ): Promise<string> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries}...`);
        return await render(text, options);
      } catch (error) {
        lastError = error as Error;
        console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
        
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 100; // Exponential backoff
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw new Error(`Failed after ${maxRetries} attempts. Last error: ${lastError.message}`);
  }
  
  // Test retry mechanism (this will fail since we're using invalid options)
  try {
    console.log("Testing retry mechanism with invalid font...");
    await renderWithRetry("RETRY", { font: "NonexistentFont" });
  } catch (error) {
    console.log(`🔴 Final failure: ${error.message}`);
  }
  
  console.log("\n=".repeat(60) + "\n");
}

/**
 * Example 5: Type-safe error handling
 */
async function typeSafeErrorExample() {
  console.log("🔒 Example 5: Type-safe Error Handling\n");
  
  /**
   * Custom error types for better error handling
   */
  class RenderError extends Error {
    constructor(message: string, public readonly cause?: Error) {
      super(message);
      this.name = "RenderError";
    }
  }
  
  class ValidationError extends Error {
    constructor(message: string, public readonly field: string) {
      super(message);
      this.name = "ValidationError";
    }
  }
  
  /**
   * Type-safe render function
   */
  async function typeSafeRender(text: string, options: RenderOptions = {}): Promise<string> {
    // Validation
    if (!text || text.trim() === "") {
      throw new ValidationError("Text cannot be empty", "text");
    }
    
    if (options.palette && Array.isArray(options.palette) && options.palette.length === 0) {
      throw new ValidationError("Palette array cannot be empty", "palette");
    }
    
    try {
      return await render(text, options);
    } catch (error) {
      throw new RenderError("Failed to render logo", error as Error);
    }
  }
  
  // Test type-safe error handling
  const testCases = [
    { text: "", options: {} },
    { text: "VALID", options: { palette: [] } },
    { text: "VALID", options: { palette: "sunset" } }
  ];
  
  for (const testCase of testCases) {
    try {
      console.log(`Testing: ${JSON.stringify(testCase)}`);
      const result = await typeSafeRender(testCase.text, testCase.options);
      console.log("✅ Success!");
    } catch (error) {
      if (error instanceof ValidationError) {
        console.log(`❌ Validation Error in ${error.field}: ${error.message}`);
      } else if (error instanceof RenderError) {
        console.log(`❌ Render Error: ${error.message}`);
        if (error.cause) {
          console.log(`   Caused by: ${error.cause.message}`);
        }
      } else {
        console.log(`❌ Unexpected Error: ${error.message}`);
      }
    }
    console.log();
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Example 6: Defensive programming practices
 */
async function defensiveProgrammingExample() {
  console.log("🛡️ Example 6: Defensive Programming\n");
  
  /**
   * Robust logo generator with defensive programming
   */
  class LogoGenerator {
    private defaultOptions: Required<RenderOptions> = {
      palette: "grad-blue",
      font: "Standard",
      direction: "vertical"
    };
    
    async generateLogo(text: string, userOptions: Partial<RenderOptions> = {}): Promise<string> {
      // Sanitize input
      const sanitizedText = this.sanitizeText(text);
      const safeOptions = this.sanitizeOptions(userOptions);
      
      console.log(`Generating logo for: "${sanitizedText}"`);
      console.log(`Using options:`, safeOptions);
      
      try {
        return await render(sanitizedText, safeOptions);
      } catch (error) {
        console.log(`⚠️ Render failed, using fallback...`);
        return await render(sanitizedText, this.defaultOptions);
      }
    }
    
    private sanitizeText(text: string): string {
      if (typeof text !== "string") {
        console.log("⚠️ Text is not a string, converting...");
        text = String(text);
      }
      
      // Remove dangerous characters, limit length
      const sanitized = text
        .replace(/[^\w\s\\-]/g, "") // Only allow word chars, spaces, backslashes, hyphens
        .slice(0, 20) // Limit length
        .trim();
      
      if (sanitized === "") {
        console.log("⚠️ Text became empty after sanitization, using default");
        return "LOGO";
      }
      
      if (sanitized !== text) {
        console.log(`⚠️ Text sanitized: "${text}" → "${sanitized}"`);
      }
      
      return sanitized;
    }
    
    private sanitizeOptions(options: Partial<RenderOptions>): RenderOptions {
      const safeOptions: RenderOptions = { ...this.defaultOptions };
      
      // Safely handle palette
      if (options.palette) {
        try {
          // Test if the palette works
          resolveColors(options.palette);
          safeOptions.palette = options.palette;
        } catch (error) {
          console.log(`⚠️ Invalid palette, using default: ${error.message}`);
        }
      }
      
      // Safely handle direction
      if (options.direction && ["vertical", "horizontal", "diagonal"].includes(options.direction)) {
        safeOptions.direction = options.direction;
      } else if (options.direction) {
        console.log(`⚠️ Invalid direction "${options.direction}", using default`);
      }
      
      // Safely handle font
      if (options.font && typeof options.font === "string") {
        safeOptions.font = options.font; // Let render() handle font validation
      }
      
      return safeOptions;
    }
  }
  
  // Test the defensive logo generator
  const generator = new LogoGenerator();
  
  const testCases = [
    { text: "SAFE", options: {} },
    { text: "UNSAFE!@#$%", options: { palette: "sunset" } },
    { text: 123 as any, options: { direction: "invalid" as any } },
    { text: "", options: { palette: "nonexistent" } }
  ];
  
  for (const testCase of testCases) {
    console.log(`Input: text=${testCase.text}, options=${JSON.stringify(testCase.options)}`);
    const result = await generator.generateLogo(testCase.text, testCase.options);
    console.log("✅ Generated successfully!\n");
  }
  
  console.log("=".repeat(60) + "\n");
}

/**
 * Main function to run all error handling examples
 */
async function main() {
  console.log("🛠️ oh-my-logo Error Handling Examples\n");
  console.log("Learning how to handle errors gracefully and build robust applications!\n");
  console.log("=".repeat(60) + "\n");
  
  try {
    await invalidPaletteExample();
    await gracefulFallbackExample();
    await inputValidationExample();
    await errorRecoveryExample();
    await typeSafeErrorExample();
    await defensiveProgrammingExample();
    
    console.log("✅ All error handling examples completed!");
    console.log("\nKey takeaways:");
    console.log("• Always validate inputs before processing");
    console.log("• Implement graceful fallbacks for known failure scenarios");
    console.log("• Use try-catch blocks around library calls");
    console.log("• Consider retry mechanisms for transient failures");
    console.log("• Sanitize user inputs to prevent unexpected behavior");
    console.log("• Use type-safe error handling for better debugging");
    console.log("\nYou're now ready to use oh-my-logo robustly in production!");
    
  } catch (error) {
    console.error("❌ Error running error handling examples:", error);
    console.error("\nMake sure you've run 'npm run build' first!");
  }
}

// Run the error handling examples
if (import.meta.main) {
  main();
}