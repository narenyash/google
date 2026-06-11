import { Router } from 'express';
import { assessSpread } from '../agents/outbreakAgent.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { pestName, spreadable, latitude, longitude, severity, cropType } = req.body;
    const result = await assessSpread(pestName, spreadable, latitude, longitude, severity, cropType);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
