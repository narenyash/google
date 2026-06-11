import { Router } from 'express';
import { calculateFoodSafety } from '../agents/foodSafetyAgent.js';

const router = Router();

router.post('/', (req, res, next) => {
  try {
    const { affectedPercent, fieldSizeAcres, cropType } = req.body;
    const result = calculateFoodSafety(affectedPercent, fieldSizeAcres, cropType);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
