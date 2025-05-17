import { Request, Response } from "express";
import mongoose from "mongoose";
import { IUser } from "../types/User";
import { pushProject } from "../services/projectService";

export interface AuthenticatedUser extends Partial<IUser> {
  _id: mongoose.Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export const createProject = async(req: AuthRequest, res: Response) => {
    try {
        const { title, description, primary_theme, secondary_themes, places, difficulty } = req.body;

        const user = req.user as AuthenticatedUser;
        
        if (!user || user.role !== "project_owner") {
        return res.status(403).json({ message: "Accès interdit." });
        }

        const project = await pushProject({
        title,
        description,
        primary_theme,
        secondary_themes,
        places,
        difficulty,
        ownerId: user._id.toString()
        });

        res.status(201).json({ project });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la création du projet.", error });
    }
}