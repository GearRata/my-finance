import express from "express";
import { authCheck, adminCheck } from "../middleware/authCheck.js";
import {
  listUsers,
  changeStatus,
  changeRole,
} from "../controllers/admin.controllers.js";
const router = express.Router();

router.get("/users", authCheck, adminCheck, listUsers);
router.post("/change-status", authCheck, adminCheck, changeStatus);
router.post("/change-role", authCheck, adminCheck, changeRole);

export default router;
