import { renderLogo } from './renderer.js';
import { renderInkLogo } from './InkRenderer.js';
import {
  PALETTES,
  type PaletteName,
  resolvePalette,
  getPaletteNames,
  getDefaultPalette,
  getPalettePreview,
} from './palettes.js';
import type { Fonts } from 'figlet';

export const DEFAULT_PALETTE: PaletteName = 'grad-blue';
export const DEFAULT_FONT = 'Standard';
export const DEFAULT_DIRECTION = 'vertical';

export interface RenderOptions {
  palette?: PaletteName | string[] | string;
  font?: Fonts | string;
  direction?: 'vertical' | 'horizontal' | 'diagonal';
}

export interface RenderInkOptions {
  palette?: PaletteName | string[] | string;
}

export function resolveColors(
  palette: PaletteName | string[] | string
): string[] {
  if (Array.isArray(palette)) {
    return palette;
  }

  const colors = resolvePalette(palette);
  if (!colors) {
    throw new Error(`Unknown palette: ${palette}`);
  }

  return colors;
}

export async function render(
  text: string,
  options: RenderOptions = {}
): Promise<string> {
  const {
    palette = DEFAULT_PALETTE,
    font = DEFAULT_FONT,
    direction = DEFAULT_DIRECTION,
  } = options;

  const paletteColors = resolveColors(palette);
  return renderLogo(text, paletteColors, font, direction);
}

export async function renderFilled(
  text: string,
  options: RenderInkOptions = {}
): Promise<void> {
  const { palette = DEFAULT_PALETTE } = options;
  const paletteColors = resolveColors(palette);
  return renderInkLogo(text, paletteColors);
}

export {
  PALETTES,
  type PaletteName,
  resolvePalette,
  getPaletteNames,
  getDefaultPalette,
  getPalettePreview,
};

export type { Fonts };
