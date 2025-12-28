// Scroll tracking hook
import { useState, useEffect, useCallback, RefObject } from 'react';

interface ScrollProgress {
  /** Scroll progress from 0 to 1 for the entire page */
  progress: number;
  /** Current scroll position in pixels */
  scrollY: number;
  /** Total scrollable height */
  scrollHeight: number;
  /** Viewport height */
  viewportHeight: number;
  /** Scroll direction: 'up', 'down', or 'none' */
  direction: 'up' | 'down' | 'none';
}

/**
 * Custom hook to track scroll position and progress
 * Used for scroll-triggered animations and 3D scene reactivity
 * 
 * @returns ScrollProgress object with scroll metrics
 */
export function useScrollProgress(): ScrollProgress {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    scrollY: 0,
    scrollHeight: 0,
    viewportHeight: 0,
    direction: 'none',
  });

  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
    const maxScroll = scrollHeight - viewportHeight;
    const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

    setScrollProgress((prev) => ({
      progress,
      scrollY,
      scrollHeight,
      viewportHeight,
      direction: scrollY > prev.scrollY ? 'down' : scrollY < prev.scrollY ? 'up' : prev.direction,
    }));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set initial values
    handleScroll();

    // Add scroll listener with passive option for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return scrollProgress;
}

interface ElementScrollProgress {
  /** Progress of element through viewport (0 = entering, 0.5 = center, 1 = exiting) */
  progress: number;
  /** Whether element is currently visible in viewport */
  isVisible: boolean;
}

/**
 * Custom hook to track scroll progress of a specific element
 * Useful for triggering animations when elements enter/exit viewport
 * 
 * @param ref - React ref to the element to track
 * @param offset - Offset from viewport edges (default: 0)
 * @returns ElementScrollProgress with visibility and progress
 */
export function useElementScrollProgress(
  ref: RefObject<HTMLElement>,
  offset: number = 0
): ElementScrollProgress {
  const [elementProgress, setElementProgress] = useState<ElementScrollProgress>({
    progress: 0,
    isVisible: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;

    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate if element is visible
      const isVisible = rect.top < viewportHeight - offset && rect.bottom > offset;
      
      // Calculate progress through viewport
      // 0 = element just entering from bottom
      // 0.5 = element centered in viewport
      // 1 = element just exiting from top
      const elementCenter = rect.top + rect.height / 2;
      const progress = Math.max(0, Math.min(1, 
        1 - (elementCenter / viewportHeight)
      ));

      setElementProgress({ progress, isVisible });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [ref, offset]);

  return elementProgress;
}

export default useScrollProgress;
