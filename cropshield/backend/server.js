import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';

import visionRouter from './routes/vision.js';
import foodSafetyRouter from './routes/foodsafety.js';
import memoryRouter from './routes/memory.js';
import outbreakRouter from './routes/outbreak.js';
import alertsRouter from './routes/alerts.js';
import farmsRouter from './routes/farms.js';
import mcpRouter from './routes/mcp.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'cropshield-backend' });
});

app.use('/api/vision', visionRouter);
app.use('/api/foodsafety', foodSafetyRouter);
app.use('/api/memory', memoryRouter);
app.use('/api/outbreak', outbreakRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/farms', farmsRouter);
app.use('/mcp', mcpRouter);

// Serve frontend for all non-API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`CropShield backend listening on port ${port}`);
  });
}).catch((error) => {
  console.error('Failed to initialize database:', error);
  process.exit(1);
});
