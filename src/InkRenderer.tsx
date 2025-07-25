import React from 'react';
import { render } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

interface LogoProps {
  text: string;
  colors: string[];
}

const Logo: React.FC<LogoProps> = ({ text, colors }) => {
  // ink-gradient with custom colors
  if (colors.length > 0) {
    return (
      <Gradient colors={colors}>
        <BigText text={text} font="block" />
      </Gradient>
    );
  }

  // Default gradient
  return (
    <Gradient name="rainbow">
      <BigText text={text} font="block" />
    </Gradient>
  );
};

export function renderInkLogo(text: string, palette: string[]): Promise<void> {
  return new Promise((resolve) => {
    const { unmount } = render(<Logo text={text} colors={palette} />);

    // Automatically unmount after rendering to allow process to exit
    setTimeout(() => {
      unmount();
      resolve();
    }, 100);
  });
}
