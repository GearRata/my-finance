import express from "express";
import { authCheck } from "../middleware/authCheck.js";
import {
  list,
  create,
  update,
  remove,
} from "../controllers/accounts.controllers.js";

const router = express.Router();

router.get("/accounts", authCheck, list);
router.post("/accounts", authCheck, create);
router.put("/accounts/:id", authCheck, update);
router.delete("/accounts/:id", authCheck, remove);

export default router;
