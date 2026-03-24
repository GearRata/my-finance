import express from "express";
import { authCheck } from "../middleware/authCheck.js";
import {
  list,
  pagination,
  count,
  listby,
  create,
  searchFilter,
  update,
  remove,
  total,
  analytics,
} from "../controllers/transactions.controllers.js";

const router = express.Router();

router.get("/transactions/count", authCheck, count);
router.get("/transactions/total", authCheck, total);
router.get("/transactions/analytics", authCheck, analytics);
router.get("/transactions/", authCheck, pagination);
router.get("/transactions/:limit", authCheck, list);
router.post("/transactions", authCheck, create);
router.post("/transactions/search", authCheck, searchFilter);
router.post("/transactionBy", authCheck, listby);
router.put("/transactions/:id", authCheck, update);
router.delete("/transactions/:id", authCheck, remove);

export default router;
