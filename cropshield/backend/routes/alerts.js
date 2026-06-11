import { Router } from 'express';
import { sendAlerts } from '../agents/alertAgent.js';
import Alert from '../models/Alert.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { redZoneFarms, orangeZoneFarms, yellowZoneFarms, pestName, diseaseName, severity, originFarmId } = req.body;
    const result = await sendAlerts(redZoneFarms, orangeZoneFarms, yellowZoneFarms, pestName, diseaseName, severity, originFarmId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const alerts = await Alert.find().sort({ sentAt: -1 }).limit(50);
    res.json({ alerts });
  } catch (err) {
    next(err);
  }
});

export default router;
