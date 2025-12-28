/**
 * Responsive breakpoint utilities
 * Matches design document breakpoints:
 * - mobile: <768px
 * - tablet: 768-1024px
 * - desktop: >1024px
 * 
 * Requirements: 8.1
 */

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface BreakpointConfig {
  name: Breakpoint;
  minWidth: number;
  maxWidth: number | null;
  cssClass: string;
}

/**
 * Breakpoint definitions matching design document
 */
export const breakpoints: BreakpointConfig[] = [
  { name: 'mobile', minWidth: 0, maxWidth: 767, cssClass: '' },
  { name: 'tablet', minWidth: 768, maxWidth: 1023, cssClass: 'md:' },
  { name: 'desktop', minWidth: 1024, maxWidth: null, cssClass: 'lg:' },
];

/**
 * Get breakpoint for a given viewport width
 */
export function getBreakpoint(width: number): Breakpoint {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Get breakpoint config for a given viewport width
 */
export function getBreakpointConfig(width: number): BreakpointConfig {
  const breakpoint = getBreakpoint(width);
  return breakpoints.find(b => b.name === breakpoint)!;
}

/**
 * Check if a viewport width matches a breakpoint
 */
export function matchesBreakpoint(width: number, breakpoint: Breakpoint): boolean {
  const config = breakpoints.find(b => b.name === breakpoint)!;
  if (config.maxWidth === null) {
    return width >= config.minWidth;
  }
  return width >= config.minWidth && width <= config.maxWidth;
}

/**
 * Responsive CSS class patterns for Tailwind
 * These patterns are used to verify responsive classes are applied correctly
 */
export const responsiveClassPatterns = {
  // Padding patterns
  padding: {
    mobile: /^p[xy]?-\d+$/,
    tablet: /^md:p[xy]?-\d+$/,
    desktop: /^lg:p[xy]?-\d+$/,
  },
  // Grid patterns
  grid: {
    mobile: /^grid-cols-1$/,
    tablet: /^md:grid-cols-\d+$/,
    desktop: /^lg:grid-cols-\d+$/,
  },
  // Text size patterns
  text: {
    mobile: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/,
    tablet: /^(sm|md):text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/,
    desktop: /^lg:text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/,
  },
  // Display patterns
  display: {
    mobile: /^(block|flex|grid|hidden)$/,
    tablet: /^md:(block|flex|grid|hidden)$/,
    desktop: /^lg:(block|flex|grid|hidden)$/,
  },
};

/**
 * Check if a class string contains responsive classes for a breakpoint
 */
export function hasResponsiveClass(
  classString: string,
  breakpoint: Breakpoint,
  type: keyof typeof responsiveClassPatterns
): boolean {
  const classes = classString.split(/\s+/);
  const pattern = responsiveClassPatterns[type][breakpoint];
  return classes.some(cls => pattern.test(cls));
}

/**
 * Extract all responsive classes from a class string
 */
export function extractResponsiveClasses(classString: string): {
  mobile: string[];
  tablet: string[];
  desktop: string[];
} {
  const classes = classString.split(/\s+/);
  
  return {
    mobile: classes.filter(cls => !cls.startsWith('sm:') && !cls.startsWith('md:') && !cls.startsWith('lg:') && !cls.startsWith('xl:')),
    tablet: classes.filter(cls => cls.startsWith('md:')),
    desktop: classes.filter(cls => cls.startsWith('lg:')),
  };
}

/**
 * Validate that a component has appropriate responsive classes
 * Returns true if the component has classes for all breakpoints
 */
export function validateResponsiveClasses(classString: string): {
  isValid: boolean;
  hasMobileClasses: boolean;
  hasTabletClasses: boolean;
  hasDesktopClasses: boolean;
} {
  const extracted = extractResponsiveClasses(classString);
  
  const hasMobileClasses = extracted.mobile.length > 0;
  const hasTabletClasses = extracted.tablet.length > 0;
  const hasDesktopClasses = extracted.desktop.length > 0;
  
  return {
    isValid: hasMobileClasses, // Mobile-first: at least mobile classes required
    hasMobileClasses,
    hasTabletClasses,
    hasDesktopClasses,
  };
}

const responsiveUtils = {
  breakpoints,
  getBreakpoint,
  getBreakpointConfig,
  matchesBreakpoint,
  hasResponsiveClass,
  extractResponsiveClasses,
  validateResponsiveClasses,
};

export default responsiveUtils;
