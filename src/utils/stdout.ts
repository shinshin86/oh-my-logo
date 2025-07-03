export interface ColorOptions {
  forceColor?: boolean;
  noColor?: boolean;
}

// Cache color detection result to avoid repeated environment checks
let colorDetectionCache: { result: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5000; // 5 seconds

export function shouldUseColor(options: ColorOptions = {}): boolean {
  // Force color takes highest precedence
  if (options.forceColor) {
    return true;
  }
  
  // No color option
  if (options.noColor) {
    return false;
  }
  
  // Check cache for environment-based detection
  const now = Date.now();
  if (colorDetectionCache && (now - colorDetectionCache.timestamp) < CACHE_DURATION) {
    return colorDetectionCache.result;
  }
  
  let result: boolean;
  
  // Check NO_COLOR environment variable
  if (process.env.NO_COLOR) {
    result = false;
  }
  // Check FORCE_COLOR environment variable
  else if (process.env.FORCE_COLOR) {
    result = true;
  }
  // Check if running in CI with color support
  else if (process.env.CI && (process.env.COLORTERM || process.env.TERM_PROGRAM)) {
    result = true;
  }
  // Default to TTY detection
  else {
    result = process.stdout.isTTY ?? false;
  }
  
  // Cache the result
  colorDetectionCache = { result, timestamp: now };
  
  return result;
}

// Pre-compiled regex for better performance
const ANSI_REGEX = /\u001b\[[0-9;]*[a-zA-Z]/g;

export function stripAnsiCodes(text: string): string {
  // Reset regex lastIndex to ensure consistent behavior
  ANSI_REGEX.lastIndex = 0;
  return text.replace(ANSI_REGEX, '');
}

// Function to clear color detection cache
export function clearColorCache(): void {
  colorDetectionCache = null;
}