import mongoose from "mongoose";

export interface IProject extends Document {
  title: string;
  description?: string;
  primary_theme: string;
  secondary_themes?: string[];
  places: number;
  difficulty: number;
  ownerId: mongoose.Types.ObjectId;
}