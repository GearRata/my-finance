import express from 'express'
import { authCheck, adminCheck } from '../../middleware/authCheck.js';
import { listUsers } from '../controllers/user.js';

const router = express.Router()


router.get('/users', authCheck, adminCheck, listUsers);
// router.post('/change-status');
// router.post('/change-role');

// router.post('/user/budget');
// router.get('/user/budget');
// router.delete('/user/budget');
// router.post('/user/budget/confirm');
// router.get('/user/budget/history');

export default router
