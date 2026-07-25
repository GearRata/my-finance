import express from "express";
import rateLimit from "express-rate-limit";
import { authCheck, adminCheck } from "../middleware/authCheck.js";
import {
  register,
  login,
  logout,
  currentUser,
} from "../controllers/auth.controllers.js";

const router = express.Router();

// Rate limit: จำกัด 10 ครั้งต่อ 15 นาที สำหรับ login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    status: "fail",
    message: "Too many attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/current-user", authCheck, currentUser);
router.get("/current-admin", authCheck, adminCheck, currentUser);

export default router;
