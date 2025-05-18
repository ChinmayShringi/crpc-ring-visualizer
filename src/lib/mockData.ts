
import { NodeData, EdgeData, SimulationPhase, PhaseInfo } from './types';

// Helper function to generate a random hex string
export const generateHexString = (length: number): string => {
  return '0x' + [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
};

// Generate mock nodes
export const generateMockNodes = (count: number = 6): NodeData[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `node-${index}`,
    address: generateHexString(40),
    status: 'Pending',
    value: null,
    salt: null,
    commitment: null,
  }));
};

// Generate mock edges
export const generateMockEdges = (nodes: NodeData[]): EdgeData[] => {
  return nodes.map((node, index) => {
    const targetIndex = (index + 1) % nodes.length;
    return {
      source: node.id,
      target: nodes[targetIndex].id,
      delta: null,
      commitment: null,
    };
  });
};

// Phase information
export const PHASE_INFO: Record<SimulationPhase, PhaseInfo> = {
  CommitWork: {
    title: 'Phase 1: Commit Work',
    description: 'Each node commits to their work by publishing a hash of their value and salt.'
  },
  RevealWork: {
    title: 'Phase 2: Reveal Work',
    description: 'Nodes reveal their work values and salts, allowing verification of commitments.'
  },
  ComputeDelta: {
    title: 'Phase 3: Compute Delta',
    description: 'Each node computes the delta between their value and the next node\'s value.'
  },
  CommitDelta: {
    title: 'Phase 4: Commit Delta',
    description: 'Nodes commit to their calculated delta values by publishing hashes.'
  },
  RevealDelta: {
    title: 'Phase 5: Reveal Delta',
    description: 'Nodes reveal their delta values and salts for verification.'
  },
  Verification: {
    title: 'Phase 6: Final Verification',
    description: 'The network validates all revealed values and detects any inconsistencies.'
  }
};

// Initial simulation state
export const initialSimulationState = (nodeCount: number = 6) => {
  const nodes = generateMockNodes(nodeCount);
  const edges = generateMockEdges(nodes);
  
  return {
    phase: 'CommitWork' as SimulationPhase,
    nodes,
    edges,
    isRunning: false,
    isPaused: false
  };
};
