import express from "express";
import { signup, login, logout, authCheck } from "../controllers/auth.controller";
import { protectRoute } from "../middleware/protectRoute";

const router = express.Router();

router.get("/me", protectRoute, authCheck);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;