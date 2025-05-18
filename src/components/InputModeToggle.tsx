
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { NodeData } from '@/lib/types';

interface InputModeToggleProps {
  useRandomValues: boolean;
  onToggleRandomValues: () => void;
  nodes: NodeData[];
  nodeValues: Record<string, number>;
  onNodeValueChange: (nodeId: string, value: number) => void;
}

const InputModeToggle: React.FC<InputModeToggleProps> = ({
  useRandomValues,
  onToggleRandomValues,
  nodes,
  nodeValues,
  onNodeValueChange,
}) => {
  return (
    <div className="mb-6 glass-card p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="random-toggle" className="text-sm text-slate-300">
          {useRandomValues ? "Using random node values" : "Using specified node values"}
        </Label>
        <div className="flex items-center space-x-2">
          <Label htmlFor="random-toggle" className="text-xs text-slate-400">Specify</Label>
          <Switch
            id="random-toggle"
            checked={useRandomValues}
            onCheckedChange={onToggleRandomValues}
          />
          <Label htmlFor="random-toggle" className="text-xs text-slate-400">Random</Label>
        </div>
      </div>

      {!useRandomValues && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {nodes.map(node => {
            const shortAddress = `${node.address.substring(0, 6)}...${node.address.substring(node.address.length - 4)}`;
            return (
              <div key={node.id} className="flex flex-col space-y-1">
                <Label htmlFor={`node-${node.id}`} className="text-xs text-slate-400">
                  {shortAddress}
                </Label>
                <Input
                  id={`node-${node.id}`}
                  type="number"
                  min={0}
                  max={100}
                  className="h-8 text-sm"
                  value={nodeValues[node.id] || 0}
                  onChange={(e) => onNodeValueChange(node.id, Number(e.target.value))}
                  disabled={node.status !== 'Pending'}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InputModeToggle;
