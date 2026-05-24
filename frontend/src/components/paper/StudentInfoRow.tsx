import React from 'react';

export const StudentInfoRow: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8 font-serif">
      <div className="flex gap-2 sm:col-span-2">
        <span className="font-bold text-navy">Name:</span>
        <div className="flex-1 border-b border-navy-700/50 relative top-4"></div>
      </div>
      <div className="flex gap-4">
        <div className="flex gap-2 flex-1">
          <span className="font-bold text-navy whitespace-nowrap">Roll No:</span>
          <div className="flex-1 border-b border-navy-700/50 relative top-4"></div>
        </div>
        <div className="flex gap-2 flex-1">
          <span className="font-bold text-navy">Sec:</span>
          <div className="flex-1 border-b border-navy-700/50 relative top-4"></div>
        </div>
      </div>
    </div>
  );
};
