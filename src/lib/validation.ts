// Contact form validation utilities
// Requirements: 6.3, 6.4

import type { ContactFormData, ContactFormValidation } from '@/types';

/**
 * Validates contact form data according to the following rules:
 * - Name: must be at least 2 characters (trimmed)
 * - Email: must match valid email format
 * - Message: must be at least 10 characters (trimmed)
 * 
 * @param data - The contact form data to validate
 * @returns ContactFormValidation with isValid flag and any error messages
 */
export function validateContactForm(data: ContactFormData): ContactFormValidation {
  const errors: ContactFormValidation['errors'] = {};

  // Validate name: must be at least 2 characters
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Validate email: must match valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate message: must be at least 10 characters
  if (!data.message || data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
