import express from "express";
import { list, create, update, remove } from "../controllers/accounts.js";

const router = express.Router();

router.get('/accounts', list);
router.post('/accounts', create);
router.put('/accounts/:id', update);
router.delete('/accounts/:id', remove);

export default router;