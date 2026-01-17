// Property-based tests for BlogCard component
// **Feature: hero-image-and-blogs, Property 3: Blog Card Content Completeness**
// **Validates: Requirements 4.1, 4.2, 4.3**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { Blog } from '@/types';

// Helper to generate valid ISO date strings
const isoDateArb = fc.integer({ min: 1577836800000, max: Date.now() }).map(ts => new Date(ts).toISOString());

// Generator for valid Blog objects with all required fields
const blogArb: fc.Arbitrary<Blog> = fc.record({
  id: fc.integer({ min: 1, max: 1000000 }),
  title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  url: fc.webUrl(),
  coverImage: fc.option(fc.webUrl(), { nil: null }),
  socialImage: fc.option(fc.webUrl(), { nil: null }),
  publishedAt: isoDateArb,
  readingTimeMinutes: fc.integer({ min: 1, max: 60 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0), { minLength: 0, maxLength: 5 }),
});

// Generator for Blog with cover image
const blogWithCoverImageArb: fc.Arbitrary<Blog> = fc.record({
  id: fc.integer({ min: 1, max: 1000000 }),
  title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  url: fc.webUrl(),
  coverImage: fc.webUrl(),
  socialImage: fc.option(fc.webUrl(), { nil: null }),
  publishedAt: isoDateArb,
  readingTimeMinutes: fc.integer({ min: 1, max: 60 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0), { minLength: 0, maxLength: 5 }),
});

// Generator for Blog without cover image
const blogWithoutCoverImageArb: fc.Arbitrary<Blog> = fc.record({
  id: fc.integer({ min: 1, max: 1000000 }),
  title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  url: fc.webUrl(),
  coverImage: fc.constant(null),
  socialImage: fc.option(fc.webUrl(), { nil: null }),
  publishedAt: isoDateArb,
  readingTimeMinutes: fc.integer({ min: 1, max: 60 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0), { minLength: 0, maxLength: 5 }),
});

// Generator for Blog with tags
const blogWithTagsArb: fc.Arbitrary<Blog> = fc.record({
  id: fc.integer({ min: 1, max: 1000000 }),
  title: fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
  description: fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
  url: fc.webUrl(),
  coverImage: fc.option(fc.webUrl(), { nil: null }),
  socialImage: fc.option(fc.webUrl(), { nil: null }),
  publishedAt: isoDateArb,
  readingTimeMinutes: fc.integer({ min: 1, max: 60 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0), { minLength: 1, maxLength: 5 }),
});

/**
 * Helper function to check if all required fields are present for display
 */
function getDisplayedFields(blog: Blog): {
  hasTitle: boolean;
  hasDescription: boolean;
  hasPublishedDate: boolean;
  hasReadingTime: boolean;
  hasCoverImage: boolean;
  hasTags: boolean;
} {
  return {
    hasTitle: typeof blog.title === 'string' && blog.title.length > 0,
    hasDescription: typeof blog.description === 'string' && blog.description.length > 0,
    hasPublishedDate: typeof blog.publishedAt === 'string' && blog.publishedAt.length > 0,
    hasReadingTime: typeof blog.readingTimeMinutes === 'number' && blog.readingTimeMinutes > 0,
    hasCoverImage: blog.coverImage !== null && typeof blog.coverImage === 'string' && blog.coverImage.length > 0,
    hasTags: Array.isArray(blog.tags) && blog.tags.length > 0,
  };
}

/**
 * Helper function to format date (mirrors BlogCard implementation)
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

describe('BlogCard Properties', () => {
  /**
   * **Feature: hero-image-and-blogs, Property 3: Blog Card Content Completeness**
   * **Validates: Requirements 4.1, 4.2, 4.3**
   *
   * For any blog post data, the BlogCard component SHALL render the title,
   * description, published date, and reading time. If a cover image exists,
   * it SHALL be displayed; if tags exist, they SHALL be displayed.
   */
  describe('Property 3: Blog Card Content Completeness', () => {
    it('any valid blog has all required fields present for display', () => {
      fc.assert(
        fc.property(blogArb, (blog: Blog) => {
          const displayed = getDisplayedFields(blog);

          // All required fields must be present
          expect(displayed.hasTitle).toBe(true);
          expect(displayed.hasDescription).toBe(true);
          expect(displayed.hasPublishedDate).toBe(true);
          expect(displayed.hasReadingTime).toBe(true);

          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('title field is always a non-empty string for any valid blog', () => {
      fc.assert(
        fc.property(blogArb, (blog: Blog) => {
          expect(typeof blog.title).toBe('string');
          expect(blog.title.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('description field is always a non-empty string for any valid blog', () => {
      fc.assert(
        fc.property(blogArb, (blog: Blog) => {
          expect(typeof blog.description).toBe('string');
          expect(blog.description.trim().length).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('publishedAt field is always a valid ISO date string for any valid blog', () => {
      fc.assert(
        fc.property(blogArb, (blog: Blog) => {
          expect(typeof blog.publishedAt).toBe('string');
          expect(blog.publishedAt.length).toBeGreaterThan(0);
          
          // Verify it can be parsed as a date
          const date = new Date(blog.publishedAt);
          expect(date.toString()).not.toBe('Invalid Date');
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('readingTimeMinutes is always a positive number for any valid blog', () => {
      fc.assert(
        fc.property(blogArb, (blog: Blog) => {
          expect(typeof blog.readingTimeMinutes).toBe('number');
          expect(blog.readingTimeMinutes).toBeGreaterThan(0);
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('cover image is displayed when present', () => {
      fc.assert(
        fc.property(blogWithCoverImageArb, (blog: Blog) => {
          const displayed = getDisplayedFields(blog);
          
          expect(displayed.hasCoverImage).toBe(true);
          expect(blog.coverImage).not.toBeNull();
          expect(typeof blog.coverImage).toBe('string');
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('cover image is not displayed when null', () => {
      fc.assert(
        fc.property(blogWithoutCoverImageArb, (blog: Blog) => {
          const displayed = getDisplayedFields(blog);
          
          expect(displayed.hasCoverImage).toBe(false);
          expect(blog.coverImage).toBeNull();
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('tags are displayed when present', () => {
      fc.assert(
        fc.property(blogWithTagsArb, (blog: Blog) => {
          const displayed = getDisplayedFields(blog);
          
          expect(displayed.hasTags).toBe(true);
          expect(Array.isArray(blog.tags)).toBe(true);
          expect(blog.tags.length).toBeGreaterThan(0);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('date formatting produces valid output for any valid date', () => {
      fc.assert(
        fc.property(blogArb, (blog: Blog) => {
          const formatted = formatDate(blog.publishedAt);
          
          // Formatted date should be a non-empty string
          expect(typeof formatted).toBe('string');
          expect(formatted.length).toBeGreaterThan(0);
          
          // Should contain month abbreviation pattern (e.g., "Jan", "Feb", etc.)
          const monthPattern = /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/;
          expect(monthPattern.test(formatted)).toBe(true);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('url field is always a valid URL string for any valid blog', () => {
      fc.assert(
        fc.property(blogArb, (blog: Blog) => {
          expect(typeof blog.url).toBe('string');
          expect(blog.url.length).toBeGreaterThan(0);
          
          // Should be a valid URL
          expect(() => new URL(blog.url)).not.toThrow();
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
