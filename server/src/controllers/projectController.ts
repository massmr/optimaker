import { Request, Response } from "express";
import { AuthenticatedUser, AuthRequest } from "../types/Auth";
import { handleProjectCreation, handleProjectDeletion, handleAllProjectsFetch, handleProjectByIdFetch } from "../services/projectService";

export const createProject = async(req: AuthRequest, res: Response) => {
    try {
        const user = req.user as AuthenticatedUser;
        const project = await handleProjectCreation(user, req.body)
        res.status(201).json({ project });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la création du projet.", error });
    }
}

export const deleteProject = async(req: AuthRequest, res: Response) => {
    try {
        const user = req.user as AuthenticatedUser;
        const projectId = req.params.id;
        const result = await handleProjectDeletion(user, projectId);
        res.status(200).json({ message: "Le projet a été supprimé", result});
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la suppression du projet.", error });
    }
}

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await handleAllProjectsFetch();
    res.status(200).json({ projects });
  } catch (error: any) {
    res.status(500).json({ message: "Erreur serveur lors de la récupération des projets.", error });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await handleProjectByIdFetch(req.params.id);
    res.status(200).json({ project });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
