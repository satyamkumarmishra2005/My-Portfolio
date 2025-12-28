'use client';

import React, { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';

export interface ThreeCanvasProps {
  children: ReactNode;
  className?: string;
  enableInteraction?: boolean;
}

/**
 * ThreeCanvas - A simple wrapper around R3F Canvas
 * This component must be dynamically imported with ssr: false
 */
export function ThreeCanvas({
  children,
  className = '',
  enableInteraction = true,
}: ThreeCanvasProps): JSX.Element {
  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'default',
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: enableInteraction ? 'auto' : 'none',
      }}
    >
      {children}
    </Canvas>
  );
}

export default ThreeCanvas;
