/*
    routes for user-related operations
    dev : Massimo
*/

// Packages
import express from 'express';
import { Request, Response, NextFunction } from 'express';
const { validationResult } = require('express-validator');

// Import work logic
import { registerUser } from '../controllers/userController'
import { registerValidator } from '../middlewares/userMiddleware';

const router: express.Router = express.Router();

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

export default router;