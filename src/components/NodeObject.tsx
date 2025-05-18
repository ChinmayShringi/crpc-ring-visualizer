
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

  // Shortened address for display
  const shortAddress = `${node.address.substring(0, 6)}...${node.address.substring(node.address.length - 4)}`;
  const color = getNodeColor();

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 32, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Replace Text component with HTML overlay instead */}
      <sprite position={[0, radius + 0.3, 0]} scale={[1, 0.3, 1]}>
        <spriteMaterial transparent={true} opacity={0}>
          <canvasTexture attach="map" />
        </spriteMaterial>
      </sprite>
      <sprite position={[0, radius + 0.6, 0]} scale={[1, 0.3, 1]}>
        <spriteMaterial transparent={true} opacity={0}>
          <canvasTexture attach="map" />
        </spriteMaterial>
      </sprite>
    </group>
  );
};

export default NodeObject;
