import React from 'react';
import { render, Text } from 'ink';
import type { CFontProps } from 'ink-big-text';
import gradient from 'gradient-string';
import CFonts from 'cfonts';

type GradientDirection = 'vertical' | 'horizontal' | 'diagonal';
const renderCFont = CFonts.render;

interface LogoProps {
  text: string;
  colors: string[];
  font?: CFontProps['font'];
  letterSpacing?: number;
  direction?: GradientDirection;
}

const ansiRegex = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g;

function stripAnsi(text: string): string {
  return text.replace(ansiRegex, '');
}

function createGradient(colors: string[]) {
  return colors.length > 0 ? gradient(colors) : gradient.rainbow;
}

function getGradientStyles(colors: string[], count: number) {
  if (count <= 0) {
    return [];
  }

  const gradientFn = createGradient(colors);
  const markerCount = Math.max(count, colors.length, 1);
  const marker = 'x';
  const coloredMarkers = gradientFn(marker.repeat(markerCount));
  const matches = [...coloredMarkers.matchAll(/(\x1B\[[0-?]*[ -/]*[@-~])x/g)];

  return Array.from({ length: count }, (_, index) => {
    if (matches.length === 0) {
      return { open: '', close: '' };
    }

    const markerIndex =
      count === 1
        ? 0
        : Math.round((index * (matches.length - 1)) / (count - 1));
    const match = matches[markerIndex];

    return {
      open: match?.[1] ?? '',
      close: match?.[1] ? '\x1B[39m' : '',
    };
  });
}

function applyStyle(
  text: string,
  style: { open: string; close: string } | undefined
): string {
  if (!style || (!style.open && !style.close) || text.length === 0) {
    return text;
  }

  return `${style.open}${text}${style.close}`;
}

function renderBigText(
  text: string,
  font: CFontProps['font'],
  letterSpacing: number | undefined
): string {
  const output = renderCFont(text, {
    font,
    align: 'left',
    colors: ['system'],
    backgroundColor: 'transparent',
    letterSpacing: letterSpacing ?? 1,
    lineHeight: 1,
    space: true,
    maxLength: 0,
  }) as { string?: string } | boolean;

  if (
    output &&
    typeof output === 'object' &&
    typeof output.string === 'string'
  ) {
    return output.string;
  }

  return text;
}

export function applyDirectionalGradient(
  text: string,
  colors: string[],
  direction: GradientDirection = 'vertical'
): string {
  const cleanText = stripAnsi(text);

  switch (direction) {
    case 'horizontal':
      return createGradient(colors).multiline(cleanText);

    case 'diagonal': {
      const lines = cleanText.split('\n');
      const contentLines = lines.filter((line) => line.trim().length > 0);
      const height = contentLines.length;
      const width = Math.max(...contentLines.map((line) => line.length), 0);
      const styles = getGradientStyles(colors, Math.max(width + height - 1, 1));
      let rowIndex = 0;

      return lines
        .map((line) => {
          if (line.trim().length === 0) {
            return line;
          }

          const currentRowIndex = rowIndex;
          rowIndex += 1;

          return [...line]
            .map((char, columnIndex) =>
              applyStyle(char, styles[currentRowIndex + columnIndex])
            )
            .join('');
        })
        .join('\n');
    }

    case 'vertical':
    default: {
      const lines = cleanText.split('\n');
      const contentLineCount = lines.filter(
        (line) => line.trim().length > 0
      ).length;
      const styles = getGradientStyles(colors, contentLineCount);
      let contentLineIndex = 0;

      return lines
        .map((line) => {
          if (line.trim().length === 0) {
            return line;
          }

          const styledLine = applyStyle(line, styles[contentLineIndex]);
          contentLineIndex += 1;

          return styledLine;
        })
        .join('\n');
    }
  }
}

const Logo: React.FC<LogoProps> = ({
  text,
  colors,
  font = 'block',
  letterSpacing,
  direction = 'vertical',
}) => {
  const output = renderBigText(text, font, letterSpacing);

  return <Text>{applyDirectionalGradient(output, colors, direction)}</Text>;
};

export function renderInkLogo(
  text: string,
  palette: string[],
  options?: {
    font?: CFontProps['font'];
    letterSpacing?: number;
    direction?: GradientDirection;
  }
): Promise<void> {
  return new Promise((resolve) => {
    const { unmount } = render(
      <Logo
        text={text}
        colors={palette}
        font={options?.font}
        letterSpacing={options?.letterSpacing}
        direction={options?.direction}
      />
    );

    // Automatically unmount after rendering to allow process to exit
    setTimeout(() => {
      unmount();

      // Reset terminal state to prevent corruption
      // SGR reset (colors, styles)
      process.stdout.write('\x1b[0m');
      // Ensure cursor is visible
      process.stdout.write('\x1b[?25h');
      // Clear to end of line to remove any artifacts
      process.stdout.write('\x1b[K');

      resolve();
    }, 100);
  });
}
