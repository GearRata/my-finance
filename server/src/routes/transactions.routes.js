import express from "express";
import { authCheck } from "../../middleware/authCheck.js";
import {
  list,
  listby,
  create,
  searchFilter,
  update,
  remove,
} from "../controllers/transactions.controllers.js";

const router = express.Router();

router.post("/transactions/search", authCheck, searchFilter);
router.get("/transactions/:count", authCheck, list);
router.post("/transactionBy", authCheck, listby);
router.post("/transactions", authCheck, create);
router.put("/transactions", authCheck, update);
router.delete("/transactions", authCheck, remove);

export default router;
