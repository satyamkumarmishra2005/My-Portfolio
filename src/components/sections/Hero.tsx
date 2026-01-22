'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { heroContent } from '@/data/content';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

// Static fallback background for mobile/reduced motion
function StaticBackground(): JSX.Element {
  return (
    <div 
      className="absolute inset-0 bg-bg-primary noise-overlay"
      aria-label="Decorative background"
    >
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-blue/20 dark:bg-accent-blue/20 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-purple/20 dark:bg-accent-purple/20 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/10 dark:bg-accent-cyan/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-bg-primary" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
    </div>
  );
}

// Dynamic imports for 3D components
const ThreeCanvas = dynamic(
  () => import('@/components/three/ThreeCanvas').then((mod) => mod.ThreeCanvas),
  { ssr: false, loading: () => <StaticBackground /> }
);

const SimpleNetworkGraph = dynamic(
  () => import('@/components/three/SimpleNetworkGraph').then((mod) => mod.SimpleNetworkGraph),
  { ssr: false }
);

export interface HeroProps {
  name?: string;
  title?: string;
  tagline?: string;
  profileImage?: string;
}

// Letter animation variants
const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
    },
  }),
};

// Animated text component for letter-by-letter animation
function AnimatedName({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className="inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero({
  name = heroContent.name,
  title = heroContent.title,
  tagline = heroContent.tagline,
  profileImage = '/MyIMG.png',
}: HeroProps): JSX.Element {
  const { progress } = useScrollProgress();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const shouldShow3D = mounted && hasWebGL && !isMobile && !prefersReducedMotion;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* 3D Background or Static Fallback */}
      <div className="absolute inset-0 z-0">
        {shouldShow3D ? (
          <ThreeCanvas enableInteraction={true}>
            <SimpleNetworkGraph scrollProgress={progress} />
          </ThreeCanvas>
        ) : (
          <StaticBackground />
        )}
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-bg-primary/60 via-transparent to-bg-primary dark:from-bg-primary/60 dark:via-transparent dark:to-bg-primary" />

      {/* Content - Responsive layout: stacked on mobile, side-by-side on desktop */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {/* Profile Image - shown first on mobile (stacked), on right side on desktop */}
          <motion.div
            className="order-1 md:order-2 flex-shrink-0"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <div 
              className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-80 lg:h-80"
              data-testid="profile-image-container"
            >
              {/* Gradient glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink opacity-75 blur-xl animate-pulse-glow" />
              {/* Gradient border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink p-1">
                <div className="w-full h-full rounded-full bg-bg-primary overflow-hidden">
                  <Image
                    src={profileImage}
                    alt={`${name} profile photo`}
                    fill
                    className="object-cover rounded-full"
                    sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 320px"
                    priority
                    data-testid="profile-image"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.header
            className="order-2 md:order-1 text-center md:text-left flex-1"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Decorative badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-card mb-6 sm:mb-8"
              variants={fadeInUp}
            >
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
              <span className="text-xs sm:text-sm text-text-secondary">Available for opportunities</span>
            </motion.div>

            <motion.h1
              className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 tracking-tight"
              variants={fadeInUp}
            >
              <span className="text-text-primary block sm:inline">Hi, I&apos;m </span>
              <AnimatedName text={name} className="gradient-text block sm:inline whitespace-nowrap" />
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-4 sm:mb-6"
              variants={fadeInUp}
            >
              <span className="text-text-secondary">{title}</span>
            </motion.p>

            <motion.p
              className="text-base sm:text-lg md:text-lg lg:text-xl text-text-muted max-w-2xl mx-auto md:mx-0 mb-8 sm:mb-10 px-2 md:px-0"
              variants={fadeInUp}
            >
              {tagline}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 w-full px-4 sm:px-0"
              variants={fadeInUp}
            >
              <a
                href="#projects"
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
              >
                <div className="absolute inset-0 bg-gradient-primary opacity-100 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink animate-shimmer" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View My Work
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
              <a
                href="/Satyam resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-text-primary glass-card hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Resume
              </a>
              <a
                href="#contact"
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-semibold text-text-primary glass-card hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation text-center"
              >
                Get In Touch
              </a>
            </motion.div>
          </motion.header>
        </div>
      </div>
    </section>
  );
}

export default Hero;
