/*
  All Users controllers
  dev : Massimo
  Features : 
  - Register a new user
*/

import { Request, Response } from 'express';
import { AuthRequest, AuthenticatedUser } from '../types/Auth';
import { handleUserCreation, handleUserPreferencesUpdate } from '../services/userService';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    const user = await handleUserCreation({ email, password, role });

    return res.status(201).json({
      message: "Successfully registered",
      user: { email: user.email, role: user.role }
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ message: "Email already used" });
    }

    console.error(error);

    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const setUserPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const updatedUser = await handleUserPreferencesUpdate(user._id.toString(), req.body);
    res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
