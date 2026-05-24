import React from 'react';

export const MarksTag: React.FC<{ marks: number }> = ({ marks }) => {
  return (
    <span className="inline-flex items-center justify-center bg-navy text-cream text-[10px] font-bold px-2 py-0.5 rounded-full ml-3 whitespace-nowrap">
      [{marks}M]
    </span>
  );
};
