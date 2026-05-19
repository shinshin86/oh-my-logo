import { afterEach, describe, expect, it, vi } from 'vitest';

const ansiRegex = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g;

function stripAnsi(text: string): string {
  return text.replace(ansiRegex, '');
}

describe('InkRenderer gradient directions', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('gradient-string');
    vi.unstubAllEnvs();
  });

  async function loadRenderer() {
    vi.resetModules();
    const createMockGradient = () => {
      const gradientFn = ((text: string) =>
        [...text]
          .map((char, index) => `\x1B[3${index}m${char}\x1B[39m`)
          .join('')) as ((text: string) => string) & {
        multiline: (text: string) => string;
      };

      gradientFn.multiline = (text: string) =>
        text
          .split('\n')
          .map((line) =>
            [...line]
              .map((char, index) => `\x1B[4${index}m${char}\x1B[39m`)
              .join('')
          )
          .join('\n');

      return gradientFn;
    };

    const gradientMock = Object.assign(
      vi.fn(() => createMockGradient()),
      {
        rainbow: createMockGradient(),
      }
    );

    vi.doMock('gradient-string', () => ({
      default: gradientMock,
    }));

    return import('../src/InkRenderer.js');
  }

  it('applies vertical gradients by row', async () => {
    const { applyDirectionalGradient } = await loadRenderer();
    const input = 'AB\nCD\nEF';

    const output = applyDirectionalGradient(
      input,
      ['#0000ff', '#ff0000'],
      'vertical'
    );

    expect(stripAnsi(output)).toBe(input);
    const lines = output.split('\n');
    expect(lines[0]).not.toBe(lines[2]);
  });

  it('keeps horizontal gradients left to right across each line', async () => {
    const { applyDirectionalGradient } = await loadRenderer();
    const input = 'AB\nCD';

    const output = applyDirectionalGradient(
      input,
      ['#0000ff', '#ff0000'],
      'horizontal'
    );

    expect(stripAnsi(output)).toBe(input);
    expect(output).toContain('\x1B[');
  });

  it('applies diagonal gradients from top-left to bottom-right', async () => {
    const { applyDirectionalGradient } = await loadRenderer();
    const input = 'AB\nCD';

    const output = applyDirectionalGradient(
      input,
      ['#0000ff', '#ff0000'],
      'diagonal'
    );

    expect(stripAnsi(output)).toBe(input);
    expect(output).toContain('\x1B[');
  });

  it('uses the default render timeout when no environment override is set', async () => {
    const { DEFAULT_RENDER_TIMEOUT_MS, getRenderTimeoutMs } =
      await loadRenderer();

    expect(getRenderTimeoutMs()).toBe(DEFAULT_RENDER_TIMEOUT_MS);
  });

  it('uses OHMYLOGO_RENDER_TIMEOUT_MS when it is a valid value', async () => {
    vi.stubEnv('OHMYLOGO_RENDER_TIMEOUT_MS', '500');
    const { getRenderTimeoutMs } = await loadRenderer();

    expect(getRenderTimeoutMs()).toBe(500);
  });

  it('falls back to the default render timeout for invalid values', async () => {
    vi.stubEnv('OHMYLOGO_RENDER_TIMEOUT_MS', 'not-a-number');
    const { DEFAULT_RENDER_TIMEOUT_MS, getRenderTimeoutMs } =
      await loadRenderer();

    expect(getRenderTimeoutMs()).toBe(DEFAULT_RENDER_TIMEOUT_MS);
  });

  it('falls back to the default render timeout for negative values', async () => {
    vi.stubEnv('OHMYLOGO_RENDER_TIMEOUT_MS', '-1');
    const { DEFAULT_RENDER_TIMEOUT_MS, getRenderTimeoutMs } =
      await loadRenderer();

    expect(getRenderTimeoutMs()).toBe(DEFAULT_RENDER_TIMEOUT_MS);
  });
});
