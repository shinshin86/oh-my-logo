import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderInkLogo } from '../src/InkRenderer.js';

vi.mock('ink', () => ({
  render: vi.fn(() => ({
    unmount: vi.fn(),
  })),
}));

vi.mock('ink-big-text', () => ({
  default: vi.fn(() => null),
}));

vi.mock('ink-gradient', () => ({
  default: vi.fn(({ children }: any) => children),
}));

describe('Terminal cleanup after filled mode', () => {
  let stdoutWriteSpy: any;
  let originalWrite: any;
  const writtenData: string[] = [];

  beforeEach(() => {
    writtenData.length = 0;
    originalWrite = process.stdout.write;
    stdoutWriteSpy = vi
      .spyOn(process.stdout, 'write')
      .mockImplementation((data: any) => {
        if (typeof data === 'string') {
          writtenData.push(data);
        }
        return true;
      });
  });

  afterEach(() => {
    stdoutWriteSpy.mockRestore();
    process.stdout.write = originalWrite;
  });

  it('should output ANSI reset sequences after rendering', async () => {
    await renderInkLogo('TEST', ['#ff0000', '#00ff00']);

    // Check that reset sequences were written
    const output = writtenData.join('');

    // SGR reset (colors, styles)
    expect(output).toContain('\x1b[0m');
    // Cursor visibility restore
    expect(output).toContain('\x1b[?25h');
    // Clear to end of line
    expect(output).toContain('\x1b[K');
  });

  it('should handle multiple consecutive renders without accumulating issues', async () => {
    // Run multiple renders
    for (let i = 0; i < 5; i++) {
      writtenData.length = 0; // Clear for each iteration
      await renderInkLogo(`TEST${i}`, ['#ff0000', '#00ff00']);

      // Each render should output cleanup codes
      const output = writtenData.join('');
      expect(output).toContain('\x1b[0m');
      expect(output).toContain('\x1b[?25h');
    }
  });

  it('should clean up even with different fonts', async () => {
    const fonts = ['block', 'chrome', 'grid'] as const;

    for (const font of fonts) {
      writtenData.length = 0;
      await renderInkLogo('TEST', ['#ff0000'], { font });

      const output = writtenData.join('');
      expect(output).toContain('\x1b[0m');
      expect(output).toContain('\x1b[?25h');
      expect(output).toContain('\x1b[K');
    }
  });

  it('should clean up with letter spacing options', async () => {
    await renderInkLogo('TEST', ['#ff0000'], { letterSpacing: 2 });

    const output = writtenData.join('');
    expect(output).toContain('\x1b[0m');
    expect(output).toContain('\x1b[?25h');
    expect(output).toContain('\x1b[K');
  });

  it('should output cleanup codes', async () => {
    await renderInkLogo('TEST', ['#ff0000']);

    // Find indices of each cleanup code
    const output = writtenData.join('');
    const sgrResetIndex = output.indexOf('\x1b[0m');
    const cursorShowIndex = output.indexOf('\x1b[?25h');
    const clearLineIndex = output.indexOf('\x1b[K');

    // All cleanup codes should be present
    expect(sgrResetIndex).toBeGreaterThanOrEqual(0);
    expect(cursorShowIndex).toBeGreaterThanOrEqual(0);
    expect(clearLineIndex).toBeGreaterThanOrEqual(0);

    // Verify they are output in sequence (since mocked render doesn't output actual content)
    expect(output).toMatch(/\x1b\[0m.*\x1b\[\?25h.*\x1b\[K/s);
  });
});
