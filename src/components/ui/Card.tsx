'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  glowColor?: 'blue' | 'purple' | 'cyan' | 'none';
}

const variantStyles = {
  default: 'bg-bg-secondary',
  elevated: 'bg-bg-secondary shadow-lg shadow-black/20',
  bordered: 'bg-bg-secondary/50 border border-border-subtle',
  glass: 'glass-card',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const glowStyles = {
  blue: 'hover:shadow-glow-blue',
  purple: 'hover:shadow-glow-purple',
  cyan: 'hover:shadow-glow-cyan',
  none: '',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      glowColor = 'none',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-500',
          variantStyles[variant],
          paddingStyles[padding],
          glowStyles[glowColor],
          hoverable && 'hover:bg-bg-tertiary hover:border-border-accent hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mb-4', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('text-text-secondary', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('mt-4 pt-4 border-t border-border-subtle', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export default Card;
