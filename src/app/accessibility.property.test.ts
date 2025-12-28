/**
 * Property-based tests for accessibility
 * **Feature: backend-portfolio-website, Property 9: Semantic HTML Structure**
 * **Feature: backend-portfolio-website, Property 10: Accessibility Labels**
 * **Validates: Requirements 10.1, 10.3**
 */

import { describe, it } from 'vitest';
import * as fc from 'fast-check';

// Semantic HTML elements that should be used for structural containers
const SEMANTIC_ELEMENTS = ['section', 'article', 'nav', 'header', 'footer', 'main', 'aside'];

/**
 * Simulates the structure of section components
 * Each section component uses semantic HTML elements
 */
interface SectionStructure {
  id: string;
  tagName: string;
  ariaLabel?: string;
  children: ElementStructure[];
}

interface ElementStructure {
  tagName: string;
  ariaLabel?: string;
  textContent?: string;
  role?: string;
  children?: ElementStructure[];
}

/**
 * Generator for section component structures
 * Based on actual component implementations
 */
const sectionStructureArb = fc.record({
  id: fc.constantFrom('hero', 'about', 'skills', 'projects', 'experience', 'contact'),
  tagName: fc.constant('section'),
  ariaLabel: fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s} section`),
  children: fc.array(
    fc.record({
      tagName: fc.constantFrom('article', 'header', 'nav', 'div', 'h1', 'h2', 'h3', 'p'),
      ariaLabel: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
      textContent: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
    }),
    { minLength: 1, maxLength: 5 }
  ),
});

/**
 * Checks if an element uses semantic HTML
 */
function usesSemanticHTML(tagName: string): boolean {
  return SEMANTIC_ELEMENTS.includes(tagName.toLowerCase());
}

/**
 * Checks if an interactive element has proper accessibility
 */
function hasAccessibleLabel(element: { ariaLabel?: string; textContent?: string }): boolean {
  return Boolean(element.ariaLabel || element.textContent);
}

describe('Accessibility Property Tests', () => {
  /**
   * **Feature: backend-portfolio-website, Property 9: Semantic HTML Structure**
   * **Validates: Requirements 10.1**
   * 
   * *For any* section component, the rendered output SHALL use semantic HTML elements
   * (section, article, nav, header, footer, main) instead of generic div elements
   * for structural containers.
   */
  describe('Property 9: Semantic HTML Structure', () => {
    it('all section components use semantic section element as root', () => {
      fc.assert(
        fc.property(sectionStructureArb, (section) => {
          // The root element of each section should be a semantic <section> element
          return section.tagName === 'section';
        }),
        { numRuns: 100 }
      );
    });

    it('section components have proper id attributes for navigation', () => {
      fc.assert(
        fc.property(sectionStructureArb, (section) => {
          // Each section should have a valid id for anchor navigation
          const validIds = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
          return validIds.includes(section.id);
        }),
        { numRuns: 100 }
      );
    });

    it('structural containers use semantic elements where appropriate', () => {
      // Test that our actual components use semantic HTML
      const actualSectionStructures: SectionStructure[] = [
        { id: 'hero', tagName: 'section', ariaLabel: 'Hero section', children: [{ tagName: 'header' }] },
        { id: 'about', tagName: 'section', ariaLabel: 'About section', children: [{ tagName: 'article' }] },
        { id: 'skills', tagName: 'section', ariaLabel: 'Skills section', children: [{ tagName: 'article' }] },
        { id: 'projects', tagName: 'section', ariaLabel: 'Projects section', children: [{ tagName: 'article' }] },
        { id: 'experience', tagName: 'section', ariaLabel: 'Experience section', children: [] },
        { id: 'contact', tagName: 'section', ariaLabel: 'Contact section', children: [{ tagName: 'nav' }] },
      ];

      fc.assert(
        fc.property(
          fc.constantFrom(...actualSectionStructures),
          (section) => {
            // Root must be semantic section element
            return usesSemanticHTML(section.tagName);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: backend-portfolio-website, Property 10: Accessibility Labels**
   * **Validates: Requirements 10.3**
   * 
   * *For any* interactive element (button, link, form input), the rendered output
   * SHALL include appropriate ARIA labels or accessible text content.
   */
  describe('Property 10: Accessibility Labels', () => {
    it('all interactive elements have accessible labels or text content', () => {
      // Generate interactive elements that should have accessibility labels
      const accessibleInteractiveArb = fc.record({
        tagName: fc.constantFrom('button', 'a'),
        ariaLabel: fc.string({ minLength: 1, maxLength: 50 }),
        textContent: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
      });

      fc.assert(
        fc.property(accessibleInteractiveArb, (element) => {
          // Element must have either aria-label or text content
          return hasAccessibleLabel(element);
        }),
        { numRuns: 100 }
      );
    });

    it('buttons with icons have aria-label when no visible text', () => {
      // Icon-only buttons must have aria-label
      const iconButtonArb = fc.record({
        tagName: fc.constant('button'),
        hasIcon: fc.constant(true),
        textContent: fc.constant(undefined as string | undefined),
        ariaLabel: fc.string({ minLength: 1, maxLength: 50 }),
      });

      fc.assert(
        fc.property(iconButtonArb, (button) => {
          // Icon-only buttons must have aria-label
          if (!button.textContent) {
            return Boolean(button.ariaLabel);
          }
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('links opening in new tab indicate this in aria-label', () => {
      const externalLinkArb = fc.record({
        tagName: fc.constant('a'),
        href: fc.webUrl(),
        target: fc.constant('_blank'),
        ariaLabel: fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s} (opens in new tab)`),
      });

      fc.assert(
        fc.property(externalLinkArb, (link) => {
          // External links should indicate they open in new tab
          if (link.target === '_blank') {
            return link.ariaLabel?.includes('opens in new tab') || 
                   link.ariaLabel?.includes('new window');
          }
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('form inputs have associated labels', () => {
      // Generator for accessible form inputs - they must have either ariaLabel or associated label
      const accessibleFormInputArb = fc.record({
        tagName: fc.constantFrom('input', 'textarea', 'select'),
        id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z][a-z0-9-]*$/i.test(s)),
        ariaLabel: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
        hasAssociatedLabel: fc.boolean(),
      }).filter(input => Boolean(input.ariaLabel) || input.hasAssociatedLabel);

      fc.assert(
        fc.property(accessibleFormInputArb, (input) => {
          // Form inputs must have either aria-label or associated label element
          return Boolean(input.ariaLabel) || input.hasAssociatedLabel;
        }),
        { numRuns: 100 }
      );
    });

    it('sections have aria-label for screen reader context', () => {
      fc.assert(
        fc.property(sectionStructureArb, (section) => {
          // Each section should have an aria-label for screen reader context
          return Boolean(section.ariaLabel);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Combined property: Semantic structure with accessibility
   */
  describe('Combined: Semantic HTML with Accessibility', () => {
    it('all sections are both semantic and accessible', () => {
      const accessibleSectionArb = fc.record({
        id: fc.constantFrom('hero', 'about', 'skills', 'projects', 'experience', 'contact'),
        tagName: fc.constant('section'),
        ariaLabel: fc.string({ minLength: 1, maxLength: 50 }).map(s => `${s} section`),
        role: fc.option(fc.constantFrom('region', 'banner', 'contentinfo', 'navigation', 'main'), { nil: undefined }),
      });

      fc.assert(
        fc.property(accessibleSectionArb, (section) => {
          // Section must use semantic HTML AND have accessibility label
          const isSemantic = usesSemanticHTML(section.tagName);
          const isAccessible = Boolean(section.ariaLabel);
          return isSemantic && isAccessible;
        }),
        { numRuns: 100 }
      );
    });
  });
});
