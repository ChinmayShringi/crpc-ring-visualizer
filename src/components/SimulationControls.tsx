
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, SkipForward, RotateCcw } from "lucide-react";

interface SimulationControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onReset: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  isPaused,
  onPlayPause,
  onStepForward,
  onReset
}) => {
  return (
    <div className="flex justify-center gap-4">
      <Button
        variant="outline" 
        className="flex items-center gap-2 border-slate-700 hover:bg-crpc-blue/20 hover:text-crpc-blue hover:border-crpc-blue"
        onClick={onReset}
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-2 border-slate-700 hover:bg-crpc-blue/20 hover:text-crpc-blue hover:border-crpc-blue"
        onClick={onStepForward}
      >
        <SkipForward className="h-4 w-4" />
        Step Forward
      </Button>
      
      <Button
        variant="outline"
        className={`flex items-center gap-2 ${
          isRunning && !isPaused 
            ? 'bg-crpc-blue/20 text-crpc-blue border-crpc-blue' 
            : 'border-slate-700 hover:bg-crpc-blue/20 hover:text-crpc-blue hover:border-crpc-blue'
        }`}
        onClick={onPlayPause}
      >
        {isRunning && !isPaused ? (
          <>
            <PauseCircle className="h-4 w-4" />
            Pause
          </>
        ) : (
          <>
            <PlayCircle className="h-4 w-4" />
            {isPaused ? 'Resume' : 'Play All'}
          </>
        )}
      </Button>
    </div>
  );
};

export default SimulationControls;
