import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { redisClient } from '../config/redis';
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

    // 1. Find assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment not found: ${assignmentId}`);
    }

    // 2. Update status to processing
    assignment.status = 'processing';
    await assignment.save();

    // 3. Emit processing event
    socketManager.emitToRoom(assignmentId, 'job:processing', {
      event: 'job:processing',
      assignmentId,
      progress: 0,
    });

    // 4. Build AI input data
    const aiInput: AssessmentInput = {
      subject: assignment.subject,
      gradeLevel: assignment.gradeLevel,
      numberOfQuestions: assignment.numberOfQuestions,
      totalMarks: assignment.totalMarks,
      questionTypes: assignment.questionTypes,
      difficulty: assignment.difficulty,
      additionalInstructions: assignment.additionalInstructions,
      fileContent: assignment.fileContent,
    };

    // 5. Emit progress: prompt built
    socketManager.emitToRoom(assignmentId, 'job:progress', {
      event: 'job:progress',
      assignmentId,
      progress: 30,
      message: 'Prompt built, sending to AI...',
    });

    // 6. Call AI service
    const generatedData = await generateAssessment(aiInput);

    // 7. Emit progress: AI responded
    socketManager.emitToRoom(assignmentId, 'job:progress', {
      event: 'job:progress',
      assignmentId,
      progress: 70,
      message: 'AI responded, processing results...',
    });

    // 8. Create Result document
    const result = new Result({
      assignmentId: assignment._id,
      title: generatedData.title,
      subject: generatedData.subject,
      gradeLevel: generatedData.gradeLevel,
      totalMarks: generatedData.totalMarks,
      duration: generatedData.duration,
      instructions: generatedData.instructions,
      sections: generatedData.sections,
      generationModel: 'claude-sonnet-4-20250514',
    });

    // 9. Emit progress: saving
    socketManager.emitToRoom(assignmentId, 'job:progress', {
      event: 'job:progress',
      assignmentId,
      progress: 90,
      message: 'Saving results...',
    });

    // 10. Save to MongoDB
    await result.save();

    // 11. Cache in Redis
    const resultJSON = JSON.stringify(result.toJSON());
    await redisClient.setex(`result:${assignmentId}`, CACHE_TTL, resultJSON);

    // 12. Update assignment status
    assignment.status = 'completed';
    await assignment.save();

    // 13. Emit completed event
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
    const updateErr = updateError as Error;
    console.error(`[Worker] Failed to update assignment on error: ${updateErr.message}`);
  }
});

worker.on('error', (error: Error) => {
  console.error(`[Worker] Error: ${error.message}`);
});

console.log('[Worker] Generation worker started');

export default worker;
