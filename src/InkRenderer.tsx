import React from 'react';
import { render } from 'ink';
import BigText from 'ink-big-text';
import type { CFontProps } from 'ink-big-text';
import Gradient from 'ink-gradient';

interface LogoProps {
  text: string;
  colors: string[];
  font?: CFontProps['font'];
  letterSpacing?: number;
}

const Logo: React.FC<LogoProps> = ({ text, colors, font = 'block', letterSpacing }) => {
  // ink-gradient with custom colors
  if (colors.length > 0) {
    return (
      <Gradient colors={colors}>
        <BigText text={text} font={font} letterSpacing={letterSpacing} />
      </Gradient>
    );
  }

  // Default gradient
  return (
    <Gradient name="rainbow">
      <BigText text={text} font={font} letterSpacing={letterSpacing} />
    </Gradient>
  );
};

export function renderInkLogo(text: string, palette: string[], options?: { font?: CFontProps['font']; letterSpacing?: number }): Promise<void> {
  return new Promise((resolve) => {
    const { unmount } = render(<Logo text={text} colors={palette} font={options?.font} letterSpacing={options?.letterSpacing} />);

    // Automatically unmount after rendering to allow process to exit
    setTimeout(() => {
      unmount();
      resolve();
    }, 100);
  });
}
