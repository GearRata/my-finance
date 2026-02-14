import express from "express";
import { create, list, remove } from "../controllers/categories.js"

const router = express.Router();

router.post('/categories', create);
router.get('/categories', list);
router.delete('/categories/:id', remove);

export default router;