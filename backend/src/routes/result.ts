import { Router, Request, Response, NextFunction } from 'express';
import Result from '../models/Result';
import Assignment from '../models/Assignment';
import { redisClient } from '../config/redis';
import { addGenerationJob } from '../queues/assignmentQueue';
import { generatePdf } from '../services/pdfService';
import { NotFoundError } from '../middleware/errorHandler';

const router = Router();

// GET /api/results/:assignmentId
router.get(
  '/:assignmentId',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { assignmentId } = req.params;

      // Check Redis cache first
      const cached = await redisClient.get(`result:${assignmentId}`);
      if (cached) {
        const parsedResult: Record<string, unknown> = JSON.parse(cached);
        res.json({
          success: true,
          result: parsedResult,
          source: 'cache',
        });
        return;
      }

      // Fallback to MongoDB
      const result = await Result.findOne({ assignmentId });
      if (!result) {
        throw new NotFoundError('Result not found for this assignment');
      }

      // Cache for future requests
      await redisClient.setex(
        `result:${assignmentId}`,
        3600,
        JSON.stringify(result.toJSON())
      );

      res.json({
        success: true,
        result: result.toJSON(),
        source: 'database',
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/results/:assignmentId/pdf
router.get(
  '/:assignmentId/pdf',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { assignmentId } = req.params;

      const result = await Result.findOne({ assignmentId });
      if (!result) {
        throw new NotFoundError('Result not found for this assignment');
      }

      const sanitizedSubject = result.subject.replace(/[^a-zA-Z0-9]/g, '-');
      const sanitizedGrade = result.gradeLevel.replace(/[^a-zA-Z0-9]/g, '-');
      const filename = `${sanitizedSubject}-${sanitizedGrade}-ExamPaper.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );

      const pdfDoc = generatePdf(result);
      pdfDoc.pipe(res);
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/results/:id/regenerate
router.post(
  '/:id/regenerate',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      const assignment = await Assignment.findById(id);
      if (!assignment) {
        throw new NotFoundError('Assignment not found');
      }

      // Reset assignment status
      assignment.status = 'pending';
      assignment.errorMessage = undefined;
      await assignment.save();

      // Delete existing result
      await Result.deleteOne({ assignmentId: id });

      // Clear Redis cache
      await redisClient.del(`result:${id}`);

      // Add new generation job
      const jobId = await addGenerationJob(id);

      assignment.jobId = jobId;
      await assignment.save();

      res.json({
        success: true,
        jobId,
        message: 'Regeneration started',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
