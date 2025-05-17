import { Document, Types } from "mongoose";

// Used by Mongoose (extends Document)
export interface IProject extends Document {
  title: string;
  description?: string;
  primary_theme: string;
  secondary_themes?: string[];
  places: number;
  difficulty: number;
  ownerId: Types.ObjectId;
}

// Not used by Mongoose
export interface ProjectInput {
  title: string;
  description?: string;
  primary_theme: string;
  secondary_themes?: string[];
  places: number;
  difficulty: number;
  ownerId: Types.ObjectId;
}