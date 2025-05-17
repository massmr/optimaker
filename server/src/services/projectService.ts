import Project from '../models/Project';
import { AuthenticatedUser } from "../types/Auth";
import { ProjectInput } from '../types/Project';
import mongoose from 'mongoose';

export async function handleProjectCreation(user: AuthenticatedUser, body: Partial<ProjectInput>) {
  const { title, description, primary_theme, secondary_themes, places, difficulty } = body;

  if (!title || !primary_theme || places === undefined) {
    throw new Error("Requested fields missing");
  }

  const projectData: ProjectInput = {
    title,
    description,
    primary_theme,
    secondary_themes,
    places,
    difficulty: difficulty ?? 2,
    ownerId: new mongoose.Types.ObjectId(user._id),
  };

  return await pushProject(projectData)
}

async function pushProject(project : ProjectInput) {
  return Project.create(project);
}