'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent-blue text-white hover:bg-accent-blue/90 focus:ring-accent-blue/50 shadow-glow-blue/50',
  secondary: 'bg-bg-tertiary text-text-primary hover:bg-bg-secondary focus:ring-accent-purple/50',
  outline: 'bg-transparent border border-border-accent text-accent-blue hover:bg-accent-blue/10 focus:ring-accent-blue/50',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
  gradient: 'bg-gradient-primary text-white hover:opacity-90 shadow-lg shadow-accent-purple/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-sm min-h-[44px]',
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[48px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:scale-[1.02] active:scale-[0.98]',
          'touch-manipulation',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" aria-hidden="true" />
        ) : leftIcon ? (
          <span aria-hidden="true">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
