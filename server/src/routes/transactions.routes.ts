import express from "express";
import { authCheck } from "../middleware/authCheck.js";
import upload from "../middleware/multer.js";
import {
  list,
  pagination,
  listby,
  create,
  searchFilter,
  update,
  remove,
  summary,
  analytics,
  scanslip,
} from "../controllers/transactions.controllers.js";

const router = express.Router();
router.get("/transactions/summary", authCheck, summary);
router.get("/transactions/analytics", authCheck, analytics);
router.get("/transactions/", authCheck, pagination);
router.get("/transactions/:limit", authCheck, list);
router.post("/transactions/scanslip", upload.single("file"), scanslip);
router.post("/transactions", authCheck, create);
router.post("/transactions/search", authCheck, searchFilter);
router.post("/transactionBy", authCheck, listby);
router.put("/transactions/:id", authCheck, update);
router.delete("/transactions/:id", authCheck, remove);

export default router;
