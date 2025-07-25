export interface ColorOptions {
  forceColor?: boolean;
  noColor?: boolean;
}

export function shouldUseColor(options: ColorOptions = {}): boolean {
  // Force color takes highest precedence
  if (options.forceColor) {
    return true;
  }

  // No color option
  if (options.noColor) {
    return false;
  }

  // Check NO_COLOR environment variable
  if (process.env.NO_COLOR) {
    return false;
  }

  // Check FORCE_COLOR environment variable
  if (process.env.FORCE_COLOR) {
    return true;
  }

  // Check if running in CI with color support
  if (process.env.CI && (process.env.COLORTERM || process.env.TERM_PROGRAM)) {
    return true;
  }

  // Default to TTY detection
  return process.stdout.isTTY ?? false;
}

export function stripAnsiCodes(text: string): string {
  // More comprehensive regex for ANSI escape sequences
  const ansiRegex = /\u001b\[[0-9;]*[a-zA-Z]/g;
  return text.replace(ansiRegex, '');
}
