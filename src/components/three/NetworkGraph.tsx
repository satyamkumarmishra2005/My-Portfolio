'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { DataNode } from './DataNode';
import { CurvedConnectionLine } from './ConnectionLine';
import type { NodeData } from '@/types';
import { PerformanceConfig, QUALITY_PRESETS } from '@/lib/performance';

// Network node configuration
const NETWORK_NODES: NodeData[] = [
  { id: 'api-gateway', position: [0, 1.5, 0], connections: ['auth', 'users', 'data'], label: 'API Gateway' },
  { id: 'auth', position: [-2, 0.5, 0.5], connections: ['users', 'cache'], label: 'Auth Service' },
  { id: 'users', position: [2, 0.5, -0.5], connections: ['db', 'cache'], label: 'User Service' },
  { id: 'data', position: [0, 0, 1], connections: ['db', 'queue'], label: 'Data Service' },
  { id: 'db', position: [-1, -1.5, 0], connections: ['cache'], label: 'Database' },
  { id: 'cache', position: [1, -1, 0.5], connections: [], label: 'Cache' },
  { id: 'queue', position: [2, -1.5, -0.5], connections: ['workers'], label: 'Message Queue' },
  { id: 'workers', position: [0, -2, 0], connections: [], label: 'Workers' },
];

// Color palette for nodes
const NODE_COLORS = [
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#06b6d4', // cyan
];

export interface NetworkGraphProps {
  scrollProgress?: number;
  enableInteraction?: boolean;
  /** Performance configuration for LOD and conditional rendering */
  performanceConfig?: PerformanceConfig;
}

/**
 * Internal component that handles mouse tracking within the Canvas
 */
function NetworkGraphContent({ 
  scrollProgress = 0,
  enableInteraction = true,
  performanceConfig = QUALITY_PRESETS.medium,
}: NetworkGraphProps): JSX.Element {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  // Limit nodes based on performance config
  const visibleNodes = useMemo(() => {
    return NETWORK_NODES.slice(0, performanceConfig.maxNodes);
  }, [performanceConfig.maxNodes]);

  // Handle mouse movement for cursor reactivity
  const handlePointerMove = useCallback((event: THREE.Event & { clientX?: number; clientY?: number }) => {
    if (!enableInteraction) return;
    
    // Get normalized mouse position (-1 to 1)
    const x = ((event.clientX ?? 0) / size.width) * 2 - 1;
    const y = -((event.clientY ?? 0) / size.height) * 2 + 1;
    
    mouseRef.current = { x, y };
  }, [enableInteraction, size]);

  // Generate connections between visible nodes only
  const connections = useMemo(() => {
    const conns: Array<{ start: [number, number, number]; end: [number, number, number]; key: string }> = [];
    const visibleIds = new Set(visibleNodes.map(n => n.id));
    
    visibleNodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        // Only create connection if target is also visible
        if (!visibleIds.has(targetId)) return;
        
        const targetNode = visibleNodes.find((n) => n.id === targetId);
        if (targetNode) {
          conns.push({
            start: node.position,
            end: targetNode.position,
            key: `${node.id}-${targetId}`,
          });
        }
      });
    });
    
    return conns;
  }, [visibleNodes]);

  // Animate the graph based on scroll and cursor position
  // Respects performance settings for animation
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Calculate target rotation based on mouse position
    if (enableInteraction) {
      targetRotation.current.x = mouseRef.current.y * 0.15;
      targetRotation.current.y = mouseRef.current.x * 0.2;
    }

    // Add scroll-based rotation
    const scrollRotation = scrollProgress * Math.PI * 0.25;
    
    // Smooth interpolation for rotation
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x + scrollRotation * 0.3,
      delta * 2
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y + (performanceConfig.enableAnimations ? state.clock.getElapsedTime() * 0.05 : 0),
      delta * 2
    );

    // Subtle floating animation (only if animations enabled)
    if (performanceConfig.enableAnimations) {
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  // Calculate curve segments based on quality
  const curveSegments = useMemo(() => {
    switch (performanceConfig.quality) {
      case 'high': return 20;
      case 'medium': return 12;
      case 'low': return 8;
      default: return 12;
    }
  }, [performanceConfig.quality]);

  return (
    <group 
      ref={groupRef} 
      onPointerMove={handlePointerMove}
    >
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.3} />
      
      {/* Point light for depth - reduced for low quality */}
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#3b82f6" />
      {performanceConfig.quality !== 'low' && (
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#8b5cf6" />
      )}

      {/* Render connection lines */}
      {connections.map((conn, index) => (
        <CurvedConnectionLine
          key={conn.key}
          start={conn.start}
          end={conn.end}
          color={NODE_COLORS[index % NODE_COLORS.length]}
          opacity={0.3}
          animated={performanceConfig.enableAnimations}
          animationSpeed={0.5 + (index % 3) * 0.3}
          curvature={0.3 + (index % 2) * 0.2}
          curveSegments={curveSegments}
        />
      ))}

      {/* Render nodes with LOD settings */}
      {visibleNodes.map((node, index) => (
        <DataNode
          key={node.id}
          position={node.position}
          color={NODE_COLORS[index % NODE_COLORS.length]}
          size={0.12 + (index === 0 ? 0.05 : 0)}
          pulseSpeed={0.8 + (index % 3) * 0.2}
          glowIntensity={0.4 + (index % 2) * 0.2}
          geometryDetail={performanceConfig.geometryDetail}
          enableGlow={performanceConfig.enableGlow}
          enableAnimations={performanceConfig.enableAnimations}
        />
      ))}
    </group>
  );
}

/**
 * NetworkGraph scene component
 * Composes nodes and connections into network visualization
 * Implements scroll/cursor reactivity with LOD and conditional rendering
 * Requirements: 1.3, 1.4, 9.2, 9.3
 */
export function NetworkGraph(props: NetworkGraphProps): JSX.Element {
  return <NetworkGraphContent {...props} />;
}

export { NETWORK_NODES, NODE_COLORS };
export default NetworkGraph;
