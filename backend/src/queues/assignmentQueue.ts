import { Queue, JobsOptions } from 'bullmq';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const isTLS = REDIS_URL.startsWith('rediss://');
const parsedUrl = new URL(REDIS_URL);

const redisConnection = {
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port, 10) || 6379,
  username: parsedUrl.username || 'default',
  password: parsedUrl.password || undefined,
  maxRetriesPerRequest: null,
  tls: isTLS ? {} : undefined,
};

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
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 50 },
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
