'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Experience } from '@/types';
import { staggerItem, reducedMotionVariants } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ExperienceCardProps {
  experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : staggerItem;

  return (
    <motion.div variants={variants} className="group">
      {/* Gradient border wrapper */}
      <div className="relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-accent-cyan via-accent-blue to-accent-purple rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
        
        {/* Solid background card for text readability */}
        <div className="relative rounded-2xl bg-bg-secondary p-6 h-full border border-border-subtle group-hover:border-transparent transition-all duration-500">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
            <div>
              <h3 className="text-xl font-bold text-text-primary group-hover:gradient-text transition-all duration-300">
                {experience.role}
              </h3>
              <p className="text-accent-blue font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {experience.company}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-text-muted text-sm font-medium px-3 py-1.5 bg-bg-tertiary rounded-full border border-border-subtle">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {experience.period}
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {/* Scale */}
            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-subtle">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-accent-cyan/20">
                  <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Scale
                </h4>
              </div>
              <p className="text-text-secondary text-sm">{experience.scale}</p>
            </div>

            {/* Complexity */}
            <div className="p-4 rounded-xl bg-bg-tertiary/50 border border-border-subtle">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-accent-purple/20">
                  <svg className="w-4 h-4 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                  Complexity
                </h4>
              </div>
              <p className="text-text-secondary text-sm">{experience.complexity}</p>
            </div>
          </div>

          {/* Impact */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-accent-green/20">
                <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                Impact
              </h4>
            </div>
            <ul className="space-y-2" role="list" aria-label="Impact achievements">
              {experience.impact.map((item, index) => (
                <li
                  key={index}
                  className="text-text-secondary text-sm flex items-start gap-2"
                >
                  <span className="text-accent-green mt-1">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ExperienceCard;
