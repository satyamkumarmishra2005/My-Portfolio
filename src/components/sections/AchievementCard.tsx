'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types';
import { staggerItem, reducedMotionVariants } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface AchievementCardProps {
  achievement: Achievement;
}

// Category-specific gradient colors
const categoryColors: Record<string, string> = {
  hackathon: 'from-accent-blue to-accent-cyan',
  competition: 'from-accent-purple to-accent-pink',
  certification: 'from-accent-cyan to-accent-green',
  award: 'from-accent-pink to-accent-purple',
};

// Icon components for different achievement types
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function MedalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function CertificateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: TrophyIcon,
  medal: MedalIcon,
  certificate: CertificateIcon,
  star: StarIcon,
};

// Image gallery component with animations
function ImageGallery({ images, gradientClass }: { images: string[]; gradientClass: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="relative mt-4 mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main image container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-bg-tertiary">
        {/* Gradient overlay on hover */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-t ${gradientClass} opacity-0 z-10 pointer-events-none`}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Image with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.1 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <Image
              src={images[activeIndex]}
              alt={`Achievement image ${activeIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows - only show if multiple images */}
        {images.length > 1 && (
          <>
            <motion.button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm"
              onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.7)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.2 }}
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white backdrop-blur-sm"
              onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.7)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}

        {/* Image counter badge */}
        {images.length > 1 && (
          <motion.div 
            className="absolute bottom-2 right-2 z-20 px-2 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {activeIndex + 1} / {images.length}
          </motion.div>
        )}
      </div>

      {/* Thumbnail dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? `bg-gradient-to-r ${gradientClass} w-6` 
                  : 'bg-border-subtle hover:bg-text-muted'
              }`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AchievementCard({ achievement }: AchievementCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? reducedMotionVariants : staggerItem;

  // Get gradient colors based on category
  const gradientClass = achievement.category
    ? categoryColors[achievement.category] || categoryColors.award
    : categoryColors.award;

  // Get icon component
  const IconComponent = achievement.icon ? iconMap[achievement.icon] : null;

  return (
    <motion.div variants={variants} className="group">
      {/* Gradient border wrapper */}
      <div className="relative">
        <div className={`absolute -inset-[1px] bg-gradient-to-r ${gradientClass} rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500`} />
        
        {/* Solid background card for text readability */}
        <div className="relative rounded-2xl bg-bg-secondary p-4 sm:p-6 h-full border border-border-subtle group-hover:border-transparent transition-all duration-500">
          {/* Header with icon */}
          <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
            {IconComponent && (
              <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${gradientClass} flex-shrink-0`} data-testid="achievement-icon">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-text-primary group-hover:gradient-text transition-all duration-300 line-clamp-2">
                {achievement.title}
              </h3>
              <p className="text-accent-blue font-medium mt-0.5 sm:mt-1 text-sm sm:text-base">
                {achievement.event}
              </p>
            </div>
          </div>

          {/* Date badge */}
          <div className="mb-3 sm:mb-4">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 text-text-muted text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 bg-bg-tertiary rounded-full border border-border-subtle">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {achievement.date}
            </span>
          </div>

          {/* Image Gallery */}
          {achievement.images && achievement.images.length > 0 && (
            <ImageGallery images={achievement.images} gradientClass={gradientClass} />
          )}

          {/* Description */}
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
            {achievement.description}
          </p>

          {/* Optional link */}
          {achievement.link && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border-subtle">
              <a
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-blue transition-colors duration-300 text-xs sm:text-sm font-medium touch-manipulation active:scale-95"
              >
                Learn more
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default AchievementCard;
