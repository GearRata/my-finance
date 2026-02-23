import express from 'express'
import { list, create, update, remove } from '../controllers/transactions.js'

const router = express.Router();

router.get('/transcations/:count', list);
router.post('/transcations', create);
router.put('/transcations', update);
router.delete('/transcations', remove);

export default router