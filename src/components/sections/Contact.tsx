'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from './ContactForm';
import { contactContent } from '@/data/content';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scrollRevealConfig,
  reducedMotionVariants,
} from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ContactFormData } from '@/types';

export interface ContactProps {
  heading?: string;
  description?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

export function Contact({
  heading = contactContent.heading,
  description = contactContent.description,
  email = contactContent.email,
  github = contactContent.github,
  linkedin = contactContent.linkedin,
  onSubmit,
}: ContactProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : staggerItem;
  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer;

  const handleSubmit = async (data: ContactFormData) => {
    if (onSubmit) {
      await onSubmit(data);
    } else {
      // Send email directly from client using Web3Forms
      // Note: Client-side is required because Web3Forms blocks server-side requests via Cloudflare
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '36b5a074-78c1-4267-abb7-b5c54b8f00fc',
          name: data.name,
          email: data.email,
          message: data.message,
          subject: `Portfolio Contact: Message from ${data.name}`,
          from_name: 'Portfolio Website',
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to send message');
      }
    }
  };

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-bg-primary relative overflow-hidden"
      aria-label="Contact section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent-blue/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-accent-purple/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <motion.div
          {...scrollRevealConfig}
          variants={containerVariants}
        >
          <motion.div variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}>
            <SectionHeading align="center">
              {heading}
            </SectionHeading>
          </motion.div>

          <motion.p
            className="text-text-secondary text-lg text-center mb-12 max-w-2xl mx-auto"
            variants={variants}
          >
            {description}
          </motion.p>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <motion.div className="lg:col-span-2 space-y-6" variants={variants}>
              {/* Quick contact cards */}
              <div className="space-y-4">
                {/* Email */}
                <a
                  href={`mailto:${email}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl glass-card hover:border-accent-blue/30 transition-all duration-300"
                  aria-label={`Send email to ${email}`}
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-muted mb-0.5">Email</p>
                    <p className="text-text-primary font-medium truncate group-hover:text-accent-blue transition-colors">
                      {email}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-text-muted group-hover:text-accent-blue group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl glass-card hover:border-accent-purple/30 transition-all duration-300"
                  aria-label="Visit GitHub profile"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-muted mb-0.5">GitHub</p>
                    <p className="text-text-primary font-medium group-hover:text-accent-purple transition-colors">
                      View Profile
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-text-muted group-hover:text-accent-purple group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-2xl glass-card hover:border-accent-cyan/30 transition-all duration-300"
                  aria-label="Visit LinkedIn profile"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-muted mb-0.5">LinkedIn</p>
                    <p className="text-text-primary font-medium group-hover:text-accent-cyan transition-colors">
                      Connect
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-text-muted group-hover:text-accent-cyan group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>

              {/* Availability badge */}
              <div className="p-4 rounded-2xl bg-accent-green/10 border border-accent-green/20">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-green"></span>
                  </span>
                  <span className="text-accent-green font-medium">Available for new opportunities</span>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div className="lg:col-span-3" variants={variants}>
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Send a Message
                </h3>
                <ContactForm onSubmit={handleSubmit} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Contact;
