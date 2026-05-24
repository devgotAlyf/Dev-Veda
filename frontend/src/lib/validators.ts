import { z } from 'zod';

export const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  subject: z.string().min(2, 'Subject is required').max(100),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  questionTypes: z.array(z.string()).min(1, 'Select at least one question type'),
  numberOfQuestions: z.number({ invalid_type_error: "Must be a number" }).int().min(1).max(50),
  totalMarks: z.number({ invalid_type_error: "Must be a number" }).int().min(1, 'Total marks must be at least 1'),
  difficulty: z.string().min(1, 'Select a difficulty level'),
  additionalInstructions: z.string().max(2000).optional().default(''),
  file: z.any().refine((val) => val !== null && val !== undefined, "PDF reference material is required"),
});
