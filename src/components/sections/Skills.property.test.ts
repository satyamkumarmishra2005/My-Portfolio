// Property-based tests for Skills section
// **Feature: backend-portfolio-website, Property 2: Skills Category Completeness**
// **Validates: Requirements 3.1**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { skillsData } from '@/data/skills';
import type { SkillCategory, Skill } from '@/types';

// Required category IDs as per Requirements 3.1, 3.2, 3.3, 3.4, 3.5
const REQUIRED_CATEGORIES = ['backend', 'databases', 'system-design', 'devops'] as const;
const REQUIRED_CATEGORY_NAMES = ['Backend', 'Databases', 'System Design', 'DevOps & Cloud'] as const;

// Generator for valid skill
const skillArb: fc.Arbitrary<Skill> = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  icon: fc.string({ minLength: 1, maxLength: 20 }),
  proficiency: fc.integer({ min: 0, max: 100 }),
});

// Generator for valid skill category
const skillCategoryArb = (id: string, name: string): fc.Arbitrary<SkillCategory> =>
  fc.record({
    id: fc.constant(id),
    name: fc.constant(name),
    skills: fc.array(skillArb, { minLength: 1, maxLength: 10 }),
  });

// Generator for a complete valid skills data array with all required categories
const validSkillsDataArb: fc.Arbitrary<SkillCategory[]> = fc.tuple(
  skillCategoryArb('backend', 'Backend'),
  skillCategoryArb('databases', 'Databases'),
  skillCategoryArb('system-design', 'System Design'),
  skillCategoryArb('devops', 'DevOps & Cloud')
).map(([backend, databases, systemDesign, devops]) => [backend, databases, systemDesign, devops]);

describe('Skills Section Properties', () => {
  /**
   * **Feature: backend-portfolio-website, Property 2: Skills Category Completeness**
   * **Validates: Requirements 3.1**
   *
   * For any valid skills data array, the rendered Skills section SHALL contain
   * exactly four category groups: Backend, Databases, System Design, and DevOps & Cloud.
   */
  describe('Property 2: Skills Category Completeness', () => {
    it('actual skillsData contains exactly four required categories', () => {
      // Verify the actual data has exactly 4 categories
      expect(skillsData).toHaveLength(4);

      // Verify all required category IDs are present
      const categoryIds = skillsData.map((cat) => cat.id);
      REQUIRED_CATEGORIES.forEach((requiredId) => {
        expect(categoryIds).toContain(requiredId);
      });

      // Verify all required category names are present
      const categoryNames = skillsData.map((cat) => cat.name);
      REQUIRED_CATEGORY_NAMES.forEach((requiredName) => {
        expect(categoryNames).toContain(requiredName);
      });
    });

    it('any valid skills data array contains exactly four categories with correct IDs', () => {
      fc.assert(
        fc.property(validSkillsDataArb, (categories: SkillCategory[]) => {
          // Must have exactly 4 categories
          expect(categories).toHaveLength(4);

          // Extract category IDs
          const categoryIds = categories.map((cat) => cat.id);

          // All required category IDs must be present
          REQUIRED_CATEGORIES.forEach((requiredId) => {
            expect(categoryIds).toContain(requiredId);
          });

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('any valid skills data array contains categories with correct names', () => {
      fc.assert(
        fc.property(validSkillsDataArb, (categories: SkillCategory[]) => {
          // Extract category names
          const categoryNames = categories.map((cat) => cat.name);

          // All required category names must be present
          REQUIRED_CATEGORY_NAMES.forEach((requiredName) => {
            expect(categoryNames).toContain(requiredName);
          });

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('each category in valid skills data has at least one skill', () => {
      fc.assert(
        fc.property(validSkillsDataArb, (categories: SkillCategory[]) => {
          categories.forEach((category) => {
            expect(category.skills.length).toBeGreaterThanOrEqual(1);
          });

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('each skill has valid proficiency between 0 and 100', () => {
      fc.assert(
        fc.property(validSkillsDataArb, (categories: SkillCategory[]) => {
          categories.forEach((category) => {
            category.skills.forEach((skill) => {
              expect(skill.proficiency).toBeGreaterThanOrEqual(0);
              expect(skill.proficiency).toBeLessThanOrEqual(100);
            });
          });

          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
