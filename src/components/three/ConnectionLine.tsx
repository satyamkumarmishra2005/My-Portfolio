'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface ConnectionLineProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  opacity?: number;
  animated?: boolean;
  animationSpeed?: number;
}

/**
 * ConnectionLine component - Animated lines between nodes
 * Represents data flow or service communication in the network
 * Requirements: 1.3, 9.2, 9.3
 */
export function ConnectionLine({
  start,
  end,
  color = '#3b82f6',
  opacity = 0.4,
  animated = true,
  animationSpeed = 1,
}: ConnectionLineProps): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.Line | null>(null);
  const dashOffsetRef = useRef(0);

  // Create line object
  const line = useMemo(() => {
    const points = [
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.LineDashedMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      dashSize: 0.1,
      gapSize: 0.05,
    });

    const lineObj = new THREE.Line(geometry, material);
    lineObj.computeLineDistances();
    
    return lineObj;
  }, [start, end, color, opacity]);

  // Store line reference
  useEffect(() => {
    lineRef.current = line;
  }, [line]);

  // Animate the dash offset for flowing effect
  // Only runs if animations are enabled
  useFrame((state) => {
    if (!lineRef.current || !animated) return;

    const lineMaterial = lineRef.current.material as THREE.LineDashedMaterial & { dashOffset?: number };
    dashOffsetRef.current += state.clock.getDelta() * animationSpeed * 0.5;
    
    if (lineMaterial.dashOffset !== undefined) {
      lineMaterial.dashOffset = -dashOffsetRef.current;
    }
    
    // Subtle opacity pulsing
    const time = state.clock.getElapsedTime();
    lineMaterial.opacity = opacity * (0.7 + Math.sin(time * animationSpeed) * 0.3);
  });

  return (
    <group ref={groupRef}>
      <primitive object={line} />
    </group>
  );
}

/**
 * Creates a curved connection line using quadratic bezier
 * Supports performance optimization through curve segments
 */
export interface CurvedConnectionLineProps extends Omit<ConnectionLineProps, 'start' | 'end'> {
  start: [number, number, number];
  end: [number, number, number];
  curvature?: number;
  /** Number of curve segments - lower = better performance */
  curveSegments?: number;
}

export function CurvedConnectionLine({
  start,
  end,
  curvature = 0.5,
  curveSegments = 20,
  color = '#3b82f6',
  opacity = 0.4,
  animated = true,
  animationSpeed = 1,
}: CurvedConnectionLineProps): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.Line | null>(null);
  const dashOffsetRef = useRef(0);

  // Create curved line object with configurable segments
  const line = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    // Calculate midpoint with offset for curve
    const midpoint = new THREE.Vector3()
      .addVectors(startVec, endVec)
      .multiplyScalar(0.5);
    
    // Add perpendicular offset for curve
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, direction.z * 0.5)
      .normalize()
      .multiplyScalar(direction.length() * curvature * 0.3);
    
    midpoint.add(perpendicular);

    // Create quadratic bezier curve with configurable segments
    const curve = new THREE.QuadraticBezierCurve3(startVec, midpoint, endVec);
    const points = curve.getPoints(curveSegments);
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.LineDashedMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity,
      dashSize: 0.08,
      gapSize: 0.04,
    });

    const lineObj = new THREE.Line(geometry, material);
    lineObj.computeLineDistances();
    
    return lineObj;
  }, [start, end, curvature, curveSegments, color, opacity]);

  // Store line reference
  useEffect(() => {
    lineRef.current = line;
  }, [line]);

  // Animate the dash offset - only if enabled
  useFrame((state) => {
    if (!lineRef.current || !animated) return;

    const lineMaterial = lineRef.current.material as THREE.LineDashedMaterial & { dashOffset?: number };
    dashOffsetRef.current += state.clock.getDelta() * animationSpeed * 0.3;
    
    if (lineMaterial.dashOffset !== undefined) {
      lineMaterial.dashOffset = -dashOffsetRef.current;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={line} />
    </group>
  );
}

export default ConnectionLine;
