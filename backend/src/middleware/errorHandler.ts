import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class AIServiceError extends AppError {
  constructor(message: string = 'AI service encountered an error') {
    super(message, 502);
  }
}

interface ErrorResponseBody {
  success: false;
  error: string;
  statusCode: number;
  stack?: string;
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[ErrorHandler]', err);

  if (err instanceof AppError) {
    const body: ErrorResponseBody = {
      success: false,
      error: err.message,
      statusCode: err.statusCode,
    };

    if (process.env.NODE_ENV === 'development') {
      body.stack = err.stack;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  const body: ErrorResponseBody = {
    success: false,
    error: 'Internal server error',
    statusCode: 500,
  };

  if (process.env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  res.status(500).json(body);
}
