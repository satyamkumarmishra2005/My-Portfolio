// Property-based tests for contact form validation
// **Feature: backend-portfolio-website, Property 6: Contact Form Valid Submission**
// **Feature: backend-portfolio-website, Property 7: Contact Form Invalid Submission**
// **Validates: Requirements 6.3, 6.4**

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateContactForm } from './validation';
import type { ContactFormData } from '@/types';

// Helper to generate valid email addresses
const validEmailArb = fc.tuple(
  fc.string({ minLength: 1, maxLength: 20, unit: 'grapheme' }).map(s => s.replace(/[^a-z0-9]/gi, 'a') || 'user'),
  fc.string({ minLength: 1, maxLength: 10, unit: 'grapheme' }).map(s => s.replace(/[^a-z0-9]/gi, 'a') || 'domain'),
  fc.constantFrom('com', 'org', 'net', 'io', 'dev')
).map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

describe('Contact Form Validation Properties', () => {
  /**
   * **Feature: backend-portfolio-website, Property 6: Contact Form Valid Submission**
   * **Validates: Requirements 6.3**
   * 
   * For any ContactFormData with name (≥2 chars), valid email format, 
   * and message (≥10 chars), the validation function SHALL return 
   * isValid: true with empty errors object.
   */
  it('Property 6: accepts all valid form data', () => {
    // Generator for valid names (at least 2 non-whitespace characters)
    const validName = fc.string({ minLength: 2, maxLength: 100 })
      .filter((s: string) => s.trim().length >= 2);

    // Generator for valid messages (at least 10 non-whitespace characters)
    const validMessage = fc.string({ minLength: 10, maxLength: 1000 })
      .filter((s: string) => s.trim().length >= 10);

    fc.assert(
      fc.property(
        fc.record({
          name: validName,
          email: validEmailArb,
          message: validMessage,
        }),
        (data: ContactFormData) => {
          const result = validateContactForm(data);
          expect(result.isValid).toBe(true);
          expect(Object.keys(result.errors)).toHaveLength(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: backend-portfolio-website, Property 7: Contact Form Invalid Submission**
   * **Validates: Requirements 6.4**
   * 
   * For any ContactFormData with invalid fields (empty name, malformed email, 
   * or short message), the validation function SHALL return isValid: false 
   * with appropriate error messages for each invalid field.
   */
  describe('Property 7: rejects invalid form data', () => {
    it('rejects names that are too short', () => {
      // Generator for invalid names (less than 2 chars when trimmed)
      const invalidName = fc.oneof(
        fc.constant(''),
        fc.constant(' '),
        fc.constant('  '),
        fc.constant('\t'),
        fc.constant('\n'),
        fc.string({ minLength: 0, maxLength: 1 }).filter((s: string) => s.trim().length <= 1)
      );

      const validMessage = fc.string({ minLength: 10, maxLength: 100 })
        .filter((s: string) => s.trim().length >= 10);

      fc.assert(
        fc.property(
          fc.record({
            name: invalidName,
            email: validEmailArb,
            message: validMessage,
          }),
          (data: ContactFormData) => {
            const result = validateContactForm(data);
            expect(result.isValid).toBe(false);
            expect(result.errors.name).toBeDefined();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects invalid email formats', () => {
      // Generator for invalid emails
      const invalidEmail = fc.oneof(
        fc.constant(''),
        fc.constant('notanemail'),
        fc.constant('missing@domain'),
        fc.constant('@nodomain.com'),
        fc.constant('spaces in@email.com'),
        fc.constant('no.at.sign'),
        fc.constant('double@@at.com'),
        fc.string({ minLength: 1, maxLength: 20 }).filter((s: string) => !s.includes('@') || !s.includes('.'))
      );

      const validName = fc.string({ minLength: 2, maxLength: 50 })
        .filter((s: string) => s.trim().length >= 2);

      const validMessage = fc.string({ minLength: 10, maxLength: 100 })
        .filter((s: string) => s.trim().length >= 10);

      fc.assert(
        fc.property(
          fc.record({
            name: validName,
            email: invalidEmail,
            message: validMessage,
          }),
          (data: ContactFormData) => {
            const result = validateContactForm(data);
            expect(result.isValid).toBe(false);
            expect(result.errors.email).toBeDefined();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('rejects messages that are too short', () => {
      // Generator for invalid messages (less than 10 chars when trimmed)
      const invalidMessage = fc.oneof(
        fc.constant(''),
        fc.constant('   '),
        fc.constant('\t\t\t'),
        fc.constant('short'),
        fc.constant('123456789'),
        fc.string({ minLength: 0, maxLength: 9 }).filter((s: string) => s.trim().length < 10)
      );

      const validName = fc.string({ minLength: 2, maxLength: 50 })
        .filter((s: string) => s.trim().length >= 2);

      fc.assert(
        fc.property(
          fc.record({
            name: validName,
            email: validEmailArb,
            message: invalidMessage,
          }),
          (data: ContactFormData) => {
            const result = validateContactForm(data);
            expect(result.isValid).toBe(false);
            expect(result.errors.message).toBeDefined();
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
