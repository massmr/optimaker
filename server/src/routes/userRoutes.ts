/*
  routes for user-related operations
  dev : Massimo
*/

import express from 'express';
import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');
import { registerUser, setUserPreferences } from '../controllers/userController'
import { registerValidator } from '../middlewares/userMiddleware';
import { requireAuth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post(
  '/register',
  registerValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  registerUser
);
router.put("/preferences", requireAuth(["student"]), setUserPreferences);

export default router;