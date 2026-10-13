import { Router } from 'express';
import {
  createMenu,
  deleteMenu,
  getMenus,
  updateMenu,
} from '../controllers/menuController.js';

const router = Router();

router.get('/', getMenus);
router.post('/', createMenu);
router.patch('/:menuId', updateMenu);
router.delete('/:menuId', deleteMenu);

export default router;
