import { Router } from 'express';
import multer from 'multer';
import { analyzeImage } from '../agents/visionAgent.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const cropType = req.body.cropType || 'unknown';
    const mimeType = req.file.mimetype || 'image/jpeg';

    console.log(`Analyzing ${cropType} image, size: ${req.file.size} bytes, type: ${mimeType}`);

    const result = await analyzeImage(imageBase64, cropType, mimeType);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
