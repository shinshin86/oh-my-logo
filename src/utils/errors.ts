export class OhMyLogoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class PaletteError extends OhMyLogoError {
  public readonly palette: string;
  
  constructor(paletteName: string) {
    super(`Unknown palette: ${paletteName}`);
    this.palette = paletteName;
  }
}

export class InputError extends OhMyLogoError {
  public readonly input: string;
  
  constructor(input: string) {
    super(`Invalid input: ${input}`);
    this.input = input;
  }
}

export class FontError extends OhMyLogoError {
  public readonly font: string;
  
  constructor(fontName: string) {
    super(`Font not found: ${fontName}`);
    this.font = fontName;
  }
}