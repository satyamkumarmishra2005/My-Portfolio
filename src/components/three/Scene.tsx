'use client';

import React, { Suspense, ReactNode, Component, ErrorInfo, useMemo, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { detectDeviceCapability, getPerformanceConfig, QualityLevel } from '@/lib/performance';

/**
 * Error boundary for 3D components
 * Catches WebGL errors and renders fallback
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ThreeErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Loading fallback for 3D scene
 */
function SceneLoader(): JSX.Element {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg-primary">
      <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

/**
 * Static fallback for mobile devices or when WebGL is unavailable
 * Requirements: 8.2
 */
function MobileFallback(): JSX.Element {
  return (
    <div 
      className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary"
      aria-label="Decorative background"
    >
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--accent-blue) 1px, transparent 1px),
            linear-gradient(to bottom, var(--accent-blue) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />
    </div>
  );
}

export interface SceneProps {
  children: ReactNode;
  className?: string;
  enableInteraction?: boolean;
  /** Override quality level (auto-detected if not provided) */
  quality?: QualityLevel;
}


/**
 * Scene wrapper component for React Three Fiber
 * Sets up Canvas with error boundary and mobile fallback detection
 * Includes performance optimization with adaptive quality
 * Requirements: 1.3, 8.2, 9.2, 9.3
 */
export function Scene({ 
  children, 
  className = '',
  enableInteraction = true,
  quality,
}: SceneProps): JSX.Element {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Canvas, setCanvas] = useState<React.ComponentType<any> | null>(null);

  // Only render Canvas on client side and dynamically import R3F
  useEffect(() => {
    setMounted(true);
    import('@react-three/fiber').then((mod) => {
      setCanvas(() => mod.Canvas);
    }).catch((err) => {
      console.error('Failed to load React Three Fiber:', err);
    });
  }, []);

  // Detect quality level and get performance config
  const performanceConfig = useMemo(() => {
    const detectedQuality = quality || detectDeviceCapability();
    return getPerformanceConfig(detectedQuality);
  }, [quality]);

  // Use mobile fallback for mobile devices or reduced motion preference
  const shouldUseFallback = isMobile || prefersReducedMotion;

  if (shouldUseFallback || !mounted || !Canvas) {
    return <MobileFallback />;
  }

  // Determine DPR based on quality
  const dpr: [number, number] = (() => {
    switch (performanceConfig.quality) {
      case 'high': return [1, 2];
      case 'medium': return [1, 1.5];
      case 'low': return [1, 1];
      default: return [1, 1.5];
    }
  })();

  // Clone children and inject performance config
  const childrenWithConfig = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        performanceConfig,
      } as Record<string, unknown>);
    }
    return child;
  });

  return (
    <ThreeErrorBoundary fallback={<MobileFallback />}>
      <Suspense fallback={<SceneLoader />}>
        <Canvas
          className={className}
          camera={{ position: [0, 0, 5], fov: 75 }}
          dpr={dpr}
          gl={{ 
            antialias: performanceConfig.quality !== 'low',
            alpha: true,
            powerPreference: performanceConfig.quality === 'high' ? 'high-performance' : 'default',
            precision: performanceConfig.quality === 'low' ? 'lowp' : 'highp',
          }}
          frameloop={performanceConfig.quality === 'low' ? 'demand' : 'always'}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: enableInteraction ? 'auto' : 'none',
          }}
        >
          {childrenWithConfig}
        </Canvas>
      </Suspense>
    </ThreeErrorBoundary>
  );
}

export { MobileFallback, ThreeErrorBoundary };
export default Scene;
