import express from 'express'
import { list, listby, create, searchFilter, update, remove } from '../controllers/transactions.js'

const router = express.Router();

router.post('/transactions/search', searchFilter);
router.get('/transactions/:count', list);
router.post('/transactionBy', listby)
router.post('/transactions', create);
router.put('/transactions', update);
router.delete('/transactions', remove);

export default router