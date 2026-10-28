import { Router } from 'express';
import {
  createType,
  deleteType,
  getTypes,
  updateType,
} from '../controllers/typeController.js';
import { requireAdmin, verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getTypes);
router.post('/', verifyToken, requireAdmin, createType);
router.patch('/:typeId', verifyToken, requireAdmin, updateType);
router.delete('/:typeId', verifyToken, requireAdmin, deleteType);

export default router;
