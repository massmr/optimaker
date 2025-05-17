import { Response } from "express";
import { AuthenticatedUser, AuthRequest } from "../types/Auth";
import { handleProjectCreation } from "../services/projectService";

export const createProject = async(req: AuthRequest, res: Response) => {
    try {

        const user = req.user as AuthenticatedUser;
        
        const project = await handleProjectCreation(user, req.body)

        res.status(201).json({ project });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la création du projet.", error });
    }
}