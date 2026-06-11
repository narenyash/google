import { Router } from 'express';
import { queryMemory } from '../agents/villageMemoryAgent.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { pestName, district, incidentData } = req.body;
    const result = await queryMemory(pestName, district, incidentData);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
