'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { skillsData } from '@/data/skills';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SkillBadge } from '@/components/ui/SkillBadge';
import { SkillCategory } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scrollRevealConfig,
  reducedMotionVariants,
} from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface SkillsSectionProps {
  categories?: SkillCategory[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  backend: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  databases: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  'system-design': (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  devops: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
};

const categoryColors: Record<string, string> = {
  backend: 'from-accent-blue to-accent-cyan',
  databases: 'from-accent-purple to-accent-pink',
  'system-design': 'from-accent-cyan to-accent-green',
  devops: 'from-accent-pink to-accent-purple',
};

export function Skills({ categories = skillsData }: SkillsSectionProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer;
  const itemVariants = prefersReducedMotion ? reducedMotionVariants : staggerItem;

  return (
    <section
      id="skills"
      className="py-24 md:py-32 bg-bg-primary relative overflow-hidden"
      aria-label="Skills section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-accent-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-accent-purple/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div {...scrollRevealConfig} variants={containerVariants}>
          <motion.div variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}>
            <SectionHeading
              align="center"
              subtitle="Technical competencies across backend development, databases, system design, and cloud infrastructure"
            >
              Skills & Expertise
            </SectionHeading>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {categories.map((category) => (
              <motion.article
                key={category.id}
                className="group relative"
                variants={itemVariants}
                aria-labelledby={`category-${category.id}`}
              >
                {/* Gradient border effect */}
                <div className={`absolute -inset-[1px] bg-gradient-to-r ${categoryColors[category.id] || 'from-accent-blue to-accent-purple'} rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`} />
                
                {/* Solid background card for text readability */}
                <div className="relative rounded-2xl bg-bg-secondary p-6 h-full border border-border-subtle group-hover:border-transparent transition-all duration-500">
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${categoryColors[category.id] || 'from-accent-blue to-accent-purple'}`}>
                      {categoryIcons[category.id] || (
                        <div className="w-6 h-6 rounded-full bg-white/20" />
                      )}
                    </div>
                    <h3
                      id={`category-${category.id}`}
                      className="text-xl font-semibold text-text-primary"
                    >
                      {category.name}
                    </h3>
                  </div>

                  {/* Skills grid */}
                  <div
                    className="flex flex-wrap gap-2.5"
                    role="list"
                    aria-label={`${category.name} skills`}
                  >
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: skillIndex * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <SkillBadge
                          skill={skill}
                          showProficiency={false}
                          size="md"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Skills;
