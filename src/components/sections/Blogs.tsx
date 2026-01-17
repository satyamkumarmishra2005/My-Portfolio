'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BlogCard } from './BlogCard';
import { Blog } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scrollRevealConfig,
  reducedMotionVariants,
} from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface BlogsSectionProps {
  username?: string;
  maxPosts?: number;
}

interface FetchState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

/**
 * Blogs section component displaying latest blog posts from dev.to
 * Requirements: 3.1, 3.2, 6.1, 6.2, 6.3
 */
export function Blogs({ username = 'satyammishra', maxPosts = 3 }: BlogsSectionProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion ? reducedMotionVariants : staggerContainer;
  const itemVariants = prefersReducedMotion ? reducedMotionVariants : staggerItem;

  const [state, setState] = useState<FetchState>({
    blogs: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch(`/api/devto?username=${encodeURIComponent(username)}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch blog posts');
        }

        const data = await response.json();
        const blogs = (data.blogs || []).slice(0, maxPosts);
        
        setState({ blogs, loading: false, error: null });
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setState({
          blogs: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch blog posts',
        });
      }
    }

    fetchBlogs();
  }, [username, maxPosts]);


  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-bg-secondary/50 border border-border-subtle overflow-hidden animate-pulse"
        >
          <div className="aspect-[16/9] bg-bg-tertiary" />
          <div className="p-5 sm:p-6 space-y-3">
            <div className="flex gap-3">
              <div className="h-4 w-20 bg-bg-tertiary rounded" />
              <div className="h-4 w-16 bg-bg-tertiary rounded" />
            </div>
            <div className="h-6 w-3/4 bg-bg-tertiary rounded" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-bg-tertiary rounded" />
              <div className="h-4 w-2/3 bg-bg-tertiary rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-bg-tertiary rounded-full" />
              <div className="h-6 w-14 bg-bg-tertiary rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state with fallback link
  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4">
        <svg
          className="w-8 h-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <p className="text-text-secondary mb-4">{state.error}</p>
      <a
        href={`https://dev.to/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium hover:opacity-90 transition-opacity"
      >
        View on dev.to
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-blue/10 mb-4">
        <svg
          className="w-8 h-8 text-accent-blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
      <p className="text-text-secondary mb-4">No blog posts yet. Check back soon!</p>
      <a
        href={`https://dev.to/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-blue transition-colors"
      >
        Visit my dev.to profile
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );


  return (
    <section
      id="blogs"
      className="py-20 sm:py-28 md:py-32 lg:py-40 bg-bg-primary relative overflow-hidden"
      aria-label="Blogs section"
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-accent-cyan/8 rounded-full blur-[100px] sm:blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-0 left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-accent-purple/8 rounded-full blur-[80px] sm:blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
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
        <div className="absolute top-20 right-10 w-2 h-2 bg-accent-cyan/30 rounded-full animate-float" />
        <div className="absolute top-40 left-20 w-3 h-3 bg-accent-purple/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-accent-blue/25 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/3 w-2.5 h-2.5 bg-accent-pink/20 rounded-full animate-float" style={{ animationDelay: '3s' }} />
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan"></span>
                </span>
                <span className="text-xs sm:text-sm font-medium text-text-secondary">Latest Articles</span>
              </motion.div>
            </div>
            
            <SectionHeading
              align="center"
              subtitle="Thoughts, tutorials, and insights from my journey in software development"
            >
              Blog Posts
            </SectionHeading>
          </motion.div>

          {/* Content based on state */}
          {state.loading ? (
            <LoadingSkeleton />
          ) : state.error ? (
            <ErrorState />
          ) : state.blogs.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Blog cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {state.blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <BlogCard blog={blog} index={index} />
                  </motion.div>
                ))}
              </div>

              {/* View all link */}
              <motion.div 
                className="mt-10 sm:mt-12 flex justify-center"
                variants={itemVariants}
              >
                <a
                  href={`https://dev.to/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-text-secondary hover:text-accent-cyan transition-colors group"
                >
                  View all posts on dev.to
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </motion.div>
            </>
          )}

          {/* Bottom decorative element */}
          <motion.div 
            className="mt-16 sm:mt-20 flex justify-center"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-accent-cyan/50" />
              <div className="w-2 h-2 rounded-full bg-accent-cyan/50" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple" />
              <div className="w-2 h-2 rounded-full bg-accent-purple/50" />
              <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-accent-purple/50" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Blogs;
