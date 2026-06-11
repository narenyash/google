import { Router } from 'express';
import multer from 'multer';
import { analyzeImage } from '../agents/visionAgent.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('photo'), async (req, res, next) => {
  try {
    const imageBase64 = req.file.buffer.toString('base64');
    const cropType = req.body.cropType || 'unknown';
    const result = await analyzeImage(imageBase64, cropType);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
