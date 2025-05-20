import { handleSolverOperations } from "../services/solverService";
import { AuthRequest, AuthenticatedUser } from "../types/Auth";
import { Request, Response } from "express";

export async function runSolver(req: AuthRequest, res: Response) {
  try {
    const data = await handleSolverOperations();
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erreur lors de la génération du JSON solver:", err);
    return res.status(500).json({ error: "Erreur interne serveur" });
  }
}