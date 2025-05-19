import mongoose from 'mongoose';

export interface IAffinity extends Document {
  studentId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  affinity: number;
}