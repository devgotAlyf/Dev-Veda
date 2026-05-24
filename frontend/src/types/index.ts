export interface AssignmentFormData {
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: string;
  additionalInstructions: string;
  file: File | null;
}

export interface Question {
  questionNumber: number;
  questionText: string;
  type: 'mcq' | 'short' | 'long' | 'true_false';
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  options: string[];
}

export interface Section {
  sectionLabel: string;
  sectionTitle: string;
  instruction: string;
  totalMarks: number;
  questions: Question[];
}

export interface GeneratedPaper {
  _id: string;
  assignmentId: string;
  title: string;
  subject: string;
  gradeLevel: string;
  totalMarks: number;
  duration: string;
  instructions: string[];
  sections: Section[];
  generationModel: string;
  createdAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: string;
  additionalInstructions: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  errorMessage?: string;
  createdAt: string;
}

export type JobStatus = 'idle' | 'pending' | 'processing' | 'completed' | 'failed';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}
