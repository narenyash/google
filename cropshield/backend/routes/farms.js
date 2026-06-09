import { Router } from 'express';

const router = Router();

const farms = [
  {
    id: 'farm-1',
    name: 'Rampur East Field',
    village: 'Rampur',
    crop: 'Tomato',
    location: { lat: 26.9124, lng: 75.7873 }
  }
];

router.get('/', (_req, res) => {
  res.json({ farms });
});

export default router;
