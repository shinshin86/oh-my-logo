import figlet from 'figlet';
import gradient from 'gradient-string';
import { FontError } from './utils/errors.js';

export function renderLogo(
  text: string,
  palette: string[],
  font: string = 'Standard',
  direction: string = 'vertical'
): string {
  try {
    const asciiArt = figlet.textSync(text, {
      font: font as figlet.Fonts,
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    });
    
    // Create gradient function
    const gradientFn = gradient(palette);
    
    let coloredArt: string;
    
    switch (direction) {
      case 'horizontal':
        // Apply gradient horizontally (left to right on each line)
        const lines = asciiArt.split('\n');
        const coloredLines = lines.map(line => {
          if (line.trim() === '') {
            return line;
          }
          return gradientFn(line);
        });
        coloredArt = coloredLines.join('\n');
        break;
        
      case 'diagonal':
        // Create a custom diagonal gradient by applying different gradients per line
        const diagonalLines = asciiArt.split('\n');
        const lineCount = diagonalLines.length;
        coloredArt = diagonalLines.map((line, index) => {
          if (line.trim() === '') {
            return line;
          }
          // Create a gradient that shifts based on line position
          const shiftedPalette = palette.map((color, colorIndex) => {
            const shift = (index / lineCount) * palette.length;
            return palette[Math.floor(colorIndex + shift) % palette.length];
          });
          return gradient(shiftedPalette)(line);
        }).join('\n');
        break;
        
      case 'vertical':
      default:
        // Apply gradient vertically (top to bottom across all lines)
        coloredArt = gradientFn.multiline(asciiArt);
        break;
    }
    
    return coloredArt;
  } catch (error) {
    if (error instanceof Error && error.message.includes('font')) {
      throw new FontError(font);
    }
    throw error;
  }
}