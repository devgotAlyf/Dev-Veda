import React from 'react';
import { GeneratedPaper } from '../../types';
import { PaperHeader } from './PaperHeader';
import { StudentInfoRow } from './StudentInfoRow';
import { SectionBlock } from './SectionBlock';

export const ExamPaper: React.FC<{ paper: GeneratedPaper }> = ({ paper }) => {
  return (
    <div className="bg-white rounded-xl shadow-lifted max-w-[850px] mx-auto overflow-hidden relative print:shadow-none print:max-w-none print:m-0">
      
      {/* Decorative Outer Border */}
      <div className="absolute inset-4 border-2 border-navy-700/20 pointer-events-none z-10 hidden sm:block print:block"></div>
      
      <div className="p-8 sm:p-14 relative z-20">
        <PaperHeader
          title={paper.title}
          subject={paper.subject}
          gradeLevel={paper.gradeLevel}
          totalMarks={paper.totalMarks}
          duration={paper.duration}
          createdAt={paper.createdAt}
        />
        
        <StudentInfoRow />

        {paper.instructions && paper.instructions.length > 0 && (
          <div className="mb-10">
            <h4 className="font-serif font-bold text-navy mb-2">General Instructions:</h4>
            <ul className="list-disc pl-5 space-y-1 font-sans text-[13px] text-ink/80">
              {paper.instructions.map((inst, idx) => (
                <li key={idx} className="pl-1">{inst}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="h-1 bg-navy-700 w-full mb-10" />

        <div className="sections-container">
          {paper.sections.map((section, idx) => (
            <SectionBlock key={idx} section={section} />
          ))}
        </div>

        <div className="mt-16 pt-8 border-t-[3px] border-double border-navy-700/30 text-center">
          <span className="font-serif italic text-muted text-sm">— End of Paper —</span>
        </div>
      </div>
    </div>
  );
};
