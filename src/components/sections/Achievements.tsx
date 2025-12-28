'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { achievementsData } from '@/data/achievements';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AchievementCard } from './AchievementCard';
import { Achievement } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scrollRevealConfig,
  reducedMotionVariants,
} from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface AchievementsSectionProps {
  achievements?: Achievement[];
}

/**
 * Achievements section component displaying notable accomplishments
 * Requirements: 1.1, 1.2, 1.3, 4.1, 5.1, 5.2, 5.3
 */
export function Achievements({ achievements = achievementsData }: AchievementsSectionProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer;
  const itemVariants = prefersReducedMotion ? reducedMotionVariants : staggerItem;

  // Don't render section if no achievements
  if (!achievements || achievements.length === 0) {
    return <></>;
  }

  return (
    <section
      id="achievements"
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-bg-primary relative overflow-hidden"
      aria-label="Achievements section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-16 sm:-right-32 w-48 sm:w-64 h-48 sm:h-64 bg-accent-purple/10 rounded-full blur-[80px] sm:blur-[100px]" />
        <div className="absolute bottom-1/4 -left-16 sm:-left-32 w-48 sm:w-64 h-48 sm:h-64 bg-accent-cyan/10 rounded-full blur-[80px] sm:blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div {...scrollRevealConfig} variants={containerVariants}>
          <motion.div variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}>
            <SectionHeading
              align="center"
              subtitle="Some of my major Achievements"
            >
              Achievements
            </SectionHeading>
          </motion.div>

          {/* Responsive grid: single column on mobile, multi-column on tablet/desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
              >
                <AchievementCard achievement={achievement} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Achievements;
