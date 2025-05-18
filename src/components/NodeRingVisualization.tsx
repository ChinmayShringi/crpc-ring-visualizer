
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NodeData, EdgeData } from '@/lib/types';
import NodeObject from './NodeObject';
import EdgeLineObject from './EdgeLineObject';

interface NodeRingVisualizationProps {
  nodes: NodeData[];
  edges: EdgeData[];
}

const NodeRingVisualization: React.FC<NodeRingVisualizationProps> = ({ nodes, edges }) => {
  // Calculate positions for nodes in a ring
  const calculateNodePositions = () => {
    const positions: { [key: string]: [number, number, number] } = {};
    const radius = 3;
    
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      positions[node.id] = [
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle)
      ];
    });
    
    return positions;
  };
  
  const nodePositions = calculateNodePositions();
  
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 4, 6], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        {/* Ring visualization - moved node and edge components inside Canvas */}
        <group>
          {nodes.map((node) => (
            <NodeObject 
              key={node.id} 
              node={node} 
              position={nodePositions[node.id]} 
              radius={0.5}
            />
          ))}
          
          {edges.map((edge) => (
            <EdgeLineObject 
              key={`${edge.source}-${edge.target}`} 
              edge={edge} 
              nodePositions={nodePositions} 
            />
          ))}
        </group>
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        <gridHelper args={[20, 20, '#1a2035', '#1a2035']} />
      </Canvas>
    </div>
  );
};

export default NodeRingVisualization;
