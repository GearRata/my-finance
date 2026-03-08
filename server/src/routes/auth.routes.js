import express from "express";
import { authCheck, adminCheck } from "../../middleware/authCheck.js";
import {
  register,
  login,
  currentUser,
} from "../controllers/auth.controllers.js";

const router = express.Router();

// @ENDPOINT http://localhost:5000/api/auth
router.post("/register", register);
router.post("/login", login);
router.post("/current-user", authCheck, currentUser);
router.post("/current-admin", authCheck, adminCheck, currentUser);

export default router;
