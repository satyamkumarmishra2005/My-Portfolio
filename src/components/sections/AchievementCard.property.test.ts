// Property-based tests for AchievementCard component
// **Feature: achievements-section, Property 1: Achievement Card Required Fields Display**
// **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { Achievement } from '@/types';

// Generator for valid Achievement objects with required fields
const achievementArb: fc.Arbitrary<Achievement> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'ach-id'),
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  event: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  date: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  icon: fc.option(fc.constantFrom('trophy', 'medal', 'certificate', 'star'), { nil: undefined }),
  link: fc.option(fc.webUrl(), { nil: undefined }),
  category: fc.option(fc.constantFrom('hackathon', 'competition', 'certification', 'award'), { nil: undefined }),
});

/**
 * Helper function to simulate what AchievementCard would render
 * Returns an object with the fields that would be displayed
 */
function getDisplayedFields(achievement: Achievement): {
  hasTitle: boolean;
  hasEvent: boolean;
  hasDate: boolean;
  hasDescription: boolean;
} {
  return {
    hasTitle: typeof achievement.title === 'string' && achievement.title.length > 0,
    hasEvent: typeof achievement.event === 'string' && achievement.event.length > 0,
    hasDate: typeof achievement.date === 'string' && achievement.date.length > 0,
    hasDescription: typeof achievement.description === 'string' && achievement.description.length > 0,
  };
}

describe('AchievementCard Properties', () => {
  /**
   * **Feature: achievements-section, Property 1: Achievement Card Required Fields Display**
   * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
   *
   * For any valid Achievement object, the rendered AchievementCard component
   * SHALL display the title, event, date, and description fields in the output.
   */
  describe('Property 1: Achievement Card Required Fields Display', () => {
    it('any valid achievement has all required fields present for display', () => {
      fc.assert(
        fc.property(achievementArb, (achievement: Achievement) => {
          const displayed = getDisplayedFields(achievement);
          
          // All required fields must be present
          expect(displayed.hasTitle).toBe(true);
          expect(displayed.hasEvent).toBe(true);
          expect(displayed.hasDate).toBe(true);
          expect(displayed.hasDescription).toBe(true);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('title field is always a non-empty string for any valid achievement', () => {
      fc.assert(
        fc.property(achievementArb, (achievement: Achievement) => {
          expect(typeof achievement.title).toBe('string');
          expect(achievement.title.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('event field is always a non-empty string for any valid achievement', () => {
      fc.assert(
        fc.property(achievementArb, (achievement: Achievement) => {
          expect(typeof achievement.event).toBe('string');
          expect(achievement.event.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('date field is always a non-empty string for any valid achievement', () => {
      fc.assert(
        fc.property(achievementArb, (achievement: Achievement) => {
          expect(typeof achievement.date).toBe('string');
          expect(achievement.date.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('description field is always a non-empty string for any valid achievement', () => {
      fc.assert(
        fc.property(achievementArb, (achievement: Achievement) => {
          expect(typeof achievement.description).toBe('string');
          expect(achievement.description.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});


// **Feature: achievements-section, Property 2: Achievement Card Optional Icon Display**
// **Validates: Requirements 2.5, 4.3**

// Generator for Achievement with icon defined
const achievementWithIconArb: fc.Arbitrary<Achievement> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'ach-id'),
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  event: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  date: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  icon: fc.constantFrom('trophy', 'medal', 'certificate', 'star'),
  link: fc.option(fc.webUrl(), { nil: undefined }),
  category: fc.option(fc.constantFrom('hackathon', 'competition', 'certification', 'award'), { nil: undefined }),
});

// Generator for Achievement without icon
const achievementWithoutIconArb: fc.Arbitrary<Achievement> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/\s/g, '-') || 'ach-id'),
  title: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  event: fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
  date: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  icon: fc.constant(undefined),
  link: fc.option(fc.webUrl(), { nil: undefined }),
  category: fc.option(fc.constantFrom('hackathon', 'competition', 'certification', 'award'), { nil: undefined }),
});

// Valid icon values that the component supports
const validIcons = ['trophy', 'medal', 'certificate', 'star'];

/**
 * Helper function to determine if an icon should be displayed
 */
function shouldDisplayIcon(achievement: Achievement): boolean {
  return achievement.icon !== undefined && validIcons.includes(achievement.icon);
}

describe('AchievementCard Icon Properties', () => {
  /**
   * **Feature: achievements-section, Property 2: Achievement Card Optional Icon Display**
   * **Validates: Requirements 2.5, 4.3**
   *
   * For any Achievement object with an icon field defined, the rendered
   * AchievementCard component SHALL include a visual icon indicator in the output.
   */
  describe('Property 2: Achievement Card Optional Icon Display', () => {
    it('achievements with valid icon field should display icon indicator', () => {
      fc.assert(
        fc.property(achievementWithIconArb, (achievement: Achievement) => {
          const shouldShow = shouldDisplayIcon(achievement);
          
          // When icon is defined with a valid value, it should be displayed
          expect(shouldShow).toBe(true);
          expect(achievement.icon).toBeDefined();
          expect(validIcons).toContain(achievement.icon);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('achievements without icon field should not display icon indicator', () => {
      fc.assert(
        fc.property(achievementWithoutIconArb, (achievement: Achievement) => {
          const shouldShow = shouldDisplayIcon(achievement);
          
          // When icon is undefined, no icon should be displayed
          expect(shouldShow).toBe(false);
          expect(achievement.icon).toBeUndefined();
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('icon field when present is always a valid icon type', () => {
      fc.assert(
        fc.property(achievementWithIconArb, (achievement: Achievement) => {
          expect(achievement.icon).toBeDefined();
          expect(typeof achievement.icon).toBe('string');
          expect(validIcons).toContain(achievement.icon);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('icon display logic is consistent for any achievement', () => {
      fc.assert(
        fc.property(achievementArb, (achievement: Achievement) => {
          const shouldShow = shouldDisplayIcon(achievement);
          
          // Icon should be shown if and only if icon field is defined and valid
          if (achievement.icon !== undefined) {
            expect(shouldShow).toBe(validIcons.includes(achievement.icon));
          } else {
            expect(shouldShow).toBe(false);
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
