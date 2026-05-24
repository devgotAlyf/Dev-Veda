export const APP_NAME = 'VedaAI';
export const APP_DESCRIPTION = 'AI-Powered Assessment Creator';

export const GRADE_LEVELS = [
  { value: '', label: 'Select Grade Level...' },
  { value: 'Grade 6', label: 'Grade 6' },
  { value: 'Grade 7', label: 'Grade 7' },
  { value: 'Grade 8', label: 'Grade 8' },
  { value: 'Grade 9', label: 'Grade 9' },
  { value: 'Grade 10', label: 'Grade 10' },
  { value: 'Grade 11', label: 'Grade 11' },
  { value: 'Grade 12', label: 'Grade 12' },
  { value: 'Undergraduate', label: 'Undergraduate' },
  { value: 'Postgraduate', label: 'Postgraduate' },
];

export const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice', icon: '📝', description: '4 options per question' },
  { value: 'short', label: 'Short Answer', icon: '✍️', description: '1-3 sentence answers' },
  { value: 'long', label: 'Long Answer', icon: '📄', description: 'Essay or detailed answers' },
  { value: 'true_false', label: 'True/False', icon: '☑️', description: 'Binary choice' },
];

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', icon: '🟢', color: 'sage', description: 'Fundamental concepts & recall' },
  { value: 'medium', label: 'Medium', icon: '🟡', color: 'honey', description: 'Application & understanding' },
  { value: 'hard', label: 'Hard', icon: '🔴', color: 'rose', description: 'Analysis & synthesis' },
  { value: 'mixed', label: 'Mixed', icon: '🌈', color: 'amber', description: 'Balanced distribution' },
];

export const FORM_STEPS = [
  'About the Assessment',
  'Question Setup',
  'Context & Instructions'
];

export const STATUS_MESSAGES: Record<number, string> = {
  0: 'Adding to queue...',
  30: 'Building the prompt...',
  50: 'AI is crafting questions...',
  70: 'Reviewing paper quality...',
  90: 'Saving your paper...',
  100: 'Your paper is ready!'
};
