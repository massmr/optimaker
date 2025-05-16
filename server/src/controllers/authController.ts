import { Request, Response } from 'express';
import { logExistingUserOrRegisterNew, generateJwtToken } from '../services/authService';

/**
 * Main controller for handling user login.
 * - If the user exists, validates the password and logs them in.
 * - If the user does not exist, validates them via Mauria and registers them as a student.
 * - If not in Mauria, and not in our database, we throw an error.
 * - Returns a JWT token and user details upon successful login.
 */
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // This is in service
    const user = await logExistingUserOrRegisterNew(email, password);

    // This is in service
    const token = generateJwtToken({ id: user._id.toString(), role: user.role });

    console.log("User logged in:", user.email);
    console.log("Generated JWT Token:", token);
    return res.status(200).json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);

    return handleLoginError(error, res);
  }
};

/**
 * Handles errors that occur during the login process.
 * - Returns appropriate HTTP responses based on the error type.
 */
const handleLoginError = (error: any, res: Response) => {
  if (error.message === 'INVALID_PASSWORD') {
    return res.status(401).json({ message: 'Wrong password.' });
  }

  if (error.message === 'INVALID_MAURIA_CREDENTIALS') {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Default to a 500 Internal Server Error for unexpected issues
  return res.status(500).json({ message: 'Internal server error.' });
}