import React from 'react';
import { QUESTION_TYPES } from '../../lib/constants';

interface QuestionTypeGridProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

export const QuestionTypeGrid: React.FC<QuestionTypeGridProps> = ({ selected, onChange }) => {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {QUESTION_TYPES.map((type) => {
        const isSelected = selected.includes(type.value);
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => toggle(type.value)}
            className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 active:scale-[0.98] ${
              isSelected
                ? 'bg-amber border-amber shadow-sm text-white'
                : 'bg-cream-100 border-ink/10 hover:border-amber/40 text-ink hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl">{type.icon}</span>
              <span className={`font-serif font-bold ${isSelected ? 'text-white' : 'text-navy'}`}>
                {type.label}
              </span>
            </div>
            <span className={`text-xs ml-10 ${isSelected ? 'text-amber-light' : 'text-muted'}`}>
              {type.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};
