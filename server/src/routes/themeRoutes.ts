import express from "express";
import { createTheme, deleteTheme, getAllThemes, getTheme } from "../controllers/themeController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

// Super user controllers
router.post("/create", requireAuth(["superuser"]), createTheme);
router.delete("/delete", requireAuth(["superuser"]), deleteTheme);

router.get("/getAll", getAllThemes)
router.get("/get/:id", getTheme);

export default router;