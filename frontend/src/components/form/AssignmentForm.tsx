import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assignmentSchema } from '../../lib/validators';
import { useAssignmentStore } from '../../store/useAssignmentStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useSocket } from '../../hooks/useSocket';
import { createAssignment } from '../../lib/api';
import { useToast } from '../../hooks/useToast';
import { GRADE_LEVELS } from '../../lib/constants';

import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { FileDropzone } from './FileDropzone';
import { QuestionTypeGrid } from './QuestionTypeGrid';
import { DifficultyPicker } from './DifficultyPicker';
import { AssignmentFormData } from '../../types';

export const AssignmentForm: React.FC = () => {
  const { currentStep, nextStep, prevStep, setJobStatus, setCurrentAssignmentId, currentAssignmentId, formData, setFormData } = useAssignmentStore();
  const { defaultGradeLevel, defaultDifficulty, promptTone } = useSettingsStore();
  const { toast, error: showError } = useToast();

  useSocket(currentAssignmentId);

  const { register, control, handleSubmit, formState: { errors, isValid }, trigger, watch, setValue } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    mode: 'onTouched',
    defaultValues: {
      title: formData.title || '',
      subject: formData.subject || '',
      gradeLevel: formData.gradeLevel || defaultGradeLevel || '',
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      questionTypes: formData.questionTypes || [],
      numberOfQuestions: formData.numberOfQuestions || 10,
      totalMarks: formData.totalMarks || 50,
      difficulty: formData.difficulty || defaultDifficulty || '',
      additionalInstructions: formData.additionalInstructions || '',
      file: formData.file || null,
    }
  });

  React.useEffect(() => {
    if (!formData.gradeLevel && defaultGradeLevel) {
      setValue('gradeLevel', defaultGradeLevel);
    }
    if (!formData.difficulty && defaultDifficulty) {
      setValue('difficulty', defaultDifficulty);
    }
  }, [defaultGradeLevel, defaultDifficulty, formData.gradeLevel, formData.difficulty, setValue]);

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      setJobStatus('pending');
      const formDataObj = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'file' && value) {
          formDataObj.append('file', value);
        } else if (key === 'questionTypes') {
          formDataObj.append(key, JSON.stringify(value));
        } else if (key === 'additionalInstructions') {
          const toneInstruction = promptTone !== 'Neutral' ? `\n\nTone Directive: Please write the questions in a ${promptTone} tone.` : '';
          formDataObj.append(key, (value ? value.toString() : '') + toneInstruction);
        } else if (value !== null && value !== undefined) {
          formDataObj.append(key, value.toString());
        }
      });

      const response = await createAssignment(formDataObj);
      setCurrentAssignmentId(response.assignmentId);
      toast('Generating your assessment...', 'info');
    } catch (err: any) {
      showError(err.message || 'Failed to create assignment');
      setJobStatus('idle');
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['title', 'subject', 'gradeLevel', 'dueDate'];
    if (currentStep === 2) fieldsToValidate = ['questionTypes', 'numberOfQuestions', 'totalMarks', 'difficulty'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setFormData(watch());
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full relative z-10">
      
      {/* Background Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] z-[-1]">
        <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>

      <div className="bg-white rounded-2xl shadow-paper border border-ink/5 p-6 md:p-10 transition-all duration-300">
        
        {/* STEP 1 */}
        <div className={currentStep === 1 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
          <h3 className="font-serif font-bold text-2xl text-navy mb-6">About the Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <Input
              label="Assessment Title"
              placeholder="e.g. Mid-Term Physics Exam"
              {...register('title')}
              error={errors.title?.message}
            />
            <Input
              label="Subject"
              placeholder="e.g. Physics"
              {...register('subject')}
              error={errors.subject?.message}
            />
            <Select
              label="Grade Level"
              options={GRADE_LEVELS}
              {...register('gradeLevel')}
              error={errors.gradeLevel?.message}
            />
            <Input
              type="date"
              label="Due Date"
              {...register('dueDate')}
              error={errors.dueDate?.message}
            />
          </div>
        </div>

        {/* STEP 2 */}
        <div className={currentStep === 2 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
          <h3 className="font-serif font-bold text-2xl text-navy mb-6">Question Setup</h3>
          
          <div className="mb-8">
            <label className="font-serif text-xs uppercase tracking-widest font-bold text-navy mb-3 block">
              Question Types <span className="text-rose">*</span>
            </label>
            <Controller
              name="questionTypes"
              control={control}
              render={({ field }) => (
                <QuestionTypeGrid selected={field.value} onChange={field.onChange} />
              )}
            />
            {errors.questionTypes && <p className="text-sm text-rose mt-2">{errors.questionTypes.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Input
              type="number"
              label="Total Number of Questions"
              {...register('numberOfQuestions', { valueAsNumber: true })}
              error={errors.numberOfQuestions?.message}
            />
            <Input
              type="number"
              label="Total Marks"
              {...register('totalMarks', { valueAsNumber: true })}
              error={errors.totalMarks?.message}
            />
          </div>

          <div>
            <label className="font-serif text-xs uppercase tracking-widest font-bold text-navy mb-3 block">
              Difficulty Level <span className="text-rose">*</span>
            </label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <DifficultyPicker selected={field.value} onChange={field.onChange} />
              )}
            />
            {errors.difficulty && <p className="text-sm text-rose mt-2">{errors.difficulty.message}</p>}
          </div>
        </div>

        {/* STEP 3 */}
        <div className={currentStep === 3 ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden'}>
          <h3 className="font-serif font-bold text-2xl text-navy mb-6">Context & Instructions</h3>
          
          <div className="mb-8">
            <Controller
              name="file"
              control={control}
              render={({ field }) => (
                <FileDropzone onFileSelect={field.onChange} selectedFile={field.value} />
              )}
            />
          </div>

          <Textarea
            label="Additional Instructions for AI"
            placeholder="e.g. Focus on Newton's third law. Ensure the language is simple. Avoid questions about electricity."
            {...register('additionalInstructions')}
            maxLength={2000}
            error={errors.additionalInstructions?.message}
            className="min-h-[150px]"
          />
        </div>

        {/* Form Actions */}
        <div className="mt-10 pt-6 border-t border-ink/10 flex items-center justify-between">
          {currentStep > 1 ? (
            <Button type="button" variant="ghost" onClick={prevStep}>
              ← Back
            </Button>
          ) : <div></div>}
          
          {currentStep < 3 ? (
            <Button type="button" onClick={handleNext}>
              Continue →
            </Button>
          ) : (
            <Button 
              type="submit" 
              className="w-full md:w-auto px-10 shadow-lg shadow-amber/20"
              disabled={!isValid}
            >
              Generate Question Paper ✦
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
