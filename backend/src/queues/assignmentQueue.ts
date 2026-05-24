import { Queue, JobsOptions } from 'bullmq';
import { redisConnection } from '../config/redis';

export interface AssessmentJobData {
  assignmentId: string;
}

const QUEUE_NAME = 'assessment-generation';

const defaultJobOptions: JobsOptions = {
  attempts: 2,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
  removeOnComplete: {
    count: 100,
  },
  removeOnFail: {
    count: 50,
  },
};

const assessmentQueue = new Queue<AssessmentJobData>(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions,
});

assessmentQueue.on('error', (error: Error) => {
  console.error(`[Queue] Error: ${error.message}`);
});

export async function addGenerationJob(assignmentId: string): Promise<string> {
  const job = await assessmentQueue.add(
    'generate-assessment',
    { assignmentId },
    {
      jobId: `assessment-${assignmentId}-${Date.now()}`,
    }
  );

  console.log(`[Queue] Job ${job.id} added for assignment ${assignmentId}`);
  return job.id as string;
}

export default assessmentQueue;
