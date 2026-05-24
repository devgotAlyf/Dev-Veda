import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai';
const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = 5000;

async function connectDB(retryCount = 0): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[MongoDB] Connected successfully');
  } catch (error) {
    const err = error as Error;
    console.error(`[MongoDB] Connection attempt ${retryCount + 1} failed: ${err.message}`);

    if (retryCount < MAX_RETRIES - 1) {
      console.log(`[MongoDB] Retrying in ${RETRY_BACKOFF_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_BACKOFF_MS));
      return connectDB(retryCount + 1);
    }

    console.error('[MongoDB] All connection attempts exhausted. Exiting.');
    process.exit(1);
  }
}

mongoose.connection.on('error', (err: Error) => {
  console.error(`[MongoDB] Runtime connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected');
});

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`[MongoDB] ${signal} received. Closing connection...`);
  await mongoose.disconnect();
  console.log('[MongoDB] Disconnected gracefully');
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

export default connectDB;
