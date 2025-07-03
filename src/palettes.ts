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

// Cache for palette resolution to avoid repeated array copying
const paletteCache = new Map<string, string[]>();

export function resolvePalette(name: string): string[] | null {
  // Check cache first
  if (paletteCache.has(name)) {
    return paletteCache.get(name)!;
  }
  
  const paletteName = name as PaletteName;
  const palette = PALETTES[paletteName];
  
  if (!palette) {
    return null;
  }
  
  // Create a copy and cache it
  const paletteArray = [...palette];
  paletteCache.set(name, paletteArray);
  
  // Limit cache size
  if (paletteCache.size > 20) {
    const firstKey = paletteCache.keys().next().value;
    paletteCache.delete(firstKey);
  }
  
  return paletteArray;
}

// Pre-computed palette names for faster access
const PALETTE_NAMES = Object.keys(PALETTES);

export function getPaletteNames(): string[] {
  return PALETTE_NAMES;
}

// Pre-computed default palette for faster access
const DEFAULT_PALETTE_COLORS = [...PALETTES['grad-blue']];

export function getDefaultPalette(): string[] {
  return DEFAULT_PALETTE_COLORS;
}

// Cache for palette previews
const previewCache = new Map<PaletteName, string>();

export function getPalettePreview(name: PaletteName): string {
  // Check cache first
  if (previewCache.has(name)) {
    return previewCache.get(name)!;
  }
  
  const colors = PALETTES[name];
  const preview = colors.join(' → ');
  
  // Cache the result
  previewCache.set(name, preview);
  
  return preview;
}

// Function to clear palette caches if needed
export function clearPaletteCache(): void {
  paletteCache.clear();
  previewCache.clear();
}