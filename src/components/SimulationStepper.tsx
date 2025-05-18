
import React from 'react';
import { SimulationPhase, PhaseInfo } from '@/lib/types';
import { PHASE_INFO } from '@/lib/mockData';

interface SimulationStepperProps {
  currentPhase: SimulationPhase;
  onPhaseChange: (phase: SimulationPhase) => void;
}

const SimulationStepper: React.FC<SimulationStepperProps> = ({ 
  currentPhase, 
  onPhaseChange 
}) => {
  const phases: SimulationPhase[] = [
    'CommitWork',
    'RevealWork',
    'ComputeDelta',
    'CommitDelta',
    'RevealDelta',
    'Verification'
  ];
  
  const currentIndex = phases.findIndex(phase => phase === currentPhase);
  
  return (
    <div className="w-full">
      {/* Stepper header */}
      <div className="flex w-full mb-4 justify-between">
        {phases.map((phase, index) => {
          const isActive = phase === currentPhase;
          const isPast = phases.indexOf(currentPhase) > index;
          
          return (
            <div 
              key={phase} 
              className="flex flex-col items-center"
              onClick={() => onPhaseChange(phase)}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 ${
                  isActive ? 'bg-crpc-blue text-white scale-110' : 
                  isPast ? 'bg-crpc-teal/20 text-crpc-teal border border-crpc-teal/50' : 
                  'bg-slate-700/50 text-slate-400'
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-1 hidden md:block ${
                isActive ? 'text-crpc-blue' : 
                isPast ? 'text-crpc-teal/70' : 
                'text-slate-500'
              }`}>
                {`Phase ${index + 1}`}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Connecting line */}
      <div className="relative w-full h-1 bg-slate-700 mb-6">
        <div 
          className="absolute h-full bg-crpc-blue transition-all duration-500"
          style={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
        />
      </div>
      
      {/* Current phase description */}
      <div className="glass-card p-4 rounded-lg mb-6 animate-fade-in">
        <h3 className="text-crpc-blue text-xl font-semibold mb-2">
          {PHASE_INFO[currentPhase].title}
        </h3>
        <p className="text-slate-300">
          {PHASE_INFO[currentPhase].description}
        </p>
      </div>
    </div>
  );
};

export default SimulationStepper;
