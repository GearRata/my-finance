import express from "express";
import { authCheck } from "../middleware/authCheck.js";
import {
  userBudget,
  getUserBudget,
  emptyBudget,
  budgetConfirm,
  budgetHistory,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/user/budget", authCheck, userBudget);
router.get("/user/budget", authCheck, getUserBudget);
router.delete("/user/budget/:id", authCheck, emptyBudget);
router.post("/user/budget/confirm", authCheck, budgetConfirm);
router.get("/user/budget/history", authCheck, budgetHistory);

export default router;
