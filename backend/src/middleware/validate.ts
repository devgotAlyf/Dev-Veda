import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';

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
];

const QUESTION_TYPES = ['mcq', 'short', 'long', 'true_false'];
const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'mixed'];

export const assignmentValidationRules: ValidationChain[] = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),

  body('gradeLevel')
    .trim()
    .notEmpty()
    .withMessage('Grade level is required')
    .isIn(GRADE_LEVELS)
    .withMessage(`Grade level must be one of: ${GRADE_LEVELS.join(', ')}`),

  body('dueDate')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),

  body('questionTypes')
    .customSanitizer((value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return [value];
        }
      }
      return value;
    })
    .isArray({ min: 1 })
    .withMessage('At least one question type is required'),

  body('questionTypes.*')
    .isIn(QUESTION_TYPES)
    .withMessage(`Each question type must be one of: ${QUESTION_TYPES.join(', ')}`),

  body('numberOfQuestions')
    .isInt({ min: 1, max: 50 })
    .withMessage('Number of questions must be between 1 and 50'),

  body('totalMarks')
    .isInt({ min: 1 })
    .withMessage('Total marks must be at least 1'),

  body('difficulty')
    .trim()
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(DIFFICULTY_LEVELS)
    .withMessage(`Difficulty must be one of: ${DIFFICULTY_LEVELS.join(', ')}`),
];

export function validate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: 'path' in error ? error.path : 'unknown',
      message: error.msg as string,
    }));

    res.status(400).json({
      success: false,
      errors: formattedErrors,
    });
    return;
  }

  next();
}
