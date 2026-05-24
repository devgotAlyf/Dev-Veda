import mongoose, { Document, Schema } from 'mongoose';

const QUESTION_TYPES = ['mcq', 'short', 'long', 'true_false'] as const;
const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export interface IQuestion {
  questionNumber: number;
  questionText: string;
  type: (typeof QUESTION_TYPES)[number];
  difficulty: (typeof DIFFICULTY_LEVELS)[number];
  marks: number;
  options: string[];
  answer?: string;
}

export interface ISection {
  sectionLabel: string;
  sectionTitle: string;
  instruction: string;
  totalMarks: number;
  questions: IQuestion[];
}

export interface IResult {
  assignmentId: mongoose.Types.ObjectId;
  title: string;
  subject: string;
  gradeLevel: string;
  totalMarks: number;
  duration: string;
  instructions: string[];
  sections: ISection[];
  generationModel: string;
  createdAt: Date;
}

export interface ResultDocument extends IResult, Document {}

const questionSchema = new Schema<IQuestion>(
  {
    questionNumber: { type: Number, required: true },
    questionText: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [...QUESTION_TYPES],
    },
    difficulty: {
      type: String,
      required: true,
      enum: [...DIFFICULTY_LEVELS],
    },
    marks: { type: Number, required: true },
    options: { type: [String], default: [] },
    answer: { type: String },
  },
  { _id: false }
);

const sectionSchema = new Schema<ISection>(
  {
    sectionLabel: { type: String, required: true },
    sectionTitle: { type: String, required: true },
    instruction: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    questions: { type: [questionSchema], required: true },
  },
  { _id: false }
);

const resultSchema = new Schema<ResultDocument>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Assignment ID is required'],
      index: true,
    },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    gradeLevel: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    duration: { type: String, required: true },
    instructions: { type: [String], default: [] },
    sections: { type: [sectionSchema], required: true },
    generationModel: {
      type: String,
      default: 'claude-sonnet-4-20250514',
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

const Result = mongoose.model<ResultDocument>('Result', resultSchema);

export default Result;
