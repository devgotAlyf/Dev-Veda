import React from 'react';
import { DIFFICULTY_OPTIONS } from '../../lib/constants';

interface DifficultyPickerProps {
  selected: string;
  onChange: (difficulty: string) => void;
}

export const DifficultyPicker: React.FC<DifficultyPickerProps> = ({ selected, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {DIFFICULTY_OPTIONS.map((diff) => {
        const isSelected = selected === diff.value;
        
        // Dynamic border color based on constant color mapping
        let leftBorderClass = '';
        if (diff.color === 'sage') leftBorderClass = 'border-l-sage';
        if (diff.color === 'honey') leftBorderClass = 'border-l-honey';
        if (diff.color === 'rose') leftBorderClass = 'border-l-rose';
        if (diff.color === 'amber') leftBorderClass = 'border-l-amber';

        return (
          <button
            key={diff.value}
            type="button"
            onClick={() => onChange(diff.value)}
            className={`flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 border-l-[6px] ${
              isSelected
                ? `bg-white border-y-2 border-r-2 border-y-amber border-r-amber shadow-paper scale-[1.02] z-10 ${leftBorderClass}`
                : `bg-cream-100 border-y border-r border-ink/10 opacity-80 hover:opacity-100 hover:bg-white ${leftBorderClass}`
            }`}
          >
            <span className="text-3xl mb-2 filter drop-shadow-sm">{diff.icon}</span>
            <span className={`font-serif font-bold mb-1 ${isSelected ? 'text-navy' : 'text-ink'}`}>
              {diff.label}
            </span>
            <span className="text-[10px] text-muted leading-tight">
              {diff.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};
