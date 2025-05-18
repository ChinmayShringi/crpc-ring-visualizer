
import React from 'react';
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
  const sourcePosVector = new THREE.Vector3(...sourcePos);
  const targetPosVector = new THREE.Vector3(...targetPos);
  
  // Calculate the midpoint
  const midPoint = new THREE.Vector3(
    (sourcePos[0] + targetPos[0]) / 2,
    (sourcePos[1] + targetPos[1]) / 2,
    (sourcePos[2] + targetPos[2]) / 2
  );
  
  // Push the midpoint outward a bit to create a curve
  const midPointDistance = Math.sqrt(
    midPoint.x * midPoint.x + 
    midPoint.y * midPoint.y + 
    midPoint.z * midPoint.z
  );
  
  if (midPointDistance > 0) {
    midPoint.normalize().multiplyScalar(1.1 * midPointDistance);
  }
  
  // Create points for a simple curve
  const curve = new THREE.QuadraticBezierCurve3(
    sourcePosVector,
    midPoint,
    targetPosVector
  );
  
  const points = curve.getPoints(10);
  
  // Determine line color based on delta value
  const lineColor = edge.delta ? 
    (edge.delta > 0 ? "#00ffe5" : "#ff4242") : 
    "#3a4a64";
  
  // Determine line width based on delta value
  const lineWidth = edge.delta ? 
    Math.min(Math.max(Math.abs(edge.delta) / 10, 1), 5) : 
    1;
  
  // This is a more direct approach without hooks
  const positions = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));

  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial 
        attach="material" 
        color={lineColor} 
        linewidth={lineWidth}
      />
    </line>
  );
};

export default EdgeLineObject;
