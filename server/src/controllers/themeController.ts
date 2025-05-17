import { Request, Response } from "express";
import Theme from "../models/Theme";
import { AuthRequest } from "../types/Auth";
import { handleThemeCreation, handleThemeDeletion } from "../services/themeService";

export const createTheme = async (req: AuthRequest, res: Response) => {
  try {
    const theme = await handleThemeCreation(req.body.name);
    res.status(201).json({ theme });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const getAllThemes = async (_req: Request, res: Response) => {
  try {
    const themes = await Theme.find().sort("name");
    res.json({ themes });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des thématiques.", error });
  }
};

export const getTheme = async (_req: Request, res: Response) => {
    res.status(501).json({ message: "getTheme non implémenté." });
}

export const deleteTheme = async (req: AuthRequest, res: Response) => {
  try {
    const name = req.body.name;
    await handleThemeDeletion(name);
    res.status(200).json({ message: "Thématique supprimée." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la thématique.", error });
  }
};