import React from 'react';
import { Section } from '../../types';
import { QuestionRow } from './QuestionRow';

export const SectionBlock: React.FC<{ section: Section, showAnswers?: boolean }> = ({ section, showAnswers }) => {
  return (
    <div className="mb-10">
      <div className="mb-4">
        <h3 className="font-serif font-bold text-lg text-navy uppercase tracking-widest">
          {section.sectionLabel} — {section.sectionTitle}
        </h3>
        <p className="font-sans italic text-sm text-muted">
          [{section.instruction} · {section.totalMarks} Marks]
        </p>
      </div>
      
      <div className="h-[1px] bg-ink/20 w-full mb-6" />
      
      <div>
        {section.questions.map((q, idx) => (
          <QuestionRow key={idx} question={q} showAnswers={showAnswers} />
        ))}
      </div>
    </div>
  );
};
