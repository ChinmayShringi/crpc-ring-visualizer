
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import { NodeData, EdgeData } from '@/lib/types';
import * as THREE from 'three';

interface NodeProps {
  node: NodeData;
  position: [number, number, number];
  radius: number;
}

const Node: React.FC<NodeProps> = ({ node, position, radius }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Animation for the node glow effect
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

interface EdgeLineProps {
  edge: EdgeData;
  nodePositions: { [key: string]: [number, number, number] };
}

const EdgeLine: React.FC<EdgeLineProps> = ({ edge, nodePositions }) => {
  const sourcePos = nodePositions[edge.source];
  const targetPos = nodePositions[edge.target];
  
  if (!sourcePos || !targetPos) return null;
  
  // Calculate points for the curved line
  const midPoint = new THREE.Vector3(
    (sourcePos[0] + targetPos[0]) / 2,
    (sourcePos[1] + targetPos[1]) / 2,
    (sourcePos[2] + targetPos[2]) / 2
  );
  
  // Push the midpoint outward a bit to create a curve
  midPoint.normalize().multiplyScalar(1.1 * Math.sqrt(
    sourcePos[0] * sourcePos[0] + sourcePos[1] * sourcePos[1] + sourcePos[2] * sourcePos[2]
  ));
  
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(...sourcePos),
    new THREE.Vector3(midPoint.x, midPoint.y, midPoint.z),
    new THREE.Vector3(...targetPos)
  );
  
  const points = curve.getPoints(10);
  
  // Determine line color and thickness based on delta value
  const getLineColor = () => {
    if (!edge.delta) return "#3a4a64";
    return edge.delta > 0 ? "#00ffe5" : "#ff4242";
  };
  
  const getLineWidth = () => {
    if (!edge.delta) return 1;
    return Math.min(Math.max(Math.abs(edge.delta) / 10, 1), 5);
  };
  
  return (
    <Line
      points={points}
      color={getLineColor()}
      lineWidth={getLineWidth()}
      dashed={!edge.delta}
    />
  );
};

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
        
        {/* Ring visualization */}
        <group>
          {nodes.map((node) => (
            <Node 
              key={node.id} 
              node={node} 
              position={nodePositions[node.id]} 
              radius={0.5}
            />
          ))}
          
          {edges.map((edge) => (
            <EdgeLine 
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
