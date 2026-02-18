import express from "express"
import { list, create, update, remove } from "../controllers/goals.js"

const router = express.Router();

router.get('/goals', list);
router.post('/goals', create);
router.put('/goals/:id', update);
router.delete('/goals/:id', remove);

export default router;