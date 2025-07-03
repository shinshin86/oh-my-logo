import React, { memo } from 'react';
import { render } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import { cacheManager } from './cache/CacheManager.js';

interface LogoProps {
  text: string;
  colors: string[];
}

// Memoize the Logo component to prevent unnecessary re-renders
const Logo: React.FC<LogoProps> = memo(({ text, colors }) => {
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
});

Logo.displayName = 'Logo';

export function renderInkLogo(text: string, palette: string[]): Promise<void> {
  // Create cache key
  const cacheKey = `${text}:${palette.join(',')}`;
  
  // Check if we already have this render in progress or completed
  const cached = cacheManager.getInkRender(cacheKey);
  if (cached) {
    return cached;
  }
  
  const renderPromise = new Promise<void>((resolve, reject) => {
    try {
      const { unmount } = render(<Logo text={text} colors={palette} />);
      
      // Shorter timeout for faster completion and immediate unmount
      setTimeout(() => {
        try {
          unmount();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 50); // Increased slightly to ensure proper rendering
      
    } catch (error) {
      reject(error);
    }
  });
  
  // Cache the promise
  cacheManager.setInkRender(cacheKey, renderPromise);
  
  return renderPromise;
}

// Function to clear ink cache
export function clearInkCache(): void {
  cacheManager.clearInkCache();
}