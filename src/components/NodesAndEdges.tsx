
import React from 'react';
import { NodeData, EdgeData } from '@/lib/types';
import NodeObject from './NodeObject';
import EdgeLineObject from './EdgeLineObject';

interface NodesAndEdgesProps {
  nodes: NodeData[];
  edges: EdgeData[];
  nodePositions: { [key: string]: [number, number, number] };
  hoveredNodeId: string | null;
  onNodeHover: (nodeId: string | null) => void;
}

const NodesAndEdges: React.FC<NodesAndEdgesProps> = ({ 
  nodes, 
  edges, 
  nodePositions,
  hoveredNodeId,
  onNodeHover
}) => {
  return (
    <group>
      {edges.map((edge) => (
        <EdgeLineObject 
          key={`${edge.source}-${edge.target}`} 
          edge={edge} 
          nodePositions={nodePositions} 
          hoveredNodeId={hoveredNodeId}
        />
      ))}
      
      {nodes.map((node) => (
        <NodeObject 
          key={node.id} 
          node={node} 
          position={nodePositions[node.id]} 
          radius={0.5}
          isHovered={hoveredNodeId === node.id}
          onHover={onNodeHover}
        />
      ))}
    </group>
  );
};

export default NodesAndEdges;
