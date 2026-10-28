import { Router } from 'express';
import { getMyRatings, rateMenu } from '../controllers/ratingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.use(verifyToken);
router.get('/me', getMyRatings);
router.put('/:menuId', rateMenu);

export default router;
