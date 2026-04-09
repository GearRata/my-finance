import express from "express";
import { authCheck } from "../middleware/authCheck.js";
import upload from "../middleware/multer.js";
import {
  list,
  listAll,
  total,
  read,
  create,
  update,
  remove,
  uploadImages,
} from "../controllers/goals.controllers.js";

const router = express.Router();

router.get("/goals/total", authCheck, total);
router.get("/goals/all", authCheck, listAll);
router.get("/goals/:limit", authCheck, list);
router.get("/goals/:id", authCheck, read);
router.post("/goals", authCheck, upload.array("images"), uploadImages, create);
router.put("/goals/:id", authCheck, update);
router.delete("/goals/:id", authCheck, remove);

export default router;
