import express from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createProject, deleteProject, getAllProjects, getProjectById } from "../controllers/projectController";

const router = express.Router();

//Project owners features
router.post("/create", requireAuth(["project_owner"]), createProject);
router.delete("/:id", requireAuth(["project_owner"]), deleteProject)
router.get("/:id", requireAuth(["student", "project_owner", "superuser"]), getProjectById);
router.get("/", getAllProjects);

export default router;