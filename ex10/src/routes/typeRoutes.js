import { Router } from 'express';
import {
  createType,
  deleteType,
  getTypes,
  updateType,
} from '../controllers/typeController.js';

const router = Router();

router.get('/', getTypes);
router.post('/', createType);
router.patch('/:typeId', updateType);
router.delete('/:typeId', deleteType);

export default router;
