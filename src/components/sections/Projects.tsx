'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { projectsData } from '@/data/projects';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scrollRevealConfig,
  reducedMotionVariants,
} from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ProjectsSectionProps {
  projects?: Project[];
}

export function Projects({ projects = projectsData }: ProjectsSectionProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer;
  const itemVariants = prefersReducedMotion ? reducedMotionVariants : staggerItem;

  return (
    <section
      id="projects"
      className="py-16 sm:py-20 md:py-24 lg:py-32 bg-bg-secondary relative overflow-hidden"
      aria-label="Projects section"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -right-16 sm:-right-32 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-accent-purple/5 rounded-full blur-[100px] sm:blur-[150px]" />
        <div className="absolute bottom-1/3 -left-16 sm:-left-32 w-[250px] sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] md:h-[400px] bg-accent-blue/5 rounded-full blur-[80px] sm:blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div {...scrollRevealConfig} variants={containerVariants}>
          <motion.div variants={prefersReducedMotion ? reducedMotionVariants : fadeInUp}>
            <SectionHeading
              align="center"
              subtitle="Some of my projects showcasing backend development, microservices, and cloud infrastructure"
            >
              Featured Projects
            </SectionHeading>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                custom={index}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>

          {/* View more CTA */}
          <motion.div 
            className="mt-8 sm:mt-10 md:mt-12 text-center"
            variants={itemVariants}
          >
            <a
              href="https://github.com/satyamkumarmishra2005"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl glass-card text-text-primary text-sm sm:text-base font-medium hover:border-accent-blue/30 transition-all duration-300 group touch-manipulation active:scale-95"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View More on GitHub
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;
