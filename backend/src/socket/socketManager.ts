import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

let io: SocketIOServer | null = null;

function init(httpServer: HttpServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('join', (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`[Socket.io] Client ${socket.id} joined room: ${assignmentId}`);
    });

    socket.on('leave', (assignmentId: string) => {
      socket.leave(assignmentId);
      console.log(`[Socket.io] Client ${socket.id} left room: ${assignmentId}`);
    });

    socket.on('disconnect', (reason: string) => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}, reason: ${reason}`);
    });
  });

  console.log('[Socket.io] Initialized');
  return io;
}

function emitToRoom(room: string, event: string, data: Record<string, unknown>): void {
  if (!io) {
    console.warn('[Socket.io] Cannot emit — server not initialized');
    return;
  }
  io.to(room).emit(event, data);
}

function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('[Socket.io] Server not initialized. Call init() first.');
  }
  return io;
}

const socketManager = {
  init,
  emitToRoom,
  getIO,
};

export default socketManager;
