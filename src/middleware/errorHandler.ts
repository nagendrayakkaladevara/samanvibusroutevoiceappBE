import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../types';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error(`Error handling request: ${req.method} ${req.path}`, error);

  let statusCode = 500;
  let message = 'Internal server error';

  // Handle specific error types
  if (error.message.includes('Google Sheets')) {
    statusCode = 503;
    message = 'Authentication service temporarily unavailable';
  } else if (error.message.includes('Invalid or expired token')) {
    statusCode = 401;
    message = 'Invalid or expired token';
  } else if (error.message.includes('Authorization header')) {
    statusCode = 401;
    message = 'Authorization header required';
  } else if (error.message.includes('validation')) {
    statusCode = 400;
    message = 'Invalid request data';
  }

  const apiError: ApiError = {
    error: error.name || 'InternalServerError',
    message,
    statusCode,
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(apiError);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 