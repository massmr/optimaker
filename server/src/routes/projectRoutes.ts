import express from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createProject } from "../controllers/projectController";

const router = express.Router();

router.post("/create", requireAuth(["project_owner"]), createProject);

export default router;