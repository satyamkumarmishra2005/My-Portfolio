'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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

      {/* Content */}
      <motion.header
        className="relative z-20 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8"
          variants={fadeInUp}
        >
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-sm text-text-secondary">Available for opportunities</span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight whitespace-nowrap"
          variants={fadeInUp}
        >
          <span className="text-text-primary">Hi, I&apos;m </span>
          <AnimatedName text={name} className="gradient-text whitespace-nowrap" />
        </motion.h1>

        <motion.p
          className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6"
          variants={fadeInUp}
        >
          <span className="text-text-secondary">{title}</span>
        </motion.p>

        <motion.p
          className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10"
          variants={fadeInUp}
        >
          {tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          variants={fadeInUp}
        >
          <a
            href="#projects"
            className="group relative px-8 py-4 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-100 group-hover:opacity-90 transition-opacity" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink animate-shimmer" />
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </a>
          <a
            href="#contact"
            className="px-8 py-4 rounded-xl font-semibold text-text-primary glass-card hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            Get In Touch
          </a>
        </motion.div>
      </motion.header>
    </section>
  );
}

export default Hero;
