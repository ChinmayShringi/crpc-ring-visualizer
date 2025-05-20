# CRPC Protocol Visualization Dashboard

## Project Overview
A 3D visualization dashboard for the CRPC (Commit-Reveal-Proof-Commit) protocol, designed to demonstrate the protocol's phases and node interactions in real-time.

## Frontend Implementation Details

### 1. Core Protocol Phases
The visualization implements 6 key phases of the CRPC protocol:
1. Commit Work
2. Reveal Work
3. Compute Delta
4. Commit Delta
5. Reveal Delta
6. Final Verification

### 2. Node States
Each node in the ring can be in one of these states:
- Pending
- Committed
- Revealed
- Validated
- Disputed

### 3. Data Structures Needed

#### Node Data
```typescript
interface Node {
  address: string;          // Node's address (will be displayed shortened)
  state: NodeState;        // Current state in the protocol
  work?: {                 // Work data (when revealed)
    value: string;
    salt: string;
  };
  commitment?: string;     // Commitment hash
  delta?: {               // Delta data (when computed)
    value: number;
    commitment?: string;
  };
}
```

#### Edge Data
```typescript
interface Edge {
  from: string;           // Source node address
  to: string;            // Target node address
  delta: number;         // δ(i,i+1) value
  commitment?: string;   // Delta commitment hash
}
```

### 4. Required Backend Endpoints

#### Simulation Control
```typescript
// Start/Reset simulation
POST /api/simulation/reset
Response: { nodes: Node[], edges: Edge[] }

// Step through phases
POST /api/simulation/step
Body: { phase: number }
Response: { 
  nodes: Node[], 
  edges: Edge[],
  phase: number,
  phaseStatus: string 
}

// Get current state
GET /api/simulation/state
Response: {
  phase: number,
  nodes: Node[],
  edges: Edge[],
  isComplete: boolean
}
```

#### Real-time Updates
```typescript
// WebSocket Events
interface SimulationEvent {
  type: 'NODE_UPDATE' | 'EDGE_UPDATE' | 'PHASE_CHANGE';
  data: {
    node?: Node;
    edge?: Edge;
    phase?: number;
  };
}
```

### 5. Integration Requirements

#### Initial Setup
1. Fetch initial node configuration (4-10 nodes)
2. Establish WebSocket connection for real-time updates
3. Initialize 3D ring visualization

#### Phase Transitions
1. Commit Work Phase
   - Nodes submit work commitments
   - Visual feedback for committed nodes
   - Update phase details table

2. Reveal Work Phase
   - Nodes reveal their work
   - Display work values and salts
   - Update node states

3. Compute Delta Phase
   - Calculate δ(i,i+1) values
   - Update edge visualizations
   - Show delta computations

4. Commit Delta Phase
   - Nodes commit their delta values
   - Update edge commitments
   - Visual feedback for committed edges

5. Reveal Delta Phase
   - Nodes reveal delta values
   - Update edge visualizations
   - Show final delta values

6. Final Verification
   - Validate all commitments
   - Show final node states
   - Display verification results

### 6. Real-time Update Requirements
- WebSocket connection for live updates
- Event system for:
  - Node state changes
  - Edge updates
  - Phase transitions
  - Commitment reveals
  - Delta computations

### 7. Visual Feedback Requirements
- Node state changes (color transitions)
- Edge thickness/glow updates
- Commitment reveal animations
- Phase transition effects
- Hover interactions for:
  - Node details
  - Edge delta values
  - Commitment hashes

### 8. Mobile Responsiveness
- Adaptive layout for different screen sizes
- Touch-friendly controls
- Optimized 3D rendering for mobile devices

## Backend Integration Notes
1. The frontend expects real-time updates for all protocol phases
2. Each phase transition should trigger appropriate visual updates
3. Node and edge data should be synchronized across all clients
4. The system should support both automatic and step-by-step simulation
5. All cryptographic operations (commitments, reveals) should be handled by the backend