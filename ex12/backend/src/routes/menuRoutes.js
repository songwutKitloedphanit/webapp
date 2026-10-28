import { Router } from 'express';
import {
  createMenu,
  deleteMenu,
  getMenus,
  updateMenu,
} from '../controllers/menuController.js';
import { requireAdmin, verifyToken } from '../middleware/auth.js';

const router = Router();

router.get('/', getMenus);
router.post('/', verifyToken, requireAdmin, createMenu);
router.patch('/:menuId', verifyToken, requireAdmin, updateMenu);
router.delete('/:menuId', verifyToken, requireAdmin, deleteMenu);

export default router;
