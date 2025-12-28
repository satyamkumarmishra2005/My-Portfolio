'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { validateContactForm } from '@/lib/validation';
import { fadeInUp, reducedMotionVariants } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ContactFormData, ContactFormValidation } from '@/types';

export interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({ onSubmit }: ContactFormProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : fadeInUp;

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });

  const [validation, setValidation] = useState<ContactFormValidation>({
    isValid: true,
    errors: {},
  });

  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing
      setValidation((prev) => {
        if (prev.errors[name as keyof typeof prev.errors]) {
          return {
            ...prev,
            errors: { ...prev.errors, [name]: undefined },
          };
        }
        return prev;
      });
    },
    []
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      setFormData((currentFormData) => {
        const result = validateContactForm(currentFormData);
        if (result.errors[name as keyof typeof result.errors]) {
          setValidation((prev) => ({
            ...prev,
            errors: {
              ...prev.errors,
              [name]: result.errors[name as keyof typeof result.errors],
            },
          }));
        }
        return currentFormData;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const result = validateContactForm(formData);
      setValidation(result);
      setTouched({ name: true, email: true, message: true });

      if (!result.isValid) {
        return;
      }

      setStatus('submitting');

      try {
        if (onSubmit) {
          await onSubmit(formData);
        }
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTouched({});
      } catch {
        setStatus('error');
      }
    },
    [formData, onSubmit]
  );

  const getFieldError = (field: keyof ContactFormValidation['errors']) => {
    return touched[field] ? validation.errors[field] : undefined;
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-4 py-3.5 bg-bg-tertiary border rounded-xl placeholder-text-muted
    text-gray-900 dark:text-text-primary
    focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue
    transition-all duration-300
    ${hasError ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-border-subtle hover:border-border-accent/50'}
  `;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      variants={variants}
      initial="hidden"
      animate="visible"
      noValidate
      aria-label="Contact form"
    >
      {/* Name Field */}
      <div>
        <label
          htmlFor="contact-name"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Name
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses(!!getFieldError('name'))}
          placeholder="John Doe"
          aria-invalid={!!getFieldError('name')}
          aria-describedby={getFieldError('name') ? 'name-error' : undefined}
          disabled={status === 'submitting'}
        />
        {getFieldError('name') && (
          <motion.p
            id="name-error"
            className="mt-2 text-sm text-red-400 flex items-center gap-1"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {getFieldError('name')}
          </motion.p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses(!!getFieldError('email'))}
          placeholder="john@example.com"
          aria-invalid={!!getFieldError('email')}
          aria-describedby={getFieldError('email') ? 'email-error' : undefined}
          disabled={status === 'submitting'}
        />
        {getFieldError('email') && (
          <motion.p
            id="email-error"
            className="mt-2 text-sm text-red-400 flex items-center gap-1"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {getFieldError('email')}
          </motion.p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-medium text-text-primary mb-2"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={5}
          className={`${inputClasses(!!getFieldError('message'))} resize-none`}
          placeholder="Tell me about your project or opportunity..."
          aria-invalid={!!getFieldError('message')}
          aria-describedby={getFieldError('message') ? 'message-error' : undefined}
          disabled={status === 'submitting'}
        />
        {getFieldError('message') && (
          <motion.p
            id="message-error"
            className="mt-2 text-sm text-red-400 flex items-center gap-1"
            role="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {getFieldError('message')}
          </motion.p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        isLoading={status === 'submitting'}
        aria-label="Send message"
        rightIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        }
      >
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </Button>

      {/* Submission Feedback */}
      {status === 'success' && (
        <motion.div
          className="p-4 rounded-xl bg-accent-green/10 border border-accent-green/20 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          aria-live="polite"
        >
          <div className="p-1 rounded-full bg-accent-green/20">
            <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-accent-green font-medium">Message sent successfully! I&apos;ll get back to you soon.</p>
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          <div className="p-1 rounded-full bg-red-500/20">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-400 font-medium">Something went wrong. Please try again or email directly.</p>
        </motion.div>
      )}
    </motion.form>
  );
}

export default ContactForm;
