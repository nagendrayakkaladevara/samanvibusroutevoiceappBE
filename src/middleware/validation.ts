import { Request, Response, NextFunction } from 'express';
import { LoginRequest } from '../types';

export const validateLoginRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password }: LoginRequest = req.body;

  const errors: string[] = [];

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    errors.push('Username is required and must be a non-empty string');
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.push('Password is required and must be a non-empty string');
  }

  if (username && username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (password && password.trim().length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Invalid request data',
      details: errors,
      statusCode: 400,
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Sanitize the input
  req.body.username = username.trim();
  req.body.password = password.trim();

  next();
}; 