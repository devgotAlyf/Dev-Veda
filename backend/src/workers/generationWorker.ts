import { Worker, Job } from 'bullmq';
import { redisConnection, redisClient } from '../config/redis';
import Assignment from '../models/Assignment';
import Result from '../models/Result';
import { generateAssessment, AssessmentInput } from '../services/aiService';
import socketManager from '../socket/socketManager';
import { AssessmentJobData } from '../queues/assignmentQueue';

const QUEUE_NAME = 'assessment-generation';
const CACHE_TTL = 3600;

const worker = new Worker<AssessmentJobData>(
  QUEUE_NAME,
  async (job: Job<AssessmentJobData>) => {
    const { assignmentId } = job.data;
    console.log(`[Worker] Processing job ${job.id} for assignment ${assignmentId}`);

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error(`Assignment not found: ${assignmentId}`);

    assignment.status = 'processing';
    await assignment.save();

    socketManager.emitToRoom(assignmentId, 'job:processing', {
      event: 'job:processing',
      assignmentId,
      progress: 0,
    });

    const aiInput: AssessmentInput = {
      subject: assignment.subject,
      gradeLevel: assignment.gradeLevel,
      numberOfQuestions: assignment.numberOfQuestions,
      totalMarks: assignment.totalMarks,
      questionTypes: assignment.questionTypes,
      difficulty: assignment.difficulty,
      additionalInstructions: assignment.additionalInstructions,
      fileContent: assignment.fileContent,
      includeSolutions: assignment.includeSolutions,
    };

    socketManager.emitToRoom(assignmentId, 'job:processing', {
      event: 'job:processing',
      assignmentId,
      progress: 30,
      message: 'Prompt built, sending to AI...',
    });

    const generatedData = await generateAssessment(aiInput);

    socketManager.emitToRoom(assignmentId, 'job:processing', {
      event: 'job:processing',
      assignmentId,
      progress: 70,
      message: 'AI responded, processing results...',
    });

    const result = new Result({
      assignmentId: assignment._id,
      title: generatedData.title,
      subject: generatedData.subject,
      gradeLevel: generatedData.gradeLevel,
      totalMarks: generatedData.totalMarks,
      duration: generatedData.duration,
      instructions: generatedData.instructions,
      sections: generatedData.sections,
      generationModel: 'gemini-2.0-flash',
    });

    socketManager.emitToRoom(assignmentId, 'job:processing', {
      event: 'job:processing',
      assignmentId,
      progress: 90,
      message: 'Saving results...',
    });

    await result.save();

    try {
      const resultJSON = JSON.stringify(result.toJSON());
      await redisClient.setex(`result:${assignmentId}`, CACHE_TTL, resultJSON);
    } catch (cacheError) {
      console.warn('[Worker] Redis cache failed, continuing without cache');
    }

    assignment.status = 'completed';
    await assignment.save();

    socketManager.emitToRoom(assignmentId, 'job:completed', {
      event: 'job:completed',
      assignmentId,
      resultId: result._id,
      progress: 100,
    });

    console.log(`[Worker] Job ${job.id} completed. Result: ${result._id}`);
    return { resultId: result._id };
  },
  {
    connection: redisConnection,
    concurrency: 3,
  }
);

worker.on('completed', (job: Job<AssessmentJobData>) => {
  console.log(`[Worker] Job ${job.id} completed successfully`);
});

worker.on('failed', async (job: Job<AssessmentJobData> | undefined, error: Error) => {
  if (!job) {
    console.error(`[Worker] Job failed with no job reference: ${error.message}`);
    return;
  }
  console.error(`[Worker] Job ${job.id} failed: ${error.message}`);
  try {
    const { assignmentId } = job.data;
    const assignment = await Assignment.findById(assignmentId);
    if (assignment) {
      assignment.status = 'failed';
      assignment.errorMessage = error.message;
      await assignment.save();
    }
    socketManager.emitToRoom(assignmentId, 'job:failed', {
      event: 'job:failed',
      assignmentId,
      error: error.message,
    });
  } catch (updateError) {
    console.error(`[Worker] Failed to update assignment on error: ${(updateError as Error).message}`);
  }
});

worker.on('error', (error: Error) => {
  console.error(`[Worker] Error: ${error.message}`);
});

console.log('[Worker] Generation worker started');

export default worker;
