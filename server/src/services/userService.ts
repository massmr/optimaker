import User from '../models/User';
import bcrypt from 'bcrypt';

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function pushUser({ email, passwordHash, role }: { email: string, passwordHash: string, role: string }) {
  return User.create({ email, passwordHash, role, });
}

export async function handleUserCreation({ email, password, role }: { email: string, password: string, role: string }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  const passwordHash = await hashPassword(password);

  return pushUser({ email, passwordHash, role });
}