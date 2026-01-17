'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Blog } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface BlogCardProps {
  blog: Blog;
  index?: number;
}

/**
 * Formats a date string to a readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * BlogCard component displays individual blog post information
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 3.3
 */
export function BlogCard({ blog, index = 0 }: BlogCardProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  
  // Use coverImage, fallback to socialImage
  const imageUrl = blog.coverImage || blog.socialImage;

  return (
    <motion.article
      className="group relative h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      viewport={{ once: true }}
      whileHover={prefersReducedMotion ? {} : { y: -5 }}
    >
      {/* Card content */}
      <a
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-full rounded-2xl bg-bg-secondary/95 backdrop-blur-sm border border-border-subtle hover:border-accent-blue/50 transition-all duration-300 overflow-hidden"
        aria-label={`Read blog post: ${blog.title}`}
      >
        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden bg-bg-tertiary">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`Cover image for ${blog.title}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center">
              <svg className="w-12 h-12 text-text-muted/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Meta info: date and reading time */}
          <div className="flex items-center gap-3 mb-3 text-xs sm:text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time>
            </span>
            <span className="flex items-center gap-1.5">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {blog.readingTimeMinutes} min read
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:gradient-text transition-all duration-300">
            {blog.title}
          </h3>

          {/* Description */}
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4">
            {blog.description}
          </p>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 min-h-[32px] text-xs font-medium bg-bg-tertiary text-text-muted rounded-full border border-border-subtle hover:border-accent-blue/50 hover:text-accent-blue transition-all duration-300 inline-flex items-center"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Read more indicator */}
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
            <span className="text-sm font-medium text-accent-cyan group-hover:text-accent-blue transition-colors duration-300">
              Read on dev.to
            </span>
            <svg
              className="w-5 h-5 text-accent-cyan group-hover:text-accent-blue group-hover:translate-x-1 transition-all duration-300"
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
          </div>
        </div>
      </a>
    </motion.article>
  );
}

export default BlogCard;
