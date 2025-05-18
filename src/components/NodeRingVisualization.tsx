
import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NodeData, EdgeData } from '@/lib/types';
import NodesAndEdges from './NodesAndEdges';
import * as THREE from 'three';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add HTML labels in an overlay
  const renderNodeLabels = () => {
    return nodes.map((node) => {
      const pos = nodePositions[node.id];
      if (!pos) return null;
      
      // Calculate 2D screen position (this is an approximation)
      const vector = new THREE.Vector3(pos[0], pos[1] + 0.7, pos[2]);
      // We'll position these absolutely later with CSS
      const shortAddress = `${node.address.substring(0, 6)}...${node.address.substring(node.address.length - 4)}`;
      
      return (
        <div key={`label-${node.id}`} className="absolute pointer-events-none" style={{
          left: `calc(50% + ${pos[0] * 50}px)`,
          top: `calc(50% - ${pos[2] * 50 - 100}px)`,
          transform: 'translate(-50%, -100%)',
          color: '#ffffff',
          textAlign: 'center',
          fontSize: '10px',
          zIndex: 10,
          textShadow: '0 0 3px #000',
        }}>
          <div>{shortAddress}</div>
          <div style={{ color: '#00ffe5' }}>{node.status}</div>
        </div>
      );
    });
  };
  
  return (
    <div className="w-full h-full relative">
      {/* Add 2D HTML labels above the 3D scene */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {renderNodeLabels()}
      </div>
      
      <Canvas
        camera={{ position: [0, 4, 6], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        <NodesAndEdges nodes={nodes} edges={edges} nodePositions={nodePositions} />
        
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
