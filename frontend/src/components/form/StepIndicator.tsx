import React from 'react';
import { FORM_STEPS } from '../../lib/constants';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full mb-10 mt-4 relative">
      <div className="flex items-center justify-between relative z-10">
        {FORM_STEPS.map((stepName, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <div key={stepName} className="flex flex-col items-center w-1/3">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                  isCompleted 
                    ? 'bg-amber text-white' 
                    : isCurrent 
                      ? 'bg-navy text-amber ring-4 ring-amber/20' 
                      : 'bg-cream-100 text-muted border border-ink/10'
                }`}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : stepNumber}
              </div>
              <span 
                className={`mt-3 text-xs font-serif uppercase tracking-wider text-center ${
                  isCurrent ? 'text-navy font-bold' : 'text-muted font-semibold'
                }`}
              >
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Connecting Lines */}
      <div className="absolute top-5 left-0 right-0 h-[2px] -z-0 flex px-[16.66%]">
        <div className={`h-full w-1/2 transition-colors duration-500 ${currentStep > 1 ? 'bg-amber' : 'bg-ink/10'}`} />
        <div className={`h-full w-1/2 transition-colors duration-500 ${currentStep > 2 ? 'bg-amber' : 'bg-ink/10'}`} />
      </div>
    </div>
  );
};
