// Responsive breakpoint detection hook
import { useState, useEffect } from 'react';
import { Breakpoint, getBreakpoint } from '@/lib/responsive';

/**
 * Breakpoint constants matching design document
 * - mobile: <768px
 * - tablet: 768-1024px
 * - desktop: >1024px
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/**
 * Custom hook for responsive breakpoint detection
 * Matches the design document breakpoints:
 * - mobile: <768px
 * - tablet: 768-1024px
 * - desktop: >1024px
 * 
 * @param query - CSS media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// Predefined breakpoint hooks for convenience
export function useIsMobile(): boolean {
  return !useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
}

export function useIsTablet(): boolean {
  const isMinTablet = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const isMaxTablet = !useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  return isMinTablet && isMaxTablet;
}

export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
}

/**
 * Hook to get current breakpoint name
 * @returns Current breakpoint: 'mobile' | 'tablet' | 'desktop'
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateBreakpoint = () => {
      setBreakpoint(getBreakpoint(window.innerWidth));
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Get responsive CSS class based on current breakpoint
 * Useful for applying different classes at different breakpoints
 */
export function getResponsiveClass(
  mobileClass: string,
  tabletClass?: string,
  desktopClass?: string
): string {
  const classes = [mobileClass];
  
  if (tabletClass) {
    classes.push(`md:${tabletClass}`);
  }
  
  if (desktopClass) {
    classes.push(`lg:${desktopClass}`);
  }
  
  return classes.join(' ');
}

export default useMediaQuery;
