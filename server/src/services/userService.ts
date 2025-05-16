import User from '../models/User';
import bcrypt from 'bcrypt';

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function createUser({ email, passwordHash, role, name }: { email: string, passwordHash: string, role: string, name?: string }) {
  return User.create({ email, passwordHash, role, name });
}

export async function createProjectOwner({ email, password, name }: { email: string, password: string, name?: string }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }
  const passwordHash = await hashPassword(password);
  return createUser({ email, passwordHash, role: 'project_owner', name });
}