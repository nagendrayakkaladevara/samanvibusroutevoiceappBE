import { Router, Request, Response } from 'express';
import { validateLoginRequest } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { LoginRequest, LoginResponse } from '../types';
import { authenticateUser } from '../services/database';
import { logger } from '../utils/logger';

const router = Router();

router.post('/login',
  validateLoginRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password }: LoginRequest = req.body;
    logger.info(`Login attempt for user: ${username}`);

    const isAuthenticated = await authenticateUser(username, password);
    if (!isAuthenticated) {
      logger.warn(`Failed login attempt for user: ${username}`);
      const response: LoginResponse = { success: false, message: 'Invalid username or password' };
      return res.status(401).json(response);
    }

    logger.info(`Successful login for user: ${username}`);
    const response: LoginResponse = { success: true, message: 'Login successful', user: { username } };
    return res.status(200).json(response);
  })
);

export { router as authRoutes };
