import express from "express";
import { authCheck } from "../middleware/authCheck.js";
import upload from "../middleware/multer.js";
import {
  list,
  read,
  create,
  update,
  remove,
} from "../controllers/goals.controllers.js";

const router = express.Router();

router.get("/goals/:count", authCheck, list);
router.get("/goal/:id", authCheck, read);
router.post("/goals", authCheck, upload.single("image"), create);
router.put("/goals/:id", authCheck, update);
router.delete("/goals/:id", authCheck, remove);

export default router;
