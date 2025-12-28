'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Experience as ExperienceType } from '@/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceCard } from './ExperienceCard';
import {
  fadeInUp,
  staggerContainer,
  scrollRevealConfig,
  reducedMotionVariants,
} from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Default experience data
const defaultExperienceData: ExperienceType[] = [
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
      'Mentored team of 5 engineers on distributed systems best practices',
      'Established observability standards adopted across 12 engineering teams',
    ],
  },
  {
    id: 'backend-engineer',
    company: 'StartupXYZ',
    role: 'Backend Engineer',
    period: '2020 - 2022',
    scale: 'High-throughput payment processing handling $50M+ monthly transactions',
    complexity: 'Real-time transaction processing with strict consistency requirements',
    impact: [
      'Built payment reconciliation system processing 100K+ daily transactions',
      'Implemented idempotency layer reducing duplicate transactions by 99.9%',
      'Optimized database queries reducing P95 latency from 500ms to 50ms',
      'Designed fraud detection pipeline catching $2M+ in fraudulent transactions',
    ],
  },
  {
    id: 'software-engineer',
    company: 'Enterprise Solutions Ltd.',
    role: 'Software Engineer',
    period: '2018 - 2020',
    scale: 'Enterprise SaaS platform with 500+ B2B clients',
    complexity: 'Multi-tenant architecture with custom data isolation requirements',
    impact: [
      'Developed REST API layer serving 1M+ daily requests',
      'Implemented tenant isolation improving security compliance',
      'Built automated testing framework increasing code coverage to 85%',
      'Reduced infrastructure costs by 30% through resource optimization',
    ],
  },
];

export interface ExperienceSectionProps {
  experiences?: ExperienceType[];
}

export function Experience({ experiences = defaultExperienceData }: ExperienceSectionProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer;

  return (
    <section
      id="experience"
      className="py-24 md:py-32 bg-bg-primary relative overflow-hidden"
      aria-label="Experience section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-accent-cyan/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <motion.div {...scrollRevealConfig} variants={containerVariants}>
          <motion.div variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}>
            <SectionHeading
              align="center"
              subtitle="Career progression emphasizing scale, complexity, and measurable impact"
            >
              Experience
            </SectionHeading>
          </motion.div>

          {/* Timeline container */}
          <div className="relative">
            {/* Vertical timeline line - gradient */}
            <div
              className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5"
              aria-hidden="true"
            >
              <div className="h-full bg-gradient-to-b from-accent-blue via-accent-purple to-accent-pink opacity-30" />
            </div>

            {/* Timeline entries */}
            <div className="space-y-12">
              {experiences.map((experience, index) => (
                <div
                  key={experience.id}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline dot with glow */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 mt-8 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 w-4 h-4 bg-accent-blue rounded-full blur-md opacity-50" />
                      <div className="relative w-4 h-4 bg-gradient-to-br from-accent-blue to-accent-purple rounded-full ring-4 ring-bg-primary" />
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card container */}
                  <div className="ml-12 md:ml-0 md:w-1/2 md:px-8">
                    <ExperienceCard experience={experience} />
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline end dot */}
            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 -bottom-4">
              <div className="w-3 h-3 bg-accent-purple/50 rounded-full ring-4 ring-bg-primary" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Experience;
