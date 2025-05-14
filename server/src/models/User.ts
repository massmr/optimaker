// ===========================
// User.ts
// ===========================
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/User";


const userSchema = new Schema<IUser>({
  role: {
    type: String,
    enum: ["superuser", "student", "project_owner"],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: String,
  classe: {
    type: String,
    enum: ["ADI_1", "ADI_2"],
    required(this: IUser) {
      return this.role === "student";
    }
  },
  preferences: {
    theme_prefered: String,
    themes_liked: [String]
  }
});

export default mongoose.model<IUser>("User", userSchema);