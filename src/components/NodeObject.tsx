
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { NodeData } from '@/lib/types';
import * as THREE from 'three';

interface NodeProps {
  node: NodeData;
  position: [number, number, number];
  radius: number;
}

const NodeObject: React.FC<NodeProps> = ({ node, position, radius }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animation for the node glow effect - now safely used within Canvas context
  useFrame(() => {
    if (meshRef.current && node.status !== 'Pending') {
      meshRef.current.scale.x = 1 + Math.sin(Date.now() * 0.001) * 0.05;
      meshRef.current.scale.y = 1 + Math.sin(Date.now() * 0.001) * 0.05;
      meshRef.current.scale.z = 1 + Math.sin(Date.now() * 0.001) * 0.05;
    }
  });

  // Get color based on node status
  const getNodeColor = () => {
    switch (node.status) {
      case 'Committed':
        return '#00a8ff';
      case 'Revealed':
        return '#00ff88';
      case 'Validated':
        return '#a742f5';
      case 'Disputed':
        return '#ff4242';
      default:
        return '#6e7884';
    }
  };

  // Shortened address for display
  const shortAddress = `${node.address.substring(0, 6)}...${node.address.substring(node.address.length - 4)}`;

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 16]} />
        <meshStandardMaterial color={getNodeColor()} emissive={getNodeColor()} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, radius + 0.3, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {shortAddress}
      </Text>
      <Text
        position={[0, radius + 0.6, 0]}
        fontSize={0.15}
        color="#00ffe5"
        anchorX="center"
        anchorY="middle"
      >
        {node.status}
      </Text>
    </group>
  );
};

export default NodeObject;
