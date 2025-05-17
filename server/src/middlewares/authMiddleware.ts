// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { IUser } from "../types/User";

export interface AuthenticatedUser extends Partial<IUser> {
  _id: mongoose.Types.ObjectId;
}

// Extends "Request" with optional type AuthenticatedUser
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

// Expected inside token
interface JwtPayload {
  id: string;
  role: "student" | "project_owner" | "superuser";
}

// Calling as requireAuth(["project_owner"]) would only allows "project_owner"
export const requireAuth = (allowedRoles: JwtPayload["role"][]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou mal formé." });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (!decoded.role || !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Accès interdit : rôle insuffisant." });
      }

      req.user = {
        _id: new mongoose.Types.ObjectId(decoded.id),
        role: decoded.role,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }
  };
};