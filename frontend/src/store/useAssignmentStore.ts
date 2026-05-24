import { create } from 'zustand';
import { AssignmentFormData, GeneratedPaper, JobStatus } from '../types';

interface AssignmentStore {
  formData: Partial<AssignmentFormData>;
  currentStep: 1 | 2 | 3;
  currentAssignmentId: string | null;
  jobStatus: JobStatus;
  jobProgress: number;
  statusMessage: string;
  generatedPaper: GeneratedPaper | null;
  isSubmitting: boolean;
  error: string | null;

  setFormData: (data: Partial<AssignmentFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  setJobStatus: (status: JobStatus, progress?: number, message?: string) => void;
  setGeneratedPaper: (paper: GeneratedPaper | null) => void;
  setCurrentAssignmentId: (id: string | null) => void;
  setIsSubmitting: (val: boolean) => void;
  setError: (err: string | null) => void;
  reset: () => void;
}

const initialState = {
  formData: {},
  currentStep: 1 as const,
  currentAssignmentId: null,
  jobStatus: 'idle' as const,
  jobProgress: 0,
  statusMessage: '',
  generatedPaper: null,
  isSubmitting: false,
  error: null,
};

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  ...initialState,

  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 3) as 1 | 2 | 3 })),
  
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) as 1 | 2 | 3 })),
  
  setJobStatus: (status, progress = 0, message = '') => set((state) => ({ 
    jobStatus: status, 
    jobProgress: progress,
    statusMessage: message || state.statusMessage 
  })),
  
  setGeneratedPaper: (paper) => set({ generatedPaper: paper }),
  
  setCurrentAssignmentId: (id) => set({ currentAssignmentId: id }),
  
  setIsSubmitting: (val) => set({ isSubmitting: val }),
  
  setError: (err) => set({ error: err }),
  
  reset: () => set(initialState),
}));
