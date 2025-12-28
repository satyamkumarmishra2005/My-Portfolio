// Property-based tests for Responsive Layout
// **Feature: backend-portfolio-website, Property 8: Responsive Layout Adaptation**
// **Validates: Requirements 8.1**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  getBreakpoint,
  getBreakpointConfig,
  matchesBreakpoint,
  extractResponsiveClasses,
  validateResponsiveClasses,
  breakpoints,
  type Breakpoint,
} from './responsive';

// Viewport width generators for each breakpoint
const mobileWidthArb = fc.integer({ min: 320, max: 767 });
const tabletWidthArb = fc.integer({ min: 768, max: 1023 });
const desktopWidthArb = fc.integer({ min: 1024, max: 2560 });
const anyValidWidthArb = fc.integer({ min: 320, max: 2560 });

// Generator for responsive class strings
const responsiveClassArb = fc.record({
  mobile: fc.array(fc.constantFrom('p-4', 'px-4', 'py-4', 'grid-cols-1', 'text-sm', 'text-base', 'flex', 'block', 'hidden'), { minLength: 1, maxLength: 5 }),
  tablet: fc.array(fc.constantFrom('md:p-6', 'md:px-6', 'md:py-6', 'md:grid-cols-2', 'md:text-lg', 'md:flex', 'md:block', 'md:hidden'), { minLength: 0, maxLength: 3 }),
  desktop: fc.array(fc.constantFrom('lg:p-8', 'lg:px-8', 'lg:py-8', 'lg:grid-cols-3', 'lg:text-xl', 'lg:flex', 'lg:block', 'lg:hidden'), { minLength: 0, maxLength: 3 }),
}).map(({ mobile, tablet, desktop }) => [...mobile, ...tablet, ...desktop].join(' '));

describe('Responsive Layout Properties', () => {
  /**
   * **Feature: backend-portfolio-website, Property 8: Responsive Layout Adaptation**
   * **Validates: Requirements 8.1**
   *
   * For any viewport width, the layout components SHALL apply appropriate CSS classes
   * matching the defined breakpoints (mobile: <768px, tablet: 768-1024px, desktop: >1024px).
   */
  describe('Property 8: Responsive Layout Adaptation', () => {
    it('getBreakpoint returns "mobile" for any width < 768px', () => {
      fc.assert(
        fc.property(mobileWidthArb, (width: number) => {
          const breakpoint = getBreakpoint(width);
          expect(breakpoint).toBe('mobile');
          return breakpoint === 'mobile';
        }),
        { numRuns: 100 }
      );
    });

    it('getBreakpoint returns "tablet" for any width >= 768px and < 1024px', () => {
      fc.assert(
        fc.property(tabletWidthArb, (width: number) => {
          const breakpoint = getBreakpoint(width);
          expect(breakpoint).toBe('tablet');
          return breakpoint === 'tablet';
        }),
        { numRuns: 100 }
      );
    });

    it('getBreakpoint returns "desktop" for any width >= 1024px', () => {
      fc.assert(
        fc.property(desktopWidthArb, (width: number) => {
          const breakpoint = getBreakpoint(width);
          expect(breakpoint).toBe('desktop');
          return breakpoint === 'desktop';
        }),
        { numRuns: 100 }
      );
    });

    it('for any viewport width, exactly one breakpoint matches', () => {
      fc.assert(
        fc.property(anyValidWidthArb, (width: number) => {
          const matchingBreakpoints = (['mobile', 'tablet', 'desktop'] as Breakpoint[])
            .filter(bp => matchesBreakpoint(width, bp));
          
          // Exactly one breakpoint should match for any width
          expect(matchingBreakpoints).toHaveLength(1);
          return matchingBreakpoints.length === 1;
        }),
        { numRuns: 100 }
      );
    });

    it('getBreakpointConfig returns correct config for any viewport width', () => {
      fc.assert(
        fc.property(anyValidWidthArb, (width: number) => {
          const config = getBreakpointConfig(width);
          
          // Config should exist
          expect(config).toBeDefined();
          
          // Width should be within config bounds
          expect(width).toBeGreaterThanOrEqual(config.minWidth);
          if (config.maxWidth !== null) {
            expect(width).toBeLessThanOrEqual(config.maxWidth);
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('breakpoints cover all possible viewport widths without gaps', () => {
      fc.assert(
        fc.property(anyValidWidthArb, (width: number) => {
          // Every width should fall into exactly one breakpoint
          const breakpoint = getBreakpoint(width);
          const config = breakpoints.find(b => b.name === breakpoint);
          
          expect(config).toBeDefined();
          expect(width).toBeGreaterThanOrEqual(config!.minWidth);
          
          if (config!.maxWidth !== null) {
            expect(width).toBeLessThanOrEqual(config!.maxWidth);
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('extractResponsiveClasses correctly categorizes classes by breakpoint', () => {
      fc.assert(
        fc.property(responsiveClassArb, (classString: string) => {
          const extracted = extractResponsiveClasses(classString);
          
          // Mobile classes should not have breakpoint prefixes
          extracted.mobile.forEach(cls => {
            expect(cls).not.toMatch(/^(sm|md|lg|xl):/);
          });
          
          // Tablet classes should have md: prefix
          extracted.tablet.forEach(cls => {
            expect(cls).toMatch(/^md:/);
          });
          
          // Desktop classes should have lg: prefix
          extracted.desktop.forEach(cls => {
            expect(cls).toMatch(/^lg:/);
          });
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('validateResponsiveClasses returns valid for any class string with mobile classes', () => {
      fc.assert(
        fc.property(responsiveClassArb, (classString: string) => {
          const validation = validateResponsiveClasses(classString);
          
          // Should be valid if it has mobile classes (mobile-first approach)
          if (validation.hasMobileClasses) {
            expect(validation.isValid).toBe(true);
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('breakpoint boundaries are correctly defined', () => {
      // Test exact boundary values
      expect(getBreakpoint(767)).toBe('mobile');
      expect(getBreakpoint(768)).toBe('tablet');
      expect(getBreakpoint(1023)).toBe('tablet');
      expect(getBreakpoint(1024)).toBe('desktop');
    });

    it('matchesBreakpoint is consistent with getBreakpoint for any width', () => {
      fc.assert(
        fc.property(anyValidWidthArb, (width: number) => {
          const breakpoint = getBreakpoint(width);
          
          // The breakpoint returned by getBreakpoint should match
          expect(matchesBreakpoint(width, breakpoint)).toBe(true);
          
          // Other breakpoints should not match
          const otherBreakpoints = (['mobile', 'tablet', 'desktop'] as Breakpoint[])
            .filter(bp => bp !== breakpoint);
          
          otherBreakpoints.forEach(bp => {
            expect(matchesBreakpoint(width, bp)).toBe(false);
          });
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
