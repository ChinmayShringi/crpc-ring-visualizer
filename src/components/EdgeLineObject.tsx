
import React, { useRef } from 'react';
import { EdgeData } from '@/lib/types';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface EdgeLineProps {
  edge: EdgeData;
  nodePositions: { [key: string]: [number, number, number] };
  hoveredNodeId: string | null;
}

const EdgeLineObject: React.FC<EdgeLineProps> = ({ edge, nodePositions, hoveredNodeId }) => {
  const sourcePos = nodePositions[edge.source];
  const targetPos = nodePositions[edge.target];
  const lineRef = useRef<THREE.Line>(null);
  
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

  // Add highlighted effect if source or target node is hovered
  const isHighlighted = hoveredNodeId === edge.source || hoveredNodeId === edge.target;
  const finalLineWidth = isHighlighted ? lineWidth * 1.5 : lineWidth;
  
  // Create geometry and material
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ 
    color: lineColor, 
    linewidth: finalLineWidth
  });
  
  // Determine if we should show the delta value
  const shouldShowDelta = edge.delta !== undefined;
  
  return (
    <group>
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial attach="material" color={lineColor} linewidth={finalLineWidth} />
      </line>
      
      {shouldShowDelta && (
        <Html position={midPoint.toArray()} distanceFactor={10}>
          <div className={`px-1.5 py-0.5 rounded text-xs text-white bg-black/70 whitespace-nowrap ${isHighlighted ? 'font-bold' : ''}`}>
            δ = {edge.delta}
          </div>
        </Html>
      )}
    </group>
  );
};

export default EdgeLineObject;
