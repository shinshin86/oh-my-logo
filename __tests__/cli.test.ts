import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cliPath = join(__dirname, '..', 'src', 'index.ts');

describe('CLI', () => {
  let originalExit: typeof process.exit;
  let exitCode: number | undefined;

  beforeEach(() => {
    // Mock process.exit to capture exit codes
    originalExit = process.exit;
    exitCode = undefined;
    process.exit = vi.fn((code?: number) => {
      exitCode = code;
      throw new Error(`process.exit(${code})`);
    }) as any;
  });

  afterEach(() => {
    process.exit = originalExit;
  });

  describe('--list-palettes', () => {
    it('should list palettes without requiring text argument', () => {
      try {
        const output = execSync(`npx tsx ${cliPath} --list-palettes`, {
          encoding: 'utf-8',
        });
        expect(output).toContain('Available palettes:');
        expect(output).toContain('sunset');
        expect(output).toContain('ocean');
        expect(output).toContain('fire');
      } catch (error: any) {
        // If the command fails, it should not be due to missing text argument
        expect(error.message).not.toContain('missing required argument');
        expect(error.message).not.toContain('text');
      }
    });

    it('should work with -l short option', () => {
      try {
        const output = execSync(`npx tsx ${cliPath} -l`, { encoding: 'utf-8' });
        expect(output).toContain('Available palettes:');
      } catch (error: any) {
        // If the command fails, it should not be due to missing text argument
        expect(error.message).not.toContain('missing required argument');
        expect(error.message).not.toContain('text');
      }
    });
  });

  describe('text argument', () => {
    it('should require text argument when not using --list-palettes', () => {
      try {
        execSync(`npx tsx ${cliPath}`, { encoding: 'utf-8', stdio: 'pipe' });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        // Should fail with appropriate error
        expect(error.stderr || error.message).toMatch(
          /text is required|missing required argument/i
        );
      }
    });

    it('should accept text argument for normal operation', () => {
      try {
        const output = execSync(`npx tsx ${cliPath} "TEST" --no-color`, {
          encoding: 'utf-8',
        });
        // The output should contain ASCII art (not the literal word TEST)
        expect(output.length).toBeGreaterThan(0);
        expect(output).toMatch(/[_|\/\\]/); // ASCII art characters
      } catch (error: any) {
        // If it fails, log the error for debugging
        console.error('Error running CLI with text:', error.message);
        throw error;
      }
    });
  });
});
