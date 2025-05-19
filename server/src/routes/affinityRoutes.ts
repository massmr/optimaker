import express from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { createAffinity, updateAffinity } from "../controllers/affinityController";

const router = express.Router();

router.post("/create", requireAuth(["student"]), createAffinity);
router.put("/:id", requireAuth(["student"]), updateAffinity);

export default router;