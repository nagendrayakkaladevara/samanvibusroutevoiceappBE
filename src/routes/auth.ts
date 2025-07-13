import { Router, Request, Response } from 'express';
import { GoogleSheetsService } from '../services/googleSheets';
import { validateLoginRequest } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { LoginRequest, LoginResponse } from '../types';
import { logger } from '../utils/logger';

const router = Router();
const googleSheetsService = new GoogleSheetsService();

// POST /api/auth/login
router.post('/login', 
  validateLoginRequest,
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password }: LoginRequest = req.body;

    logger.info(`Login attempt for user: ${username}`);

    try {
      // Authenticate user against Google Sheets
      const isAuthenticated = await googleSheetsService.authenticateUser(username, password);

      if (!isAuthenticated) {
        logger.warn(`Failed login attempt for user: ${username}`);
        
        const response: LoginResponse = {
          success: false,
          message: 'Invalid username or password'
        };

        return res.status(401).json(response);
      }

      logger.info(`Successful login for user: ${username}`);

      const response: LoginResponse = {
        success: true,
        message: 'Login successful',
        user: {
          username
        }
      };

      return res.status(200).json(response);
    } catch (error) {
      logger.error('Error during login process', error);
      
      const response: LoginResponse = {
        success: false,
        message: 'Authentication service temporarily unavailable. Please try again later.'
      };

      return res.status(503).json(response);
    }
  })
);

// GET /api/auth/verify (basic auth verification endpoint)
router.get('/verify', 
  asyncHandler(async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required'
      });
    }

    try {
      // Basic auth format: "Basic base64(username:password)"
      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      if (!username || !password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid authorization header format'
        });
      }

      // Verify credentials against Google Sheets
      const isAuthenticated = await googleSheetsService.authenticateUser(username, password);

      if (!isAuthenticated) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: {
          username
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
  })
);

export { router as authRoutes }; 