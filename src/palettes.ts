export const PALETTES = {
  'grad-blue': ['#4ea8ff', '#7f88ff'],
  'sunset': ['#ff9966', '#ff5e62', '#ffa34e'],
  'dawn': ['#00c6ff', '#0072ff'],
  'nebula': ['#654ea3', '#eaafc8'],
  'mono': ['#f07178', '#f07178'],
  'ocean': ['#667eea', '#764ba2'],
  'fire': ['#ff0844', '#ffb199'],
  'forest': ['#134e5e', '#71b280'],
  'gold': ['#f7971e', '#ffd200'],
  'purple': ['#667db6', '#0082c8', '#0078ff'],
  'mint': ['#00d2ff', '#3a7bd5'],
  'coral': ['#ff9a9e', '#fecfef'],
  'matrix': ['#00ff41', '#008f11']
} as const;

export type PaletteName = keyof typeof PALETTES;

export function resolvePalette(name: string): string[] | null {
  const paletteName = name as PaletteName;
  const palette = PALETTES[paletteName];
  return palette ? [...palette] : null;
}

export function getPaletteNames(): string[] {
  return Object.keys(PALETTES);
}

export function getDefaultPalette(): string[] {
  return [...PALETTES['grad-blue']];
}

export function getPalettePreview(name: PaletteName): string {
  const colors = PALETTES[name];
  return colors.join(' → ');
}