import React from 'react';

interface PaperHeaderProps {
  title: string;
  subject: string;
  gradeLevel: string;
  totalMarks: number;
  duration: string;
  createdAt: string;
}

export const PaperHeader: React.FC<PaperHeaderProps> = ({
  title, subject, gradeLevel, totalMarks, duration, createdAt
}) => {
  const dateStr = new Date(createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="mb-6">
      <div className="text-center mb-6">
        <div className="inline-block border-2 border-navy px-8 py-2 mb-4">
          <h1 className="font-serif font-black text-2xl text-navy tracking-widest uppercase">
            VedaAI Academy
          </h1>
        </div>
        <h2 className="font-serif font-bold text-xl text-navy uppercase tracking-widest">
          {title || 'Examination Question Paper'}
        </h2>
      </div>

      <div className="border-y-4 border-double border-navy-700 py-3 mb-6">
        <div className="flex flex-wrap justify-between items-center text-sm font-sans font-medium text-navy px-2 gap-4">
          <div className="flex gap-2">
            <span className="text-muted">Subject:</span>
            <span>{subject}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted">Grade:</span>
            <span>{gradeLevel}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted">Total Marks:</span>
            <span>{totalMarks}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted">Duration:</span>
            <span>{duration}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-muted">Date:</span>
            <span>{dateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
