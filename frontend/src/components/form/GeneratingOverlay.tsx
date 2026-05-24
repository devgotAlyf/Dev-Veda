import React, { useEffect, useState } from 'react';
import { useAssignmentStore } from '../../store/useAssignmentStore';
import { STATUS_MESSAGES } from '../../lib/constants';

export const GeneratingOverlay: React.FC = () => {
  const { jobStatus, jobProgress } = useAssignmentStore();
  const [displayText, setDisplayText] = useState('');
  
  // Find current appropriate message based on progress
  const targetMessage = React.useMemo(() => {
    const keys = Object.keys(STATUS_MESSAGES).map(Number).sort((a, b) => b - a);
    const key = keys.find(k => jobProgress >= k) || 0;
    return STATUS_MESSAGES[key];
  }, [jobProgress]);

  // Typewriter effect
  useEffect(() => {
    setDisplayText('');
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < targetMessage.length) {
        setDisplayText(targetMessage.slice(0, i + 1));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [targetMessage]);

  if (jobStatus === 'idle' || jobStatus === 'completed' || jobStatus === 'failed') {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-navy/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-6 transition-all duration-500 animate-in fade-in">
      
      {/* Animated Logo */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-amber rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="text-amber text-6xl relative z-10 animate-[bounce_2s_ease-in-out_infinite]">✦</div>
      </div>

      <div className="w-full max-w-md bg-navy-800 border border-navy-700 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Progress Bar Track */}
        <div className="h-2 w-full bg-navy-900 rounded-full mb-8 overflow-hidden border border-navy-700/50 relative">
          {/* Progress Fill */}
          <div 
            className="h-full bg-gradient-to-r from-amber to-amber-light transition-all duration-1000 ease-out relative"
            style={{ width: `${jobProgress}%` }}
          >
            {/* Shine effect on progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        {/* Typewriter Text */}
        <div className="h-8 flex justify-center items-center">
          <p className="font-serif text-cream text-lg tracking-wide text-center">
            {displayText}
            <span className="animate-pulse ml-1 inline-block bg-amber w-2 h-5 align-middle"></span>
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-center text-muted text-sm mt-4">
          Estimated time: ~30 seconds
        </p>
      </div>
    </div>
  );
};
