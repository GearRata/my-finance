import express from "express"
import upload from "../../middleware/multer.js";
import { list, read, create, update, remove } from "../controllers/goals.js"


const router = express.Router();

router.get('/goals/:count', list);
router.get('/goal/:id', read)
router.post('/goals', upload.single('image'), create);
router.put('/goals/:id', update);
router.delete('/goals/:id', remove);

export default router;