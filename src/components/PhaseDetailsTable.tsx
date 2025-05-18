
import React from 'react';
import { NodeData } from '@/lib/types';

interface PhaseDetailsTableProps {
  nodes: NodeData[];
  hoveredNodeId: string | null;
  onRowHover: (nodeId: string | null) => void;
}

const PhaseDetailsTable: React.FC<PhaseDetailsTableProps> = ({ 
  nodes, 
  hoveredNodeId,
  onRowHover
}) => {
  // Helper to truncate long strings
  const truncate = (str: string, length: number = 8) => {
    if (!str) return '—';
    return str.length > length ? `${str.slice(0, length)}...` : str;
  };

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-700">
            <th className="p-3 text-xs font-semibold text-slate-400">NODE</th>
            <th className="p-3 text-xs font-semibold text-slate-400">STATUS</th>
            <th className="p-3 text-xs font-semibold text-slate-400">VALUE</th>
            <th className="p-3 text-xs font-semibold text-slate-400">SALT</th>
            <th className="p-3 text-xs font-semibold text-slate-400">COMMITMENT</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((node) => (
            <tr 
              key={node.id} 
              className={`border-b border-slate-700/50 transition-colors 
                ${hoveredNodeId === node.id ? 'bg-slate-700/60 ring-1 ring-crpc-blue' : 'hover:bg-slate-800/30'}`}
              onMouseEnter={() => onRowHover(node.id)}
              onMouseLeave={() => onRowHover(null)}
            >
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-crpc-node-${node.status.toLowerCase()}`}></div>
                  <span className="font-mono text-xs">
                    {truncate(node.address, 8)}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <span className={`text-xs px-2 py-1 rounded bg-crpc-node-${node.status.toLowerCase()}/10 text-crpc-node-${node.status.toLowerCase()}`}>
                  {node.status}
                </span>
              </td>
              <td className="p-3 font-mono text-xs">{node.value !== undefined && node.value !== null ? node.value : '—'}</td>
              <td className="p-3 font-mono text-xs">{truncate(node.salt, 6)}</td>
              <td className="p-3 font-mono text-xs">{truncate(node.commitment, 8)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhaseDetailsTable;
