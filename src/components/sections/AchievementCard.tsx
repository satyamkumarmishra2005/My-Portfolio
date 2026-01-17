'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface AchievementCardProps {
  achievement: Achievement;
  index?: number;
}

// Category-specific gradient colors
const categoryGradients: Record<string, { bg: string; border: string; glow: string }> = {
  hackathon: {
    bg: 'from-accent-blue via-accent-cyan to-accent-blue',
    border: 'from-accent-blue/50 to-accent-cyan/50',
    glow: 'shadow-accent-blue/20',
  },
  competition: {
    bg: 'from-accent-purple via-accent-pink to-accent-purple',
    border: 'from-accent-purple/50 to-accent-pink/50',
    glow: 'shadow-accent-purple/20',
  },
  certification: {
    bg: 'from-accent-cyan via-accent-green to-accent-cyan',
    border: 'from-accent-cyan/50 to-accent-green/50',
    glow: 'shadow-accent-cyan/20',
  },
  award: {
    bg: 'from-accent-pink via-accent-purple to-accent-pink',
    border: 'from-accent-pink/50 to-accent-purple/50',
    glow: 'shadow-accent-pink/20',
  },
};

// Icon components
function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function MedalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function CertificateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: TrophyIcon,
  medal: MedalIcon,
  certificate: CertificateIcon,
  star: StarIcon,
};


// Enhanced Image gallery component
function ImageGallery({ images, gradientClass }: { images: string[]; gradientClass: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="relative mb-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main image container with enhanced styling */}
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-bg-tertiary group/gallery">
        {/* Animated gradient border */}
        <div className={`absolute -inset-[1px] bg-gradient-to-r ${gradientClass} rounded-xl opacity-0 group-hover/gallery:opacity-60 transition-opacity duration-500 blur-[2px]`} />
        
        {/* Inner container */}
        <div className="absolute inset-[1px] rounded-xl overflow-hidden bg-bg-tertiary">
          {/* Gradient overlay on hover */}
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none`}
            animate={{ opacity: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Image with animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full h-full"
            >
              <Image
                src={images[activeIndex]}
                alt={`Achievement image ${activeIndex + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover/gallery:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <motion.button
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 min-w-[44px] min-h-[44px] rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all touch-manipulation active:scale-95 flex items-center justify-center"
                onClick={() => setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                transition={{ duration: 0.2 }}
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 min-w-[44px] min-h-[44px] rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all touch-manipulation active:scale-95 flex items-center justify-center"
                onClick={() => setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                transition={{ duration: 0.2 }}
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </>
          )}

          {/* Image counter badge */}
          {images.length > 1 && (
            <motion.div 
              className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-md border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-white/70">{activeIndex + 1}</span>
              <span className="text-white/40 mx-1">/</span>
              <span className="text-white/70">{images.length}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced thumbnail dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-3 mt-4">
          {images.map((_, index) => (
            <motion.button
              key={index}
              className={`min-w-[44px] min-h-[44px] rounded-full transition-all duration-300 flex items-center justify-center touch-manipulation active:scale-95 ${
                index === activeIndex 
                  ? 'bg-bg-tertiary/50' 
                  : 'bg-transparent hover:bg-bg-tertiary/30'
              }`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Go to image ${index + 1}`}
            >
              <span className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? `bg-gradient-to-r ${gradientClass} w-6` 
                  : 'bg-border-subtle hover:bg-text-muted w-2'
              }`} />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}


export function AchievementCard({ achievement, index = 0 }: AchievementCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Get gradient colors based on category
  const gradients = achievement.category
    ? categoryGradients[achievement.category] || categoryGradients.award
    : categoryGradients.award;

  // Get icon component
  const IconComponent = achievement.icon ? iconMap[achievement.icon] : StarIcon;

  return (
    <motion.article
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      viewport={{ once: true }}
      whileHover={prefersReducedMotion ? {} : { y: -5 }}
    >
      {/* Card content */}
      <div className="relative h-full rounded-2xl bg-bg-secondary/95 backdrop-blur-sm p-5 sm:p-7 border border-border-subtle transition-all duration-500 overflow-hidden">
        {/* Decorative corner accent */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradients.bg} opacity-5 rounded-bl-full`} />
        
        {/* Category badge */}
        {achievement.category && (
          <motion.div 
            className="absolute top-4 right-4 sm:top-5 sm:right-5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-gradient-to-r ${gradients.bg} text-white shadow-lg`}>
              {achievement.category}
            </span>
          </motion.div>
        )}

        {/* Header with icon */}
        <div className="flex items-start gap-4 mb-5">
          {/* Animated icon container */}
          <motion.div 
            className={`relative p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${gradients.bg} flex-shrink-0 shadow-lg`}
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
            data-testid="achievement-icon"
          >
            {/* Icon glow */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradients.bg} blur-md opacity-50`} />
            <IconComponent className="relative w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </motion.div>
          
          <div className="flex-1 min-w-0 pt-1">
            <h3 
              className={`text-xl sm:text-2xl font-bold leading-tight transition-all duration-300 ${
                isHovered ? 'gradient-text' : 'text-text-primary'
              }`}
            >
              {achievement.title}
            </h3>
            <p className={`text-sm sm:text-base font-semibold mt-1 bg-gradient-to-r ${gradients.bg} bg-clip-text text-transparent`}>
              {achievement.event}
            </p>
          </div>
        </div>

        {/* Date badge with enhanced styling */}
        <motion.div 
          className="mb-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="inline-flex items-center gap-2 text-text-muted text-xs sm:text-sm font-medium px-3 py-1.5 bg-bg-tertiary/80 rounded-full border border-border-subtle backdrop-blur-sm">
            <svg className="w-4 h-4 text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {achievement.date}
          </span>
        </motion.div>

        {/* Image Gallery */}
        {achievement.images && achievement.images.length > 0 && (
          <ImageGallery images={achievement.images} gradientClass={gradients.bg} />
        )}

        {/* Description with enhanced typography */}
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {achievement.description}
        </p>

        {/* Optional link with enhanced styling */}
        {achievement.link && (
          <motion.div 
            className="mt-5 pt-5 border-t border-border-subtle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a
              href={achievement.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-5 py-3 min-h-[44px] rounded-xl text-sm font-semibold bg-gradient-to-r ${gradients.bg} text-white hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation`}
            >
              Learn more
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </motion.div>
        )}
        
        {/* Decorative bottom line */}
        <motion.div 
          className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradients.bg}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </motion.article>
  );
}

export default AchievementCard;
