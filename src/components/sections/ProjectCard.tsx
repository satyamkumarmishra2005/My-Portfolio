'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.3 }}
      aria-labelledby={`project-${project.id}-title`}
      className="group"
    >
      {/* Gradient border wrapper */}
      <div className="relative">
        <div className="absolute -inset-[1px] bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
        
        {/* Solid background card for text readability */}
        <div className="relative rounded-2xl bg-bg-secondary p-4 sm:p-6 md:p-8 h-full border border-border-subtle group-hover:border-transparent transition-all duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3
                id={`project-${project.id}-title`}
                className="text-lg sm:text-xl md:text-2xl font-bold text-text-primary truncate"
              >
                {project.title}
              </h3>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex gap-2 flex-shrink-0">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-bg-tertiary hover:bg-accent-blue/20 text-text-muted hover:text-accent-blue transition-all duration-300 touch-manipulation active:scale-95 inline-flex items-center justify-center"
                aria-label={`View ${project.title} source code on GitHub`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 min-w-[44px] min-h-[44px] rounded-lg bg-bg-tertiary hover:bg-accent-cyan/20 text-text-muted hover:text-accent-cyan transition-all duration-300 touch-manipulation active:scale-95 inline-flex items-center justify-center"
                aria-label={`View ${project.title} live demo`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-5">
            {/* Problem Statement */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <h4 className="text-xs sm:text-sm font-semibold text-accent-cyan uppercase tracking-wider">
                  Problem
                </h4>
              </div>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                {project.problemStatement}
              </p>
            </div>

            {/* Architecture Overview */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                <h4 className="text-xs sm:text-sm font-semibold text-accent-cyan uppercase tracking-wider">
                  Architecture
                </h4>
              </div>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                {project.architectureOverview}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-5">
            {/* Key Achievements */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                <h4 className="text-xs sm:text-sm font-semibold text-accent-cyan uppercase tracking-wider">
                  Key Achievements
                </h4>
              </div>
              <ul className="space-y-1.5 sm:space-y-2" aria-label="Key achievements">
                {project.challengesSolved.map((challenge, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-text-secondary text-xs sm:text-sm"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-green mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border-subtle">
          <div className="flex flex-wrap gap-1.5 sm:gap-2" role="list" aria-label="Technologies used">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                role="listitem"
                className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium bg-bg-tertiary text-text-primary rounded-lg border border-border-subtle hover:border-accent-blue/50 hover:bg-accent-blue/10 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProjectCard;
