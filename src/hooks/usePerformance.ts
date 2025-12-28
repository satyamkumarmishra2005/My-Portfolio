/**
 * Performance hook for 3D rendering optimization
 * Requirements: 9.2, 9.3
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  QualityLevel,
  PerformanceConfig,
  detectDeviceCapability,
  getPerformanceConfig,
} from '@/lib/performance';

export interface UsePerformanceReturn {
  quality: QualityLevel;
  config: PerformanceConfig;
  setQuality: (quality: QualityLevel) => void;
  isLowPerformance: boolean;
}

/**
 * Hook to manage performance settings for 3D rendering
 * Automatically detects device capability and provides config
 */
export function usePerformance(): UsePerformanceReturn {
  const [quality, setQualityState] = useState<QualityLevel>('medium');
  const [config, setConfig] = useState<PerformanceConfig>(
    getPerformanceConfig('medium')
  );

  // Detect device capability on mount
  useEffect(() => {
    const detectedQuality = detectDeviceCapability();
    setQualityState(detectedQuality);
    setConfig(getPerformanceConfig(detectedQuality));
  }, []);

  // Update config when quality changes
  const setQuality = useCallback((newQuality: QualityLevel) => {
    setQualityState(newQuality);
    setConfig(getPerformanceConfig(newQuality));
  }, []);

  return {
    quality,
    config,
    setQuality,
    isLowPerformance: quality === 'low',
  };
}

/**
 * Hook to track FPS and adjust quality dynamically
 */
export function useAdaptiveQuality(
  initialQuality: QualityLevel = 'medium'
): UsePerformanceReturn & { fps: number } {
  const [fps, setFps] = useState(60);
  const [quality, setQualityState] = useState<QualityLevel>(initialQuality);
  const [config, setConfig] = useState<PerformanceConfig>(
    getPerformanceConfig(initialQuality)
  );

  // FPS monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        setFps(frameCount);
        
        // Adaptive quality adjustment
        if (frameCount < 20 && quality !== 'low') {
          setQualityState('low');
          setConfig(getPerformanceConfig('low'));
        } else if (frameCount < 30 && quality === 'high') {
          setQualityState('medium');
          setConfig(getPerformanceConfig('medium'));
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);
    
    return () => cancelAnimationFrame(animationId);
  }, [quality]);

  const setQuality = useCallback((newQuality: QualityLevel) => {
    setQualityState(newQuality);
    setConfig(getPerformanceConfig(newQuality));
  }, []);

  return {
    quality,
    config,
    setQuality,
    isLowPerformance: quality === 'low',
    fps,
  };
}

export default usePerformance;
