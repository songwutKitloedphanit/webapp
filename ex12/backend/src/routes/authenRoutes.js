import { Router } from 'express';
import { home, login, register } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/home', verifyToken, home);

export default router;
