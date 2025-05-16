import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI non défini");
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Successful connexion to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server live on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });
