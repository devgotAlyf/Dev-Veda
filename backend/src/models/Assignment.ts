import mongoose, { Document, Schema } from 'mongoose';

const GRADE_LEVELS = [
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'Undergraduate',
  'Postgraduate',
] as const;

const QUESTION_TYPES = ['mcq', 'short', 'long', 'true_false'] as const;
const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'mixed'] as const;
const STATUS_VALUES = ['pending', 'processing', 'completed', 'failed'] as const;

type GradeLevel = (typeof GRADE_LEVELS)[number];
type QuestionType = (typeof QUESTION_TYPES)[number];
type Difficulty = (typeof DIFFICULTY_LEVELS)[number];
type Status = (typeof STATUS_VALUES)[number];

export interface IAssignment {
  title: string;
  subject: string;
  gradeLevel: GradeLevel;
  dueDate: Date;
  questionTypes: QuestionType[];
  numberOfQuestions: number;
  totalMarks: number;
  difficulty: Difficulty;
  additionalInstructions: string;
  fileContent: string;
  status: Status;
  jobId?: string;
  errorMessage?: string;
  createdAt: Date;
}

export interface AssignmentDocument extends IAssignment, Document {}

const assignmentSchema = new Schema<AssignmentDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    gradeLevel: {
      type: String,
      required: [true, 'Grade level is required'],
      enum: {
        values: [...GRADE_LEVELS],
        message: '{VALUE} is not a valid grade level',
      },
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    questionTypes: {
      type: [String],
      required: true,
      validate: {
        validator: function (val: string[]): boolean {
          return val.length >= 1;
        },
        message: 'At least one question type is required',
      },
      enum: {
        values: [...QUESTION_TYPES],
        message: '{VALUE} is not a valid question type',
      },
    },
    numberOfQuestions: {
      type: Number,
      required: [true, 'Number of questions is required'],
      min: [1, 'Minimum 1 question required'],
      max: [50, 'Maximum 50 questions allowed'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1, 'Minimum 1 mark required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: [...DIFFICULTY_LEVELS],
        message: '{VALUE} is not a valid difficulty level',
      },
    },
    additionalInstructions: {
      type: String,
      default: '',
    },
    fileContent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'pending',
      enum: {
        values: [...STATUS_VALUES],
        message: '{VALUE} is not a valid status',
      },
    },
    jobId: {
      type: String,
    },
    errorMessage: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

assignmentSchema.index({ status: 1 });
assignmentSchema.index({ createdAt: -1 });

const Assignment = mongoose.model<AssignmentDocument>('Assignment', assignmentSchema);

export default Assignment;
