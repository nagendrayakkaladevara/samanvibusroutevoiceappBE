import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { validateLoginRequest } from '../middleware/validation';
import { createUser, deleteUser, getUsers } from '../services/database';
import { logger } from '../utils/logger';

const router = Router();

router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const users = await getUsers();
  res.status(200).json({ users });
}));

router.post('/', validateLoginRequest, asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  await createUser(username, password);
  logger.info(`Created user: ${username}`);
  res.status(201).json({ success: true });
}));

router.delete('/:username', asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  await deleteUser(username);
  logger.info(`Deleted user: ${username}`);
  res.status(200).json({ success: true });
}));

export { router as userRoutes };
