import { Router } from "express";
import {
  getSessionStatus,
  register,
  login
} from "../controllers/sessions.controller.js";

const router = Router();

router.get("/", getSessionStatus);
router.post("/register", register);
router.post("/login", login);

export default router;