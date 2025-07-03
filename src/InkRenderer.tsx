import React, { memo } from 'react';
import { render } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';

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

// Cache for rendered components to avoid re-rendering identical content
const renderCache = new Map<string, Promise<void>>();

export function renderInkLogo(text: string, palette: string[]): Promise<void> {
  // Create cache key
  const cacheKey = `${text}:${palette.join(',')}`;
  
  // Check if we already have this render in progress or completed
  if (renderCache.has(cacheKey)) {
    return renderCache.get(cacheKey)!;
  }
  
  const renderPromise = new Promise<void>((resolve) => {
    const { unmount } = render(<Logo text={text} colors={palette} />);
    
    // Reduce timeout for faster completion
    setTimeout(() => {
      unmount();
      resolve();
      
      // Clean up cache entry after completion
      setTimeout(() => {
        renderCache.delete(cacheKey);
      }, 1000);
    }, 50); // Reduced from 100ms to 50ms
  });
  
  // Cache the promise
  renderCache.set(cacheKey, renderPromise);
  
  // Limit cache size
  if (renderCache.size > 20) {
    const firstKey = renderCache.keys().next().value;
    if (firstKey !== undefined) {
      const oldPromise = renderCache.get(firstKey);
      renderCache.delete(firstKey);
      // Don't await the old promise to avoid blocking
    }
  }
  
  return renderPromise;
}

// Function to clear render cache
export function clearInkCache(): void {
  renderCache.clear();
}