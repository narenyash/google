import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    alerts: [
      {
        id: 'alert-1',
        message: 'Whitefly risk detected near Rampur.',
        channels: ['SMS', 'WhatsApp'],
        status: 'sent'
      }
    ]
  });
});

export default router;
