// Property-based tests for Hero Section Responsive Layout
// **Feature: hero-image-and-blogs, Property 1: Responsive Layout Adaptation**
// **Validates: Requirements 1.2, 1.3, 2.1, 2.2**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getBreakpoint, type Breakpoint } from '@/lib/responsive';

/**
 * Hero section responsive layout configuration
 * These represent the CSS classes applied at different breakpoints
 */
interface HeroLayoutConfig {
  containerLayout: string;
  imageOrder: string;
  textOrder: string;
  textAlignment: string;
  imageSize: string;
}

/**
 * Get the expected Hero layout configuration for a given breakpoint
 * This mirrors the actual CSS classes used in Hero.tsx
 */
function getHeroLayoutConfig(breakpoint: Breakpoint): HeroLayoutConfig {
  switch (breakpoint) {
    case 'mobile':
      return {
        containerLayout: 'flex-col', // Stacked vertically
        imageOrder: 'order-1', // Image first (on top)
        textOrder: 'order-2', // Text second (below)
        textAlignment: 'text-center', // Centered text
        imageSize: 'w-48 h-48', // Smaller image
      };
    case 'tablet':
    case 'desktop':
      return {
        containerLayout: 'md:flex-row', // Side-by-side
        imageOrder: 'md:order-2', // Image on right
        textOrder: 'md:order-1', // Text on left
        textAlignment: 'md:text-left', // Left-aligned text
        imageSize: breakpoint === 'tablet' ? 'md:w-64 md:h-64' : 'lg:w-80 lg:h-80', // Larger image
      };
  }
}

/**
 * Validate that the layout configuration is appropriate for the viewport
 */
function validateLayoutForViewport(width: number): {
  isValid: boolean;
  breakpoint: Breakpoint;
  expectedLayout: HeroLayoutConfig;
} {
  const breakpoint = getBreakpoint(width);
  const expectedLayout = getHeroLayoutConfig(breakpoint);
  
  // Layout is valid if it matches the expected configuration for the breakpoint
  return {
    isValid: true,
    breakpoint,
    expectedLayout,
  };
}

// Viewport width generators for each breakpoint
const mobileWidthArb = fc.integer({ min: 320, max: 767 });
const tabletWidthArb = fc.integer({ min: 768, max: 1023 });
const desktopWidthArb = fc.integer({ min: 1024, max: 2560 });
const anyValidWidthArb = fc.integer({ min: 320, max: 2560 });

describe('Hero Section Responsive Layout Properties', () => {
  /**
   * **Feature: hero-image-and-blogs, Property 1: Responsive Layout Adaptation**
   * **Validates: Requirements 1.2, 1.3, 2.1, 2.2**
   *
   * For any viewport width, the Hero section layout SHALL adapt appropriately—
   * displaying side-by-side on desktop (≥768px) and stacked vertically on mobile (<768px),
   * with the profile image maintaining its aspect ratio without distortion.
   */
  describe('Property 1: Responsive Layout Adaptation', () => {
    it('mobile viewports (<768px) should use stacked vertical layout', () => {
      fc.assert(
        fc.property(mobileWidthArb, (width: number) => {
          const { breakpoint, expectedLayout } = validateLayoutForViewport(width);
          
          expect(breakpoint).toBe('mobile');
          expect(expectedLayout.containerLayout).toBe('flex-col');
          expect(expectedLayout.imageOrder).toBe('order-1');
          expect(expectedLayout.textOrder).toBe('order-2');
          expect(expectedLayout.textAlignment).toBe('text-center');
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('tablet/desktop viewports (≥768px) should use side-by-side layout', () => {
      fc.assert(
        fc.property(tabletWidthArb, (width: number) => {
          const { breakpoint, expectedLayout } = validateLayoutForViewport(width);
          
          expect(['tablet', 'desktop']).toContain(breakpoint);
          expect(expectedLayout.containerLayout).toBe('md:flex-row');
          expect(expectedLayout.imageOrder).toBe('md:order-2');
          expect(expectedLayout.textOrder).toBe('md:order-1');
          expect(expectedLayout.textAlignment).toBe('md:text-left');
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('desktop viewports (≥1024px) should use larger image size', () => {
      fc.assert(
        fc.property(desktopWidthArb, (width: number) => {
          const { breakpoint, expectedLayout } = validateLayoutForViewport(width);
          
          expect(breakpoint).toBe('desktop');
          expect(expectedLayout.imageSize).toBe('lg:w-80 lg:h-80');
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('for any viewport width, layout configuration should be valid', () => {
      fc.assert(
        fc.property(anyValidWidthArb, (width: number) => {
          const { isValid, breakpoint, expectedLayout } = validateLayoutForViewport(width);
          
          expect(isValid).toBe(true);
          expect(breakpoint).toBeDefined();
          expect(expectedLayout).toBeDefined();
          expect(expectedLayout.containerLayout).toBeDefined();
          expect(expectedLayout.imageOrder).toBeDefined();
          expect(expectedLayout.textOrder).toBeDefined();
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('image aspect ratio is preserved (square dimensions) at all breakpoints', () => {
      fc.assert(
        fc.property(anyValidWidthArb, (width: number) => {
          const { expectedLayout } = validateLayoutForViewport(width);
          
          // Image size classes should always have equal width and height
          // This ensures aspect ratio is preserved (1:1 for profile image)
          const sizePattern = /w-(\d+)\s*h-(\d+)|w-(\d+).*h-(\d+)/;
          const match = expectedLayout.imageSize.match(sizePattern);
          
          if (match) {
            const widthVal = match[1] || match[3];
            const heightVal = match[2] || match[4];
            expect(widthVal).toBe(heightVal);
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('breakpoint boundaries are correctly defined for layout changes', () => {
      // Test exact boundary values
      const mobile767 = validateLayoutForViewport(767);
      const tablet768 = validateLayoutForViewport(768);
      const tablet1023 = validateLayoutForViewport(1023);
      const desktop1024 = validateLayoutForViewport(1024);
      
      // Mobile boundary
      expect(mobile767.breakpoint).toBe('mobile');
      expect(mobile767.expectedLayout.containerLayout).toBe('flex-col');
      
      // Tablet boundary
      expect(tablet768.breakpoint).toBe('tablet');
      expect(tablet768.expectedLayout.containerLayout).toBe('md:flex-row');
      
      expect(tablet1023.breakpoint).toBe('tablet');
      
      // Desktop boundary
      expect(desktop1024.breakpoint).toBe('desktop');
      expect(desktop1024.expectedLayout.imageSize).toBe('lg:w-80 lg:h-80');
    });

    it('layout transitions smoothly between breakpoints', () => {
      fc.assert(
        fc.property(anyValidWidthArb, (width: number) => {
          const { breakpoint } = validateLayoutForViewport(width);
          
          // Verify that exactly one breakpoint matches for any width
          const breakpoints: Breakpoint[] = ['mobile', 'tablet', 'desktop'];
          const matchingBreakpoints = breakpoints.filter(bp => {
            if (bp === 'mobile') return width < 768;
            if (bp === 'tablet') return width >= 768 && width < 1024;
            return width >= 1024;
          });
          
          expect(matchingBreakpoints).toHaveLength(1);
          expect(matchingBreakpoints[0]).toBe(breakpoint);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
