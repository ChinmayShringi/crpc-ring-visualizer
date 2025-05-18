
export type NodeStatus = 'Pending' | 'Committed' | 'Revealed' | 'Validated' | 'Disputed';

export type NodeData = {
  id: string;
  address: string;
  status: NodeStatus;
  value?: number;
  salt?: string;
  commitment?: string;
};

export type EdgeData = {
  source: string;
  target: string;
  delta?: number;
  commitment?: string;
};

export type SimulationPhase = 
  | 'CommitWork'
  | 'RevealWork'
  | 'ComputeDelta'
  | 'CommitDelta'
  | 'RevealDelta'
  | 'Verification';

export interface PhaseInfo {
  title: string;
  description: string;
}

export interface SimulationState {
  phase: SimulationPhase;
  nodes: NodeData[];
  edges: EdgeData[];
  isRunning: boolean;
  isPaused: boolean;
}
