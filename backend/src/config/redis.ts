import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  retryStrategy(times: number): number | null {
    if (times > 10) {
      console.error('[Redis] Max reconnection attempts reached');
      return null;
    }
    const delay = Math.min(times * 200, 5000);
    return delay;
  },
});

redisClient.on('connect', () => {
  console.log('[Redis] Connecting...');
});

redisClient.on('ready', () => {
  console.log('[Redis] Ready and accepting commands');
});

redisClient.on('error', (err: Error) => {
  console.error(`[Redis] Error: ${err.message}`);
});

redisClient.on('close', () => {
  console.warn('[Redis] Connection closed');
});

const parsedUrl = new URL(REDIS_URL);

interface RedisConnectionConfig {
  host: string;
  port: number;
  maxRetriesPerRequest: null;
}

const redisConnection: RedisConnectionConfig = {
  host: parsedUrl.hostname || 'localhost',
  port: parseInt(parsedUrl.port, 10) || 6379,
  maxRetriesPerRequest: null,
};

export { redisClient, redisConnection };
