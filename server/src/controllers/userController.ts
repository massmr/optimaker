/*
  All Users controllers
  dev : Massimo
  Features : 
  - Register a new user
*/

import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';

export const registerUser = async (req: Request, res: Response) => {
  try {
  const { email, password, role, name } = req.body;

    // Project owners are in fact the only ones who can register
    // indeed, students are created with their aurion account
    // and superusers are created by the admin
    if (role !== "project_owner") {
      return res.status(403).json({ message: "Projects owner only can register" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already used" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      passwordHash,
      role,
      name
    });

    return res.status(201).json({
      message: "Successfully registered",
      user: { email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
