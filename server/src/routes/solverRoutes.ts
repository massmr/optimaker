import { Router } from "express";
import { runSolver } from "../controllers/solverController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", requireAuth(["superuser"]), runSolver);

export default router;