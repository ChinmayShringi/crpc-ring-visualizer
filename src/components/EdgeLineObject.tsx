
import React from 'react';
import { Line } from '@react-three/drei';
import { EdgeData } from '@/lib/types';
import * as THREE from 'three';

interface EdgeLineProps {
  edge: EdgeData;
  nodePositions: { [key: string]: [number, number, number] };
}

const EdgeLineObject: React.FC<EdgeLineProps> = ({ edge, nodePositions }) => {
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

export default EdgeLineObject;
