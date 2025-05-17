import Project from '../models/Project';
import { AuthenticatedUser } from "../types/Auth";
import { IProject, ProjectInput } from '../types/Project';
import mongoose from 'mongoose';
import { handleThemeDeletion } from './themeService';

/*
* Handlers
*/
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

export async function handleAllProjectsFetch() {
  return await Project.find().sort({ title: 1 });
}

export async function handleProjectByIdFetch(projectId: string) {
  validateProjectId(projectId);
  return await fetchProjectOrFail(projectId);
}

export async function handleProjectDeletion(user: AuthenticatedUser, projectId: string) {
  validateProjectId(projectId);
  const project = await fetchProjectOrFail(projectId);
  enforceOwnershipOrFail(user, project);
  return deleteProject(projectId);
}

/*
* Operations
*/
async function pushProject(project : ProjectInput) {
  return Project.create(project);
}

function validateProjectId(projectId: string) {
  if (!projectId) {
    throw { status: 400, message: "L'identifiant du projet est requis." };
  }
}

function enforceOwnershipOrFail(user: AuthenticatedUser, project: any) {
  if (!project.ownerId.equals(user._id)) {
    throw { status: 403, message: "Accès interdit. Vous n'êtes pas propriétaire de ce projet." };
  }
}

async function deleteProject(projectId: string) {
  return await Project.findByIdAndDelete(projectId);
}

async function fetchProjectOrFail(projectId: string) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw { status: 404, message: "Projet non trouvé." };
  }
  return project;
}