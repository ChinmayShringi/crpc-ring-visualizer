
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { NodeData, EdgeData } from '@/lib/types';
import NodesAndEdges from './NodesAndEdges';

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
        onCreated={({ gl, scene, camera }) => {
          gl.setPixelRatio(window.devicePixelRatio);
          
          // Simple animation function that doesn't rely on hooks
          let animationId: number;
          
          const animate = () => {
            animationId = requestAnimationFrame(animate);
            // Animation code here if needed
            gl.render(scene, camera);
          };
          
          animate();
          
          // Clean up animation when component unmounts
          return () => {
            cancelAnimationFrame(animationId);
          };
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        {/* Use the NodesAndEdges component */}
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
