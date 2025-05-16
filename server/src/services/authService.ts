import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';
import { 
    findUserByEmail, 
    handleUserCreation 
} from '../services/userService';
dotenv.config();

/**
 * Handles validation of a user via Mauria.
 * - If the user is validated, prepares their data for registration.
 * - Throws an error if the validation fails.
 */
export async function logExistingUserOrRegisterNew(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (user) {
    // Validate the password for the existing user
    await ensurePasswordIsValid(password, user.passwordHash);
    return user;

  } else {
    // Validate the user via Mauria and prepare their data
    const isStudent = await validateWithMauria(email, password);
    if (isStudent) {
      return await handleUserCreation({ email, password, role: 'student' });
    }
    throw new Error('INVALID_MAURIA_CREDENTIALS');
  }
}

/*
* JWT features
*/

export function generateJwtToken(user: { id: string; role: string }) {

    const secret = process.env.JWT_SECRET as string;
    const payload = { id: user.id, role: user.role };
    const expiresIn = '2d';

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }

    try {
        const token = jwt.sign(payload, secret, { expiresIn });
        return token;
    } catch (error) {
        console.error('Error generating JWT token:', error);
        throw new Error('Error generating JWT token');
    }
}

/*
* Password features
*/

 //Validates the user's password.
 //Throws an error if the password is invalid.
export async function ensurePasswordIsValid(password: string, passwordHash: string) {
  const isPasswordValid = await verifyPassword(password, passwordHash);
  if (!isPasswordValid) {
    throw new Error('INVALID_PASSWORD');
  }
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

/*
* Mauria features
*/

// Each student logging-in for the first time must be verified only ONCE in Mauria
// If Mauria recognize the student, we create a new user in our database
// This process should be transparent for the student

/*
 * CAUTION :
 * The Mauria API behaves in a non-standard way:
 * - If the provided email and password are correct and the user exists in Aurion,
 *   the API responds with a 302 status code and the response body contains "Found".
 * - If the provided email is correct but the password is incorrect,
 *   the API responds with a 200 status code and the response body contains "OK".
 * - Any other response indicates that the user is not recognized or an error occurred.
 * 
 * This behavior is unconventional because a 302 status code is typically used for redirections,
 * not for indicating successful authentication. The response body ("Found" or "OK") is the only
 * reliable way to determine the outcome of the request.
 */
export async function validateWithMauria(email: string, password: string) {
  try {
    const response = await axios.post(
      'https://mauriaapi.fly.dev/login',
      { username: email, password },
      { 
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        validateStatus: (status) => status === 200 || status === 302,
      }
    )
    console.log('Mauria Response:', response.status, response.headers, response.data);

    if (response.data === "Found") {
      console.log('User is a student in Aurion');
      return true;
    }
    console.log('User is not a student in Aurion');
    return false;
  } catch (error) {
    console.error('Mauria validation failed:', error);
    return false;
  }
}