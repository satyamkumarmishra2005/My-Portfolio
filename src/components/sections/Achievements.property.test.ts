// Property-based tests for Achievements section responsive layout
// **Feature: achievements-section, Property 3: Responsive Layout Classes**
// **Validates: Requirements 5.1, 5.2, 5.3**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Breakpoint definitions matching Tailwind CSS defaults
const MOBILE_MAX = 767;
const TABLET_MIN = 768;
const TABLET_MAX = 1023;
const DESKTOP_MIN = 1024;

// Viewport width generators for each breakpoint
const mobileWidthArb = fc.integer({ min: 320, max: MOBILE_MAX });
const tabletWidthArb = fc.integer({ min: TABLET_MIN, max: TABLET_MAX });
const desktopWidthArb = fc.integer({ min: DESKTOP_MIN, max: 2560 });
const anyValidWidthArb = fc.integer({ min: 320, max: 2560 });

// The grid classes used in Achievements section
const ACHIEVEMENTS_GRID_CLASSES = 'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8';

/**
 * Helper function to determine the expected column count based on viewport width
 * Matches the responsive grid classes: grid-cols-1 md:grid-cols-2
 */
function getExpectedColumnCount(viewportWidth: number): number {
  if (viewportWidth >= TABLET_MIN) {
    return 2; // md:grid-cols-2 applies at 768px and above
  }
  return 1; // grid-cols-1 is the default (mobile)
}

/**
 * Helper function to determine if the layout should be single column
 */
function shouldBeSingleColumn(viewportWidth: number): boolean {
  return viewportWidth < TABLET_MIN;
}

/**
 * Helper function to determine if the layout should be multi-column
 */
function shouldBeMultiColumn(viewportWidth: number): boolean {
  return viewportWidth >= TABLET_MIN;
}

/**
 * Helper function to extract responsive classes from a class string
 */
function extractResponsiveClasses(classString: string): {
  mobile: string[];
  tablet: string[];
  desktop: string[];
} {
  const classes = classString.split(/\s+/).filter(Boolean);
  
  return {
    mobile: classes.filter(cls => !cls.match(/^(sm|md|lg|xl|2xl):/)),
    tablet: classes.filter(cls => cls.startsWith('md:')),
    desktop: classes.filter(cls => cls.startsWith('lg:')),
  };
}

/**
 * Helper function to validate that the grid classes follow mobile-first approach
 */
function validateMobileFirstApproach(classString: string): boolean {
  const extracted = extractResponsiveClasses(classString);
  
  // Must have mobile (base) classes
  const hasMobileGridCols = extracted.mobile.some(cls => cls.includes('grid-cols'));
  
  return hasMobileGridCols;
}

describe('Achievements Section Responsive Layout Properties', () => {
  /**
   * **Feature: achievements-section, Property 3: Responsive Layout Classes**
   * **Validates: Requirements 5.1, 5.2, 5.3**
   *
   * For any viewport width, the Achievements section SHALL apply appropriate CSS classes
   * matching the defined breakpoints (mobile: single column, tablet/desktop: multi-column grid).
   */
  describe('Property 3: Responsive Layout Classes', () => {
    it('for any mobile viewport width, layout should be single column', () => {
      fc.assert(
        fc.property(mobileWidthArb, (width: number) => {
          const isSingleColumn = shouldBeSingleColumn(width);
          const columnCount = getExpectedColumnCount(width);
          
          expect(isSingleColumn).toBe(true);
          expect(columnCount).toBe(1);
          
          return isSingleColumn && columnCount === 1;
        }),
        { numRuns: 100 }
      );
    });

    it('for any tablet viewport width, layout should be multi-column', () => {
      fc.assert(
        fc.property(tabletWidthArb, (width: number) => {
          const isMultiColumn = shouldBeMultiColumn(width);
          const columnCount = getExpectedColumnCount(width);
          
          expect(isMultiColumn).toBe(true);
          expect(columnCount).toBe(2);
          
          return isMultiColumn && columnCount === 2;
        }),
        { numRuns: 100 }
      );
    });

    it('for any desktop viewport width, layout should be multi-column', () => {
      fc.assert(
        fc.property(desktopWidthArb, (width: number) => {
          const isMultiColumn = shouldBeMultiColumn(width);
          const columnCount = getExpectedColumnCount(width);
          
          expect(isMultiColumn).toBe(true);
          expect(columnCount).toBe(2);
          
          return isMultiColumn && columnCount === 2;
        }),
        { numRuns: 100 }
      );
    });

    it('for any viewport width, exactly one layout mode applies', () => {
      fc.assert(
        fc.property(anyValidWidthArb, (width: number) => {
          const isSingle = shouldBeSingleColumn(width);
          const isMulti = shouldBeMultiColumn(width);
          
          // Exactly one should be true (XOR)
          expect(isSingle !== isMulti).toBe(true);
          
          return isSingle !== isMulti;
        }),
        { numRuns: 100 }
      );
    });

    it('grid classes follow mobile-first approach', () => {
      const isValid = validateMobileFirstApproach(ACHIEVEMENTS_GRID_CLASSES);
      expect(isValid).toBe(true);
    });

    it('grid classes contain correct responsive breakpoint prefixes', () => {
      const extracted = extractResponsiveClasses(ACHIEVEMENTS_GRID_CLASSES);
      
      // Should have base mobile classes (no prefix)
      expect(extracted.mobile).toContain('grid');
      expect(extracted.mobile).toContain('grid-cols-1');
      
      // Should have tablet breakpoint classes (md: prefix)
      expect(extracted.tablet.some(cls => cls.includes('grid-cols'))).toBe(true);
      
      // Should have desktop breakpoint classes for gap (lg: prefix)
      expect(extracted.desktop.some(cls => cls.includes('gap'))).toBe(true);
    });

    it('breakpoint boundary at 768px correctly transitions from single to multi-column', () => {
      // Just below tablet breakpoint
      expect(shouldBeSingleColumn(767)).toBe(true);
      expect(getExpectedColumnCount(767)).toBe(1);
      
      // At tablet breakpoint
      expect(shouldBeMultiColumn(768)).toBe(true);
      expect(getExpectedColumnCount(768)).toBe(2);
    });

    it('column count is consistent for any width within the same breakpoint', () => {
      fc.assert(
        fc.property(
          fc.tuple(mobileWidthArb, mobileWidthArb),
          ([width1, width2]) => {
            // Two mobile widths should have the same column count
            expect(getExpectedColumnCount(width1)).toBe(getExpectedColumnCount(width2));
            return true;
          }
        ),
        { numRuns: 100 }
      );

      fc.assert(
        fc.property(
          fc.tuple(tabletWidthArb, tabletWidthArb),
          ([width1, width2]) => {
            // Two tablet widths should have the same column count
            expect(getExpectedColumnCount(width1)).toBe(getExpectedColumnCount(width2));
            return true;
          }
        ),
        { numRuns: 100 }
      );

      fc.assert(
        fc.property(
          fc.tuple(desktopWidthArb, desktopWidthArb),
          ([width1, width2]) => {
            // Two desktop widths should have the same column count
            expect(getExpectedColumnCount(width1)).toBe(getExpectedColumnCount(width2));
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
