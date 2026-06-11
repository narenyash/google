import { Router } from 'express';
import Farm from '../models/Farm.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const farms = await Farm.find();
    res.json({ farms });
  } catch (err) {
    next(err);
  }
});

router.get('/near', async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = parseFloat(req.query.radius) || 15;

    const farms = await Farm.find({
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radius * 1000
        }
      }
    });

    res.json({ farms });
  } catch (err) {
    next(err);
  }
});

export default router;
