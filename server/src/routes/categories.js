import express from "express";
import { create, list, update, remove } from "../controllers/categories.js"

const router = express.Router();

// @ENDPOINT http://localhost:5000/api/categories
router.get('/categories', list);
router.post('/categories', create);
router.put('/categories/:id', update);
router.delete('/categories/:id', remove);

export default router;