import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import analyzeRouter from './routes/analyze.js';
import alertsRouter from './routes/alerts.js';
import farmsRouter from './routes/farms.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'cropshield-backend' });
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/farms', farmsRouter);
app.use('/api/alerts', alertsRouter);

app.listen(port, () => {
  console.log(`CropShield backend listening on port ${port}`);
});
