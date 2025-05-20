import { Schema, model, Types } from "mongoose";
import { IProject } from "../types/Project";

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: String,
  primary_theme: { type: String, required: true },
  secondary_themes: [String],
  places: { type: Number, required: true },
  difficulty: { type: Number, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const ProjectModel = model<IProject>("Project", projectSchema);
export default ProjectModel;
