import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IUser } from "../types/User";

interface AuthenticatedRequest extends Request {
  user?: Partial<IUser>;
}

// Middleware générique
export const requireAuth = (allowedRoles: ("student" | "project_owner" | "superuser")[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou mal formé." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Partial<IUser>;

      if (!decoded.role || !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès interdit : rôle insuffisant." });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }
  };
};