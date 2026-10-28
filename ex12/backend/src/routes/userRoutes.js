import { Router } from 'express';
import { getUsers, updateUserRole } from '../controllers/userController.js';
import { requireAdmin, verifyToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken, requireAdmin);
router.get('/', getUsers);
router.patch('/:userId/role', updateUserRole);

export default router;
