import mongoose, { Schema, Document } from "mongoose";
import { ITheme } from "../types/Theme";

const themeSchema = new Schema<ITheme>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

export default mongoose.model<ITheme>("Theme", themeSchema);