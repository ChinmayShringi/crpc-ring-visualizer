
import React from 'react';
import { NodeData } from '@/lib/types';
import * as THREE from 'three';

interface NodeProps {
  node: NodeData;
  position: [number, number, number];
  radius: number;
}

const NodeObject: React.FC<NodeProps> = ({ node, position, radius }) => {
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

  const color = getNodeColor();

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* No text components that might use hooks */}
    </group>
  );
};

export default NodeObject;
