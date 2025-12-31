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
 */
export function Achievements({ achievements = achievementsData }: AchievementsSectionProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer;
  const itemVariants = prefersReducedMotion ? reducedMotionVariants : staggerItem;

  if (!achievements || achievements.length === 0) {
    return <></>;
  }

  return (
    <section
      id="achievements"
      className="py-20 sm:py-28 md:py-32 lg:py-40 bg-bg-primary relative overflow-hidden"
      aria-label="Achievements section"
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-accent-purple/8 rounded-full blur-[100px] sm:blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-accent-cyan/8 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-accent-blue/5 rounded-full blur-[120px] sm:blur-[180px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
        
        {/* Decorative grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Floating particles effect */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-accent-purple/30 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent-cyan/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-accent-blue/25 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-2.5 h-2.5 bg-accent-pink/20 rounded-full animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div {...scrollRevealConfig} variants={containerVariants}>
          {/* Enhanced section header */}
          <motion.div variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp} className="mb-12 sm:mb-16">
            {/* Decorative badge */}
            <div className="flex justify-center mb-6">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card"
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-purple"></span>
                </span>
                <span className="text-xs sm:text-sm font-medium text-text-secondary">Recognition & Awards</span>
              </motion.div>
            </div>
            
            <SectionHeading
              align="center"
              subtitle="Milestones that mark my journey of continuous learning and achievement"
            >
              Achievements
            </SectionHeading>
          </motion.div>

          {/* Achievement cards with enhanced layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                custom={index}
                className={achievements.length === 1 ? 'lg:col-span-2 lg:max-w-2xl lg:mx-auto' : ''}
              >
                <AchievementCard achievement={achievement} index={index} />
              </motion.div>
            ))}
          </div>

          {/* Bottom decorative element */}
          <motion.div 
            className="mt-16 sm:mt-20 flex justify-center"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-accent-purple/50" />
              <div className="w-2 h-2 rounded-full bg-accent-purple/50" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan" />
              <div className="w-2 h-2 rounded-full bg-accent-cyan/50" />
              <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-accent-cyan/50" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Achievements;
