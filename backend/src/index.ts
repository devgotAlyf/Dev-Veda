import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import connectDB from './config/db';
import { redisClient } from './config/redis';
import assignmentRoutes from './routes/assignment';
import resultRoutes from './routes/result';
import socketManager from './socket/socketManager';
import { errorHandler } from './middleware/errorHandler';

// Import worker to start it
import './workers/generationWorker';

const PORT = parseInt(process.env.PORT || '5000', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'VedaAI Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/assignments', assignmentRoutes);
app.use('/api/results', resultRoutes);

// Global error handler (must be after routes)
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
socketManager.init(server);

// Start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`[VedaAI] Backend running on port ${PORT}`);
      console.log(`[VedaAI] CORS origin: ${FRONTEND_URL}`);
      console.log(`[VedaAI] Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error: Error) => {
    console.error(`[VedaAI] Failed to start: ${error.message}`);
    process.exit(1);
  });

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n[VedaAI] ${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log('[VedaAI] HTTP server closed');
  });

  try {
    await redisClient.quit();
    console.log('[VedaAI] Redis disconnected');
  } catch (redisError) {
    const redisErr = redisError as Error;
    console.error(`[VedaAI] Redis disconnect error: ${redisErr.message}`);
  }

  // Mongoose shutdown is handled in config/db.ts
  console.log('[VedaAI] Shutdown complete');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
