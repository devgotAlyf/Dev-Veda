import React from 'react';
import { Question } from '../../types';
import { MarksTag } from './MarksTag';
import { DifficultyBadge } from './DifficultyBadge';
import { Lightbulb } from 'lucide-react';

export const QuestionRow: React.FC<{ question: Question, showAnswers?: boolean }> = ({ question, showAnswers }) => {
  const formatNumber = (num: number) => (num < 10 ? `0${num}.` : `${num}.`);

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-start group">
      <div className="flex-1 flex gap-3">
        <span className="font-serif font-bold text-navy shrink-0 w-8">
          {formatNumber(question.questionNumber)}
        </span>
        <div className="flex-1">
          <p className="font-serif text-[15px] text-ink leading-relaxed mb-2">
            {question.questionText}
          </p>
          
          {question.type === 'mcq' && question.options && question.options.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 ml-2">
              {question.options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx); // A, B, C, D
                return (
                  <div key={idx} className="flex gap-2">
                    <span className="font-bold text-navy">{letter}.</span>
                    <span className="text-ink/80">{opt}</span>
                  </div>
                );
              })}
            </div>
          )}

          {showAnswers && question.answer && (
            <div className="mt-4 p-4 bg-sage/10 border border-sage/20 rounded-md">
              <div className="flex items-center gap-2 mb-2 text-sage font-bold font-sans text-sm uppercase tracking-wide">
                <Lightbulb size={16} />
                Answer Key
              </div>
              <p className="font-sans text-sm text-ink leading-relaxed whitespace-pre-wrap">
                {question.answer}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 sm:mt-0 flex items-center justify-end sm:flex-col sm:items-end gap-2 shrink-0">
        <DifficultyBadge difficulty={question.difficulty} />
        <MarksTag marks={question.marks} />
      </div>
    </div>
  );
};
