'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { calculateLOD } from '@/lib/performance';

export interface DataNodeProps {
  position: [number, number, number];
  color?: string;
  size?: number;
  pulseSpeed?: number;
  glowIntensity?: number;
  /** Geometry detail level (segments) - higher = more detailed */
  geometryDetail?: number;
  /** Enable glow effect - can be disabled for performance */
  enableGlow?: boolean;
  /** Enable animations - can be disabled for performance */
  enableAnimations?: boolean;
}

/**
 * DataNode component - Glowing node mesh with subtle animation
 * Represents a service/node in the network visualization
 * Supports LOD (Level of Detail) for performance optimization
 * Requirements: 1.3, 9.2, 9.3
 */
export function DataNode({
  position,
  color = '#3b82f6',
  size = 0.15,
  pulseSpeed = 1,
  glowIntensity = 0.5,
  geometryDetail = 16,
  enableGlow = true,
  enableAnimations = true,
}: DataNodeProps): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Calculate LOD based on distance from camera
  const lodDetail = useMemo(() => {
    const posVec = new THREE.Vector3(...position);
    const distance = posVec.distanceTo(camera.position);
    return calculateLOD(distance, geometryDetail, 6);
  }, [position, camera.position, geometryDetail]);

  // Create materials with useMemo to avoid recreation
  const materials = useMemo(() => {
    const coreColor = new THREE.Color(color);
    
    return {
      core: new THREE.MeshBasicMaterial({
        color: coreColor,
        transparent: true,
        opacity: 0.9,
      }),
      glow: enableGlow
        ? new THREE.MeshBasicMaterial({
            color: coreColor,
            transparent: true,
            opacity: glowIntensity * 0.3,
          })
        : null,
    };
  }, [color, glowIntensity, enableGlow]);

  // Animate the node with subtle pulsing effect
  // Only runs if animations are enabled
  useFrame((state) => {
    if (!meshRef.current) return;
    if (!enableAnimations) return;

    const time = state.clock.getElapsedTime();
    
    // Subtle scale pulsing
    const pulse = 1 + Math.sin(time * pulseSpeed) * 0.1;
    meshRef.current.scale.setScalar(pulse);
    
    // Glow pulsing (inverse of core for breathing effect)
    if (glowRef.current && enableGlow) {
      const glowPulse = 1.5 + Math.sin(time * pulseSpeed + Math.PI) * 0.2;
      glowRef.current.scale.setScalar(glowPulse);
      
      // Update glow opacity for breathing effect
      const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
      glowMaterial.opacity = glowIntensity * (0.2 + Math.sin(time * pulseSpeed) * 0.1);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer glow - conditionally rendered for performance */}
      {enableGlow && materials.glow && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[size * 2, lodDetail, lodDetail]} />
          <primitive object={materials.glow} attach="material" />
        </mesh>
      )}
      
      {/* Core node with LOD-based geometry */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, lodDetail, lodDetail]} />
        <primitive object={materials.core} attach="material" />
      </mesh>
    </group>
  );
}

export default DataNode;
