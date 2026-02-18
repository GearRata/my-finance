import express from "express";
import { register, login, currentUser } from "../controllers/auth.js"


const router = express.Router();

// @ENDPOINT http://localhost:5000/api/auth
router.post('/register', register);
router.post('/login', login);
router.post('/current-user', currentUser);

export default router;