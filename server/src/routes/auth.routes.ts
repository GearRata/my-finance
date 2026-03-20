import express from "express";
import { authCheck, adminCheck } from "../middleware/authCheck.js";
import {
  register,
  login,
  logout,
  currentUser,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/current-user", authCheck, currentUser);
router.get("/current-admin", authCheck, adminCheck, currentUser);

export default router;
