import { Router, Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import pdfParse from 'pdf-parse';
import Assignment from '../models/Assignment';
import { addGenerationJob } from '../queues/assignmentQueue';
import { assignmentValidationRules, validate } from '../middleware/validate';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';

const router = Router();

// Multer configuration
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowedMimeTypes = [
    'application/pdf',
    'text/plain',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('Only PDF and TXT files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// POST /api/assignments
router.post(
  '/',
  upload.single('file'),
  assignmentValidationRules,
  validate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let fileContent = '';

      if (!req.file) {
        throw new ValidationError('PDF reference material is required');
      }

      const { mimetype, buffer } = req.file;

        if (mimetype === 'application/pdf') {
          try {
            const pdfData = await pdfParse(buffer);
            fileContent = pdfData.text;
          } catch (pdfError) {
            const pdfErr = pdfError as Error;
            throw new ValidationError(`Failed to parse PDF: ${pdfErr.message}`);
          }
        } else if (mimetype === 'text/plain') {
          fileContent = buffer.toString('utf8');
        }

      // Parse questionTypes if it's a string (from multipart form)
      let questionTypes = req.body.questionTypes;
      if (typeof questionTypes === 'string') {
        try {
          questionTypes = JSON.parse(questionTypes) as string[];
        } catch {
          questionTypes = [questionTypes];
        }
      }

      const assignment = new Assignment({
        title: req.body.title,
        subject: req.body.subject,
        gradeLevel: req.body.gradeLevel,
        dueDate: new Date(req.body.dueDate as string),
        questionTypes,
        numberOfQuestions: parseInt(req.body.numberOfQuestions as string, 10),
        totalMarks: parseInt(req.body.totalMarks as string, 10),
        difficulty: req.body.difficulty,
        additionalInstructions: req.body.additionalInstructions || '',
        fileContent,
      });

      await assignment.save();

      const jobId = await addGenerationJob(
        assignment.id || assignment._id.toString()
      );

      assignment.jobId = jobId;
      await assignment.save();

      res.status(201).json({
        success: true,
        assignmentId: assignment._id,
        jobId,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/assignments
router.get(
  '/',
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignments = await Assignment.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        assignments: assignments.map(a => a.toJSON()),
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/assignments/:id
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const assignment = await Assignment.findById(req.params.id);

      if (!assignment) {
        throw new NotFoundError('Assignment not found');
      }

      res.json({
        success: true,
        assignment: assignment.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
