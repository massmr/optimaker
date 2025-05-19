import { Response } from "express";
import { AuthRequest, AuthenticatedUser } from "../types/Auth";
import { handleAffinityCreation, handleAffinityUpdate } from "../services/affinityService";

/* === Création d'une affinité === */
export const createAffinity = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const { projectId, affinity } = req.body;

    const result = await handleAffinityCreation(user._id.toString(), projectId, affinity);
    res.status(201).json({ affinity: result });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Erreur lors de la création." });
  }
};

/* === Mise à jour d'une affinité === */
export const updateAffinity = async (req: AuthRequest, res: Response) => {
  try {
    const affinityId = req.params.id;
    console.log(affinityId)
    const { affinity } = req.body;

    const result = await handleAffinityUpdate(affinityId, affinity);
    res.status(200).json({ affinity: result });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message || "Erreur lors de la mise à jour." });
  }
};