// ===========================
// Affinity.ts
// ===========================

import mongoose, { Schema } from 'mongoose';
import { IAffinity } from '../types/Affinity';

const affinitySchema = new Schema<IAffinity>({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  affinity: {
    type: Number,
    min: 0,
    max: 4,
    required: true
  }
});

export default mongoose.model<IAffinity>("Affinity", affinitySchema);