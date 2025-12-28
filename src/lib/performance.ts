/**
 * Performance utilities for 3D rendering optimization
 * Requirements: 9.2, 9.3
 */

export type QualityLevel = 'high' | 'medium' | 'low';

export interface PerformanceConfig {
  quality: QualityLevel;
  maxNodes: number;
  geometryDetail: number;
  enableAnimations: boolean;
  enableGlow: boolean;
  targetFPS: number;
}

/**
 * Quality presets for different device capabilities
 */
export const QUALITY_PRESETS: Record<QualityLevel, PerformanceConfig> = {
  high: {
    quality: 'high',
    maxNodes: 8,
    geometryDetail: 16,
    enableAnimations: true,
    enableGlow: true,
    targetFPS: 60,
  },
  medium: {
    quality: 'medium',
    maxNodes: 6,
    geometryDetail: 12,
    enableAnimations: true,
    enableGlow: false,
    targetFPS: 30,
  },
  low: {
    quality: 'low',
    maxNodes: 4,
    geometryDetail: 8,
    enableAnimations: false,
    enableGlow: false,
    targetFPS: 30,
  },
};

/**
 * Detect device performance capability
 * Uses hardware concurrency and device memory as heuristics
 */
export function detectDeviceCapability(): QualityLevel {
  if (typeof window === 'undefined') return 'medium';

  // Check for WebGL support
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return 'low';

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check device memory (if available)
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;

  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  // Determine quality based on device capabilities
  if (isMobile || cores <= 2 || memory < 4) {
    return 'low';
  } else if (cores >= 8 && memory >= 8) {
    return 'high';
  }
  
  return 'medium';
}

/**
 * Get performance configuration based on quality level
 */
export function getPerformanceConfig(quality?: QualityLevel): PerformanceConfig {
  const detectedQuality = quality || detectDeviceCapability();
  return QUALITY_PRESETS[detectedQuality];
}

/**
 * Calculate LOD (Level of Detail) based on distance
 * Returns geometry segments to use
 */
export function calculateLOD(
  distance: number,
  baseDetail: number,
  minDetail: number = 4
): number {
  // Reduce detail as distance increases
  const lodFactor = Math.max(0.25, 1 - distance / 10);
  return Math.max(minDetail, Math.floor(baseDetail * lodFactor));
}

/**
 * Check if element is in viewport for conditional rendering
 */
export function isInViewport(element: HTMLElement | null): boolean {
  if (!element || typeof window === 'undefined') return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

/**
 * Throttle function for performance-sensitive operations
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function for resize/scroll handlers
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
