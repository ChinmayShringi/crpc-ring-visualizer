import React, { useState, useEffect } from 'react';
import { SimulationPhase, SimulationState, NodeData, EdgeData } from '@/lib/types';
import { initialSimulationState, generateHexString } from '@/lib/mockData';
import NodeRingVisualization from './NodeRingVisualization';
import SimulationStepper from './SimulationStepper';
import PhaseDetailsTable from './PhaseDetailsTable';
import SimulationControls from './SimulationControls';
import InputModeToggle from './InputModeToggle';

const SimulationContainer: React.FC = () => {
  const [state, setState] = useState<SimulationState>(initialSimulationState(6));
  const [autoplayInterval, setAutoplayInterval] = useState<number | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [useRandomValues, setUseRandomValues] = useState(true);
  const [nodeValues, setNodeValues] = useState<Record<string, number>>({});

  // Initialize node values if needed
  useEffect(() => {
    if (!useRandomValues && Object.keys(nodeValues).length === 0) {
      const initialValues: Record<string, number> = {};
      state.nodes.forEach(node => {
        initialValues[node.id] = 0;
      });
      setNodeValues(initialValues);
    }
  }, [useRandomValues, state.nodes]);

  // Effect to handle the simulation phases
  useEffect(() => {
    if (state.isRunning && !state.isPaused) {
      const interval = window.setInterval(() => {
        advancePhase();
      }, 3000);
      
      setAutoplayInterval(interval);
      
      return () => {
        if (interval) window.clearInterval(interval);
      };
    } else if (autoplayInterval) {
      window.clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
  }, [state.isRunning, state.isPaused]);

  // Handle node value change
  const handleNodeValueChange = (nodeId: string, value: number) => {
    setNodeValues(prev => ({
      ...prev,
      [nodeId]: value
    }));
  };

  // Toggle between random and specified values
  const toggleRandomValues = () => {
    setUseRandomValues(prev => !prev);
  };

  // Logic for each phase of the simulation
  const processPhase = (phase: SimulationPhase): { nodes: NodeData[], edges: EdgeData[] } => {
    const { nodes, edges } = state;
    
    switch (phase) {
      case 'CommitWork': {
        // Generate values based on mode (random or specified)
        const updatedNodes = nodes.map(node => {
          const value = useRandomValues 
            ? Math.floor(Math.random() * 100) 
            : (nodeValues[node.id] || 0);
          
          return {
            ...node,
            status: 'Committed' as const,
            value: value,
            salt: generateHexString(8),
            commitment: generateHexString(16),
          };
        });
        
        return { nodes: updatedNodes, edges };
      }
      
      case 'RevealWork': {
        // Reveal the values and update status
        const updatedNodes = nodes.map(node => ({
          ...node,
          status: 'Revealed' as const,
        }));
        
        return { nodes: updatedNodes, edges };
      }
      
      case 'ComputeDelta': {
        // Calculate deltas between nodes
        const updatedEdges = edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if (sourceNode?.value !== undefined && targetNode?.value !== undefined) {
            return {
              ...edge,
              delta: targetNode.value - sourceNode.value,
            };
          }
          
          return edge;
        });
        
        return { nodes, edges: updatedEdges };
      }
      
      case 'CommitDelta': {
        // Commit to the delta values
        const updatedEdges = edges.map(edge => ({
          ...edge,
          commitment: generateHexString(16),
        }));
        
        return { nodes, edges: updatedEdges };
      }
      
      case 'RevealDelta': {
        // Reveal the deltas - in a real system, would verify here
        return { nodes, edges };
      }
      
      case 'Verification': {
        // Verify the entire process and update node statuses
        // For this demo, randomly mark some nodes as disputed or validated
        const updatedNodes = nodes.map(node => ({
          ...node,
          status: Math.random() > 0.2 ? 'Validated' as const : 'Disputed' as const,
        }));
        
        return { nodes: updatedNodes, edges };
      }
      
      default:
        return { nodes, edges };
    }
  };

  // Advance to the next phase
  const advancePhase = () => {
    const phases: SimulationPhase[] = [
      'CommitWork', 
      'RevealWork', 
      'ComputeDelta', 
      'CommitDelta', 
      'RevealDelta', 
      'Verification'
    ];
    
    const currentIndex = phases.indexOf(state.phase);
    
    // If we're at the last phase, stop the simulation
    if (currentIndex === phases.length - 1) {
      setState(prev => ({ ...prev, isRunning: false }));
      return;
    }
    
    const nextPhase = phases[currentIndex + 1];
    const { nodes, edges } = processPhase(nextPhase);
    
    setState(prev => ({
      ...prev,
      phase: nextPhase,
      nodes,
      edges,
    }));
  };

  // Handle manual phase change
  const handlePhaseChange = (phase: SimulationPhase) => {
    // Stop any running simulation
    if (autoplayInterval) {
      window.clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
    
    const { nodes, edges } = processPhase(phase);
    
    setState(prev => ({
      ...prev,
      phase,
      nodes,
      edges,
      isRunning: false,
      isPaused: false,
    }));
  };

  // Play/pause the simulation
  const handlePlayPause = () => {
    if (state.isRunning) {
      // If already running, toggle pause
      setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    } else {
      // Start running from current phase
      setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    }
  };

  // Step forward one phase
  const handleStepForward = () => {
    advancePhase();
  };

  // Reset the simulation
  const handleReset = () => {
    if (autoplayInterval) {
      window.clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
    
    setState(initialSimulationState(6));
    setHoveredNodeId(null);
  };
  
  // Handle node hover in visualization or table
  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left panel: 3D Node Ring */}
      <div className="w-full md:w-1/2 min-h-[400px] md:min-h-screen relative">
        <div className="absolute inset-0">
          <NodeRingVisualization 
            nodes={state.nodes} 
            edges={state.edges}
            hoveredNodeId={hoveredNodeId}
            onNodeHover={handleNodeHover}
          />
        </div>
        <div className="absolute bottom-4 left-4 right-4 glass-card p-4 rounded-lg max-w-sm opacity-75 hover:opacity-100 transition-opacity">
          <h3 className="text-sm font-semibold text-crpc-teal mb-1">
            CRPC Protocol Visualization
          </h3>
          <p className="text-xs text-slate-300">
            Interactive 3D visualization of nodes in a ring topology. 
            Hover over nodes to see details, drag to rotate.
          </p>
        </div>
      </div>
      
      {/* Right panel: Controls and Tables */}
      <div className="w-full md:w-1/2 p-6 overflow-y-auto">
        <div className="glass-card p-6 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-1 text-crpc-blue">
            CRPC Protocol Simulator
          </h1>
          <p className="text-slate-300 mb-6">
            Step through each phase of the Commit-Reveal Protocol with Consistency (CRPC) 
            to understand how it ensures data integrity across multiple nodes.
          </p>
          
          {/* Input Mode Toggle - only show before commit work phase */}
          {state.phase === 'CommitWork' && (
            <InputModeToggle 
              useRandomValues={useRandomValues}
              onToggleRandomValues={toggleRandomValues}
              nodes={state.nodes}
              nodeValues={nodeValues}
              onNodeValueChange={handleNodeValueChange}
            />
          )}
          
          <SimulationStepper 
            currentPhase={state.phase}
            onPhaseChange={handlePhaseChange}
          />
          
          <SimulationControls 
            isRunning={state.isRunning}
            isPaused={state.isPaused}
            onPlayPause={handlePlayPause}
            onStepForward={handleStepForward}
            onReset={handleReset}
          />
        </div>
        
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-crpc-teal">
            Node Status Details
          </h2>
          <PhaseDetailsTable 
            nodes={state.nodes}
            hoveredNodeId={hoveredNodeId}
            onRowHover={handleNodeHover}
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationContainer;
