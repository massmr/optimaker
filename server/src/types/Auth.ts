import mongoose from "mongoose";
import { Request } from "express";
import { IUser } from "./User";

export interface AuthenticatedUser extends Partial<IUser> {
  _id: mongoose.Types.ObjectId;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}