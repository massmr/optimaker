import mongoose, { Document, Schema } from "mongoose";
import { ISolverSnapshot, IAssignment } from "../types/SolverSnapshot";

export interface SolverSnapshotDocument extends ISolverSnapshot, Document {}

const assignmentSchema = new Schema<IAssignment>({
  studentId: { type: String, required: true },
  projectId: { type: String, required: true },
}, { _id: false });

const solverSnapshotSchema = new Schema<SolverSnapshotDocument>({
  createdAt: { type: Date, default: Date.now },
  profile: { type: String, required: true },
  result: { type: [assignmentSchema], required: true },
  studentCount: { type: Number, required: true },
  projectCount: { type: Number, required: true },
  inputHash: { type: String },
});

export default mongoose.model<SolverSnapshotDocument>(
  "SolverSnapshot",
  solverSnapshotSchema
);
