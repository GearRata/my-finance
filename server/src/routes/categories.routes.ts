import express from "express";
import { authCheck } from "../middleware/authCheck.js";
import {
  create,
  list,
  update,
  remove,
} from "../controllers/categories.controllers.js";

const router = express.Router();

// @ENDPOINT http://localhost:5000/api/categories
router.get("/categories", authCheck, list);
router.post("/categories", authCheck, create);
router.put("/categories/:id", authCheck, update);
router.delete("/categories/:id", authCheck, remove);

export default router;
