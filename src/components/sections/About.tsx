'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { aboutContent, contactContent } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { fadeInUp, staggerContainer, staggerItem, scrollRevealConfig } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { reducedMotionVariants } from '@/lib/animations';

const GitHubActivity = dynamic(
  () => import('@/components/ui/GitHubActivity').then((mod) => mod.GitHubActivity),
  {
    ssr: false,
    loading: () => (
      <div className="mt-8 p-6 glass-card rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-text-secondary">Loading GitHub activity...</span>
        </div>
      </div>
    ),
  }
);

export interface AboutProps {
  heading?: string;
  paragraphs?: string[];
  githubUsername?: string;
}

export function About({
  heading = aboutContent.heading,
  paragraphs = aboutContent.paragraphs,
  githubUsername,
}: AboutProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : staggerItem;
  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer;

  const username = githubUsername || extractGitHubUsername(contactContent.github);

  return (
    <section
      id="about"
      className="py-24 md:py-32 bg-bg-secondary relative overflow-hidden"
      aria-label="About section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-purple/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <motion.article
          {...scrollRevealConfig}
          variants={containerVariants}
        >
          <motion.div variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}>
            <SectionHeading align="center">
              {heading}
            </SectionHeading>
          </motion.div>

          {/* About content with decorative elements */}
          <div className="relative">
            {/* Decorative quote mark */}
            <div className="absolute -top-8 -left-4 text-8xl text-accent-blue/10 font-serif select-none">
              &ldquo;
            </div>
            
            <div className="space-y-6 relative z-10">
              {paragraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  className={`text-lg leading-relaxed ${
                    index === 0 
                      ? 'text-text-primary text-xl font-medium' 
                      : 'text-text-secondary'
                  }`}
                  variants={variants}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>

          {/* GitHub Activity Section */}
          {username && (
            <motion.div variants={variants}>
              <GitHubActivity username={username} />
            </motion.div>
          )}
        </motion.article>
      </div>
    </section>
  );
}

function extractGitHubUsername(url: string): string | null {
  const match = url.match(/github\.com\/([^\/]+)/);
  return match ? match[1] : null;
}

export default About;
