
import React from 'react';
import { NodeData } from '@/lib/types';
import { Html } from '@react-three/drei';

interface NodeProps {
  node: NodeData;
  position: [number, number, number];
  radius: number;
  isHovered: boolean;
  onHover: (nodeId: string | null) => void;
}

const NodeObject: React.FC<NodeProps> = ({ node, position, radius, isHovered, onHover }) => {
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
  
  // Use a slightly larger radius and emission for hover state
  const finalRadius = isHovered ? radius * 1.2 : radius;
  const emissiveIntensity = isHovered ? 1.0 : 0.5;
  
  const shortAddress = `${node.address.substring(0, 6)}...${node.address.substring(node.address.length - 4)}`;

  return (
    <group 
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(node.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      <mesh>
        <sphereGeometry args={[finalRadius, 32, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity} 
        />
      </mesh>
      
      {/* 3D label that moves with the node */}
      <Html position={[0, finalRadius + 0.3, 0]} center distanceFactor={10}>
        <div className="pointer-events-none flex flex-col items-center">
          <div className="px-2 py-1 bg-black/50 text-white text-xs rounded whitespace-nowrap">
            {shortAddress}
          </div>
          <div
            className="mt-1 px-2 py-0.5 text-xs rounded whitespace-nowrap"
            style={{
              backgroundColor: `${color}40`,
              color: color,
              borderRadius: '4px',
            }}
          >
            {node.status}
          </div>
          {node.value !== undefined && (
            <div className="mt-1 px-2 py-0.5 bg-white/30 text-white text-xs rounded whitespace-nowrap">
              Φ = {node.value}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

export default NodeObject;
