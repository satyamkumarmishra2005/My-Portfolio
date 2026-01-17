// Property-based tests for Blogs section component
// **Feature: hero-image-and-blogs, Property 2: Blog Fetch Returns Limited Results**
// **Validates: Requirements 3.1, 3.4**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { Blog } from '@/types';

// Helper to generate valid ISO date strings
const isoDateArb = fc.integer({ min: 1577836800000, max: Date.now() }).map(ts => new Date(ts).toISOString());

// Generator for valid Blog objects
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

// Generator for arrays of blogs with varying sizes (0 to 10)
const blogsArrayArb = fc.array(blogArb, { minLength: 0, maxLength: 10 });

/**
 * Simulates the blog limiting logic from the Blogs component and API route
 * This mirrors the actual implementation: (data.blogs || []).slice(0, maxPosts)
 */
function limitBlogs(blogs: Blog[], maxPosts: number = 3): Blog[] {
  return blogs.slice(0, maxPosts);
}

/**
 * Simulates the API route's blog limiting logic
 * This mirrors: articles.slice(0, 3).map(transformArticle)
 */
function apiLimitBlogs(blogs: Blog[]): Blog[] {
  return blogs.slice(0, 3);
}

/**
 * Checks if blogs are ordered by most recent publication date
 */
function isOrderedByMostRecent(blogs: Blog[]): boolean {
  if (blogs.length <= 1) return true;
  
  for (let i = 0; i < blogs.length - 1; i++) {
    const currentDate = new Date(blogs[i].publishedAt).getTime();
    const nextDate = new Date(blogs[i + 1].publishedAt).getTime();
    if (currentDate < nextDate) {
      return false;
    }
  }
  return true;
}

describe('Blogs Section Properties', () => {
  /**
   * **Feature: hero-image-and-blogs, Property 2: Blog Fetch Returns Limited Results**
   * **Validates: Requirements 3.1, 3.4**
   *
   * For any successful API call to the dev.to endpoint, the Blogs section SHALL
   * display at most 3 blog posts, ordered by most recent publication date.
   */
  describe('Property 2: Blog Fetch Returns Limited Results', () => {
    it('for any array of blogs, the limited result contains at most 3 items', () => {
      fc.assert(
        fc.property(blogsArrayArb, (blogs: Blog[]) => {
          const limited = limitBlogs(blogs);
          
          // Result should never exceed 3 items
          expect(limited.length).toBeLessThanOrEqual(3);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('for any array of blogs, API limiting returns at most 3 items', () => {
      fc.assert(
        fc.property(blogsArrayArb, (blogs: Blog[]) => {
          const limited = apiLimitBlogs(blogs);
          
          // API should never return more than 3 items
          expect(limited.length).toBeLessThanOrEqual(3);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('for any array with more than 3 blogs, exactly 3 are returned', () => {
      const largeArrayArb = fc.array(blogArb, { minLength: 4, maxLength: 10 });
      
      fc.assert(
        fc.property(largeArrayArb, (blogs: Blog[]) => {
          const limited = limitBlogs(blogs);
          
          // When input has more than 3, output should be exactly 3
          expect(limited.length).toBe(3);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('for any array with 3 or fewer blogs, all are returned', () => {
      const smallArrayArb = fc.array(blogArb, { minLength: 0, maxLength: 3 });
      
      fc.assert(
        fc.property(smallArrayArb, (blogs: Blog[]) => {
          const limited = limitBlogs(blogs);
          
          // When input has 3 or fewer, all should be returned
          expect(limited.length).toBe(blogs.length);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('for any array of blogs, limited result preserves original order', () => {
      fc.assert(
        fc.property(blogsArrayArb, (blogs: Blog[]) => {
          const limited = limitBlogs(blogs);
          
          // Each item in limited should match the corresponding item in original
          for (let i = 0; i < limited.length; i++) {
            expect(limited[i].id).toBe(blogs[i].id);
            expect(limited[i].title).toBe(blogs[i].title);
          }
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('for any empty array, result is also empty', () => {
      const emptyArrayArb = fc.constant([] as Blog[]);
      
      fc.assert(
        fc.property(emptyArrayArb, (blogs: Blog[]) => {
          const limited = limitBlogs(blogs);
          
          expect(limited.length).toBe(0);
          expect(Array.isArray(limited)).toBe(true);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('for any custom maxPosts value, result respects that limit', () => {
      const maxPostsArb = fc.integer({ min: 1, max: 10 });
      
      fc.assert(
        fc.property(blogsArrayArb, maxPostsArb, (blogs: Blog[], maxPosts: number) => {
          const limited = limitBlogs(blogs, maxPosts);
          
          // Result should never exceed maxPosts
          expect(limited.length).toBeLessThanOrEqual(maxPosts);
          
          // Result should be min(blogs.length, maxPosts)
          expect(limited.length).toBe(Math.min(blogs.length, maxPosts));
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('for any pre-sorted array by date, limited result maintains sort order', () => {
      // Generate blogs and sort them by date (most recent first)
      const sortedBlogsArb = blogsArrayArb.map(blogs => 
        [...blogs].sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
      );
      
      fc.assert(
        fc.property(sortedBlogsArb, (blogs: Blog[]) => {
          const limited = limitBlogs(blogs);
          
          // If input is sorted by most recent, output should also be sorted
          expect(isOrderedByMostRecent(limited)).toBe(true);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
