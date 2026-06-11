import { Router } from 'express';
import { calculateFoodSafety } from '../agents/foodSafetyAgent.js';
import { queryMemory } from '../agents/villageMemoryAgent.js';
import { assessSpread } from '../agents/outbreakAgent.js';
import { sendAlerts } from '../agents/alertAgent.js';
import { analyzeImage } from '../agents/visionAgent.js';
import Farm from '../models/Farm.js';
import Alert from '../models/Alert.js';

const router = Router();

const TOOLS = [
  {
    name: 'analyzePhoto',
    description: 'Analyze a crop image for disease detection. Send base64 encoded image string.',
    inputSchema: {
      type: 'object',
      properties: {
        imageBase64: { type: 'string', description: 'Base64 encoded image data' },
        cropType: { type: 'string', description: 'Crop type: tomato, maize, wheat, rice, onion' }
      },
      required: ['imageBase64', 'cropType']
    }
  },
  {
    name: 'checkFoodSafety',
    description: 'Calculate pesticide savings and food safety metrics for a crop field',
    inputSchema: {
      type: 'object',
      properties: {
        affectedPercent: { type: 'number', description: 'Percentage of crop affected 0-100' },
        fieldSizeAcres: { type: 'number', description: 'Field size in acres' },
        cropType: { type: 'string', description: 'Crop type: tomato, maize, wheat, rice, onion' }
      },
      required: ['affectedPercent', 'fieldSizeAcres', 'cropType']
    }
  },
  {
    name: 'queryVillageMemory',
    description: 'Search historical pest incidents in the village memory database and save a new incident',
    inputSchema: {
      type: 'object',
      properties: {
        pestName: { type: 'string', description: 'Name of the pest or disease' },
        district: { type: 'string', description: 'District name' },
        incidentData: { type: 'object', description: 'Incident data object to save' }
      },
      required: ['pestName', 'district', 'incidentData']
    }
  },
  {
    name: 'assessOutbreak',
    description: 'Assess how far a pest can spread using wind and weather data. Returns at-risk farm zones.',
    inputSchema: {
      type: 'object',
      properties: {
        pestName: { type: 'string', description: 'Name of the pest' },
        spreadable: { type: 'boolean', description: 'Whether this pest can spread' },
        latitude: { type: 'number', description: 'Farm latitude coordinate' },
        longitude: { type: 'number', description: 'Farm longitude coordinate' },
        severity: { type: 'string', description: 'Severity: LOW, MEDIUM, or HIGH' },
        cropType: { type: 'string', description: 'Type of crop affected' }
      },
      required: ['pestName', 'spreadable', 'latitude', 'longitude', 'severity', 'cropType']
    }
  },
  {
    name: 'sendAlerts',
    description: 'Send Kannada language SMS alerts to farms in red, orange, and yellow risk zones',
    inputSchema: {
      type: 'object',
      properties: {
        redZoneFarms: { type: 'array', items: { type: 'object' }, description: 'Farms at risk within 24 hours' },
        orangeZoneFarms: { type: 'array', items: { type: 'object' }, description: 'Farms at risk within 48 hours' },
        yellowZoneFarms: { type: 'array', items: { type: 'object' }, description: 'Farms at risk within 72 hours' },
        pestName: { type: 'string', description: 'Pest name' },
        diseaseName: { type: 'string', description: 'Disease name' },
        severity: { type: 'string', description: 'Severity level' },
        originFarmId: { type: 'string', description: 'ID of the source farm' }
      },
      required: ['redZoneFarms', 'orangeZoneFarms', 'yellowZoneFarms', 'pestName', 'diseaseName', 'severity', 'originFarmId']
    }
  },
  {
    name: 'getAllFarms',
    description: 'Get list of all registered farms in the system',
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'getAllAlerts',
    description: 'Get the 50 most recent alerts sent to farms',
    inputSchema: { type: 'object', properties: {} }
  }
];

async function callTool(name, args) {
  switch (name) {
    case 'analyzePhoto':
      return await analyzeImage(args.imageBase64, args.cropType);

    case 'checkFoodSafety':
      return calculateFoodSafety(args.affectedPercent, args.fieldSizeAcres, args.cropType);

    case 'queryVillageMemory':
      return await queryMemory(args.pestName, args.district, args.incidentData || {});

    case 'assessOutbreak':
      return await assessSpread(args.pestName, args.spreadable, args.latitude, args.longitude, args.severity, args.cropType);

    case 'sendAlerts':
      return await sendAlerts(
        args.redZoneFarms || [], args.orangeZoneFarms || [], args.yellowZoneFarms || [],
        args.pestName, args.diseaseName, args.severity, args.originFarmId
      );

    case 'getAllFarms':
      return await Farm.find().limit(100).lean();

    case 'getAllAlerts':
      return await Alert.find().sort({ sentAt: -1 }).limit(50).lean();

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// MCP JSON-RPC handler
router.post('/', async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  res.setHeader('Content-Type', 'application/json');

  try {
    let result;

    if (method === 'initialize') {
      result = {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'cropshield', version: '1.0.0' }
      };
    } else if (method === 'notifications/initialized') {
      return res.status(204).end();
    } else if (method === 'ping') {
      result = {};
    } else if (method === 'tools/list') {
      result = { tools: TOOLS };
    } else if (method === 'tools/call') {
      const toolResult = await callTool(params.name, params.arguments || {});
      result = {
        content: [{ type: 'text', text: JSON.stringify(toolResult, null, 2) }],
        isError: false
      };
    } else {
      return res.json({ jsonrpc: '2.0', error: { code: -32601, message: 'Method not found' }, id });
    }

    res.json({ jsonrpc: '2.0', result, id });
  } catch (err) {
    console.error('MCP tool error:', err.message);
    res.json({
      jsonrpc: '2.0',
      error: { code: -32000, message: err.message },
      id
    });
  }
});

// GET for MCP discovery ping
router.get('/', (_req, res) => {
  res.json({ name: 'cropshield', version: '1.0.0', tools: TOOLS.map(t => t.name) });
});

export default router;
