import { Router } from 'express';
import { alertAgent } from '../agents/alertAgent.js';
import { foodSafetyAgent } from '../agents/foodSafetyAgent.js';
import { outbreakAgent } from '../agents/outbreakAgent.js';
import { villageMemoryAgent } from '../agents/villageMemoryAgent.js';
import { visionAgent } from '../agents/visionAgent.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const farm = req.body.farm || 'Rampur East Field';
    const village = req.body.village || 'Rampur';
    const vision = await visionAgent(req.body);
    const safety = await foodSafetyAgent(vision);
    const memory = await villageMemoryAgent(vision);
    const outbreak = await outbreakAgent(vision);
    const alerts = await alertAgent({ pest: vision.pest, village });

    res.json({
      incidentId: `INC-${Date.now()}`,
      farm,
      crop: vision.crop,
      detection: vision,
      safety,
      memory,
      sprayZones: outbreak.sprayZones,
      spread: outbreak.spread,
      alerts
    });
  } catch (error) {
    next(error);
  }
});

export default router;
