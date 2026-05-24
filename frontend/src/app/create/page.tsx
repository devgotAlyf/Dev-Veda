'use client';

import React from 'react';
import { StepIndicator } from '../../components/form/StepIndicator';
import { AssignmentForm } from '../../components/form/AssignmentForm';
import { GeneratingOverlay } from '../../components/form/GeneratingOverlay';
import { useAssignmentStore } from '../../store/useAssignmentStore';

export default function CreateAssessmentPage() {
  const { currentStep } = useAssignmentStore();

  return (
    <div className="min-h-[calc(100vh-64px)] p-page relative overflow-hidden">
      <GeneratingOverlay />
      
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="font-serif font-black text-4xl md:text-5xl text-navy mb-3 tracking-tight">
            Create Assessment
          </h1>
          <p className="font-sans text-muted text-lg">
            Design your perfect examination paper with VedaAI.
          </p>
        </header>

        <StepIndicator currentStep={currentStep} />
        
        <AssignmentForm />
      </div>
    </div>
  );
}
