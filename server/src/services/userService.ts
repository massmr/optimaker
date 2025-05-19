import User from '../models/User';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

/*
* Generic work
*/
export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function pushUser({ email, passwordHash, role }: { email: string, passwordHash: string, role: string }) {
  return User.create({ email, passwordHash, role, });
}

function validatePreferences(preferences: any) {
  if (!preferences.theme_prefered || !Array.isArray(preferences.themes_liked)) {
    throw { status: 400, message: "Préférences invalides ou incomplètes." };
  }
}

async function applyUserPreferences(userId: string, preferences: {
  theme_prefered: string;
  themes_liked: string[];
}) {
  return await User.findByIdAndUpdate(
    userId,
    { preferences },
    { new: true }
  );
}

/*
* Handlers
*/
export async function handleUserCreation({ email, password, role }: { email: string, password: string, role: string }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('EMAIL_EXISTS');
  }

  const passwordHash = await hashPassword(password);

  return pushUser({ email, passwordHash, role });
}

export async function handleUserPreferencesUpdate(userId: string, preferences: {
  theme_prefered: string;
  themes_liked: string[];
}) {
  validatePreferences(preferences);
  return await applyUserPreferences(userId, preferences);
}