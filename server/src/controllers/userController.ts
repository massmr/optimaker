/*
  All Users controllers
  dev : Massimo
  Features : 
  - Register a new user
*/

import { Request, Response } from 'express';
import { createProjectOwner } from '../services/userService';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role, name } = req.body;
    const user = await createProjectOwner({ email, password, name });
    return res.status(201).json({
      message: "Successfully registered",
      user: { email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: "Email already used" });
    }
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};