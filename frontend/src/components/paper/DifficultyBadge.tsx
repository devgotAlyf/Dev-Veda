import React from 'react';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const styles = {
    easy: 'bg-sage/15 text-sage border-sage/30',
    medium: 'bg-honey/15 text-honey border-honey/30',
    hard: 'bg-rose/15 text-rose border-rose/30',
  };

  return (
    <span className={`inline-flex items-center justify-center border text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${styles[difficulty]}`}>
      {difficulty}
    </span>
  );
};
