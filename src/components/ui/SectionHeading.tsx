'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

export interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  withAccent?: boolean;
  gradient?: boolean;
}

const headingStyles: Record<HeadingLevel, string> = {
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold',
  h2: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold',
  h3: 'text-xl sm:text-2xl md:text-3xl font-semibold',
  h4: 'text-lg sm:text-xl md:text-2xl font-semibold',
};

const alignStyles = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export const SectionHeading = forwardRef<HTMLHeadingElement, SectionHeadingProps>(
  (
    {
      as: Component = 'h2',
      subtitle,
      align = 'left',
      withAccent = true,
      gradient = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('mb-8 sm:mb-10 md:mb-12', alignStyles[align])}>
        {/* Decorative line for centered headings */}
        {align === 'center' && (
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-accent-blue" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent-blue" />
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-accent-blue" />
          </div>
        )}
        
        <Component
          ref={ref}
          className={cn(
            'tracking-tight',
            gradient ? 'gradient-text' : 'text-text-primary',
            headingStyles[Component],
            className
          )}
          {...props}
        >
          {children}
          {withAccent && (
            <span className="gradient-text">.</span>
          )}
        </Component>
        
        {subtitle && (
          <p className={cn(
            'mt-3 sm:mt-4 text-text-secondary text-sm sm:text-base md:text-lg max-w-2xl px-2 sm:px-0',
            align === 'center' && 'mx-auto'
          )}>
            {subtitle}
          </p>
        )}
      </div>
    );
  }
);

SectionHeading.displayName = 'SectionHeading';

export default SectionHeading;
