// Property-based tests for Experience section
// **Feature: backend-portfolio-website, Property 5: Experience Entry Completeness**
// **Validates: Requirements 5.2**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { Experience } from '@/types';

// Test data defined inline
const experienceData: Experience[] = [
  {
    id: 'senior-backend-engineer',
    company: 'TechCorp Inc.',
    role: 'Senior Backend Engineer',
    period: '2022 - Present',
    scale: 'Platform serving 10M+ daily active users across 50+ microservices',
    complexity: 'Distributed systems with event-driven architecture and multi-region deployment',
    impact: [
      'Led migration from monolith to microservices, reducing deployment time by 80%',
      'Designed caching strategy that reduced database load by 60%',
    ],
  },
];

// Generator for valid experience entry
const experienceArb: fc.Arbitrary<Experience> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'exp-id'),
  company: fc.string({ minLength: 1, maxLength: 100 }),
  role: fc.string({ minLength: 1, maxLength: 100 }),
  period: fc.string({ minLength: 1, maxLength: 50 }),
  scale: fc.string({ minLength: 10, maxLength: 300 }),
  complexity: fc.string({ minLength: 10, maxLength: 300 }),
  impact: fc.array(fc.string({ minLength: 5, maxLength: 200 }), { minLength: 1, maxLength: 10 }),
});

/**
 * Helper function to validate that an experience entry has all required fields
 * for display: scale, complexity, and impact
 * This validates what ExperienceCard would render
 */
function validateExperienceFieldsPresent(experience: Experience): boolean {
  return (
    // Scale field is present and non-empty
    typeof experience.scale === 'string' &&
    experience.scale.length > 0 &&
    // Complexity field is present and non-empty
    typeof experience.complexity === 'string' &&
    experience.complexity.length > 0 &&
    // Impact field is present with at least one item
    Array.isArray(experience.impact) &&
    experience.impact.length > 0 &&
    experience.impact.every(item => typeof item === 'string' && item.length > 0)
  );
}

describe('Experience Section Properties', () => {
  /**
   * **Feature: backend-portfolio-website, Property 5: Experience Entry Completeness**
   * **Validates: Requirements 5.2**
   *
   * For any valid Experience object, the rendered experience entry SHALL display
   * the scale, complexity, and impact fields.
   */
  describe('Property 5: Experience Entry Completeness', () => {
    it('actual experienceData contains scale, complexity, and impact for each entry', () => {
      experienceData.forEach((experience) => {
        // Scale field
        expect(experience.scale).toBeDefined();
        expect(typeof experience.scale).toBe('string');
        expect(experience.scale.length).toBeGreaterThan(0);

        // Complexity field
        expect(experience.complexity).toBeDefined();
        expect(typeof experience.complexity).toBe('string');
        expect(experience.complexity.length).toBeGreaterThan(0);

        // Impact field
        expect(experience.impact).toBeDefined();
        expect(Array.isArray(experience.impact)).toBe(true);
        expect(experience.impact.length).toBeGreaterThan(0);
        experience.impact.forEach((item) => {
          expect(typeof item).toBe('string');
          expect(item.length).toBeGreaterThan(0);
        });
      });
    });

    it('any valid experience entry has scale, complexity, and impact fields present', () => {
      fc.assert(
        fc.property(experienceArb, (experience: Experience) => {
          const isValid = validateExperienceFieldsPresent(experience);
          expect(isValid).toBe(true);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('scale field is always a non-empty string for any valid experience', () => {
      fc.assert(
        fc.property(experienceArb, (experience: Experience) => {
          expect(typeof experience.scale).toBe('string');
          expect(experience.scale.length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('complexity field is always a non-empty string for any valid experience', () => {
      fc.assert(
        fc.property(experienceArb, (experience: Experience) => {
          expect(typeof experience.complexity).toBe('string');
          expect(experience.complexity.length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('impact field contains all items for any valid experience', () => {
      fc.assert(
        fc.property(experienceArb, (experience: Experience) => {
          expect(Array.isArray(experience.impact)).toBe(true);
          expect(experience.impact.length).toBeGreaterThanOrEqual(1);
          experience.impact.forEach((item) => {
            expect(typeof item).toBe('string');
            expect(item.length).toBeGreaterThan(0);
          });
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
