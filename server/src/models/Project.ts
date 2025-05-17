import mongoose, { Schema } from "mongoose";
import { IProject } from "../types/Project";

// ===========================
// Project.ts
// ===========================

const projectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true
  },
  description: String,
  primary_theme: {
    type: String,
    required: true
  },
  secondary_themes: [String],
  places: {
    type: Number,
    min: 1,
    required: true
  },
  difficulty: {
    type: Number,
    min: 0,
    max: 4,
    default: 2
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export default mongoose.model<IProject>("Project", projectSchema);