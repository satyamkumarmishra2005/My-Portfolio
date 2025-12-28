'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Network node configuration
const NETWORK_NODES = [
  { id: 'api-gateway', position: [0, 1.5, 0] as [number, number, number], connections: ['auth', 'users', 'data'] },
  { id: 'auth', position: [-2, 0.5, 0.5] as [number, number, number], connections: ['users', 'cache'] },
  { id: 'users', position: [2, 0.5, -0.5] as [number, number, number], connections: ['db', 'cache'] },
  { id: 'data', position: [0, 0, 1] as [number, number, number], connections: ['db', 'queue'] },
  { id: 'db', position: [-1, -1.5, 0] as [number, number, number], connections: ['cache'] },
  { id: 'cache', position: [1, -1, 0.5] as [number, number, number], connections: [] },
  { id: 'queue', position: [2, -1.5, -0.5] as [number, number, number], connections: ['workers'] },
  { id: 'workers', position: [0, -2, 0] as [number, number, number], connections: [] },
];

const NODE_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#3b82f6', '#06b6d4', '#8b5cf6', '#3b82f6', '#06b6d4'];

interface NodeProps {
  position: [number, number, number];
  color: string;
  size?: number;
}

function Node({ position, color, size = 0.12 }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const pulse = 1 + Math.sin(time * 0.8) * 0.1;
    meshRef.current.scale.setScalar(pulse);
    
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1.5 + Math.sin(time * 0.8 + Math.PI) * 0.2);
    }
  });

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 2, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}

function Connection({ start, end, color }: ConnectionProps) {
  const lineRef = useRef<THREE.Line>(null);

  const { geometry, material } = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midpoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    
    const direction = new THREE.Vector3().subVectors(endVec, startVec);
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, direction.z * 0.5)
      .normalize()
      .multiplyScalar(direction.length() * 0.15);
    midpoint.add(perpendicular);

    const curve = new THREE.QuadraticBezierCurve3(startVec, midpoint, endVec);
    const points = curve.getPoints(12);
    
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.3,
    });

    return { geometry: geo, material: mat };
  }, [start, end, color]);

  return <primitive object={new THREE.Line(geometry, material)} ref={lineRef} />;
}

export interface SimpleNetworkGraphProps {
  scrollProgress?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SimpleNetworkGraph({ scrollProgress: _scrollProgress = 0 }: SimpleNetworkGraphProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Generate connections
  const connections = useMemo(() => {
    const conns: Array<{ start: [number, number, number]; end: [number, number, number]; key: string; color: string }> = [];
    
    NETWORK_NODES.forEach((node, index) => {
      node.connections.forEach((targetId) => {
        const targetNode = NETWORK_NODES.find((n) => n.id === targetId);
        if (targetNode) {
          conns.push({
            start: node.position,
            end: targetNode.position,
            key: `${node.id}-${targetId}`,
            color: NODE_COLORS[index % NODE_COLORS.length],
          });
        }
      });
    });
    
    return conns;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Slow rotation
    groupRef.current.rotation.y += delta * 0.05;
    
    // Subtle floating
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#3b82f6" />
      
      {connections.map((conn) => (
        <Connection
          key={conn.key}
          start={conn.start}
          end={conn.end}
          color={conn.color}
        />
      ))}
      
      {NETWORK_NODES.map((node, index) => (
        <Node
          key={node.id}
          position={node.position}
          color={NODE_COLORS[index % NODE_COLORS.length]}
          size={index === 0 ? 0.17 : 0.12}
        />
      ))}
    </group>
  );
}

export default SimpleNetworkGraph;
