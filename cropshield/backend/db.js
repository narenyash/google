import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Connect to MongoDB and create collections
 */
export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ MongoDB connected successfully');
    
    // Create collections
    await createCollections();
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

/**
 * Create all required collections
 */
export async function createCollections() {
  const db = mongoose.connection;
  
  const collections = [
    {
      name: 'farms',
      schema: {
        name: { bsonType: 'string', description: 'Farm name' },
        village: { bsonType: 'string', description: 'Village name' },
        crop: { bsonType: 'string', description: 'Crop type' },
        location: {
          bsonType: 'object',
          properties: {
            lat: { bsonType: 'number' },
            lng: { bsonType: 'number' }
          }
        }
      }
    },
    {
      name: 'incidents',
      schema: {
        farmId: { bsonType: 'objectId', description: 'Reference to farm' },
        crop: { bsonType: 'string' },
        pest: { bsonType: 'string' },
        severity: { bsonType: 'string' },
        confidence: { bsonType: 'number' },
        sprayZones: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              row: { bsonType: 'string' },
              dose: { bsonType: 'string' },
              coverage: { bsonType: 'number' }
            }
          }
        },
        imageUrl: { bsonType: 'string' }
      }
    },
    {
      name: 'outbreaks',
      schema: {
        village: { bsonType: 'string', description: 'Village affected' },
        pest: { bsonType: 'string', description: 'Pest type' },
        severity: { bsonType: 'string', description: 'Severity level' },
        affectedFarms: {
          bsonType: 'array',
          items: { bsonType: 'objectId', description: 'Farm IDs' }
        },
        startDate: { bsonType: 'date' },
        status: { bsonType: 'string', enum: ['active', 'controlled', 'resolved'] }
      }
    },
    {
      name: 'alerts',
      schema: {
        incidentId: { bsonType: 'objectId', description: 'Reference to incident' },
        message: { bsonType: 'string', description: 'Alert message' },
        channels: {
          bsonType: 'array',
          items: { bsonType: 'string' }
        },
        recipients: { bsonType: 'number' },
        status: { bsonType: 'string', enum: ['queued', 'sent', 'failed'] }
      }
    },
    {
      name: 'foodSafety',
      schema: {
        farmId: { bsonType: 'objectId', description: 'Reference to farm' },
        riskLevel: { bsonType: 'string', enum: ['low', 'medium', 'high'] },
        pesticides: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              name: { bsonType: 'string' },
              concentration: { bsonType: 'number' },
              lastSprayDate: { bsonType: 'date' }
            }
          }
        },
        harvestDate: { bsonType: 'date' },
        certificateUrl: { bsonType: 'string' }
      }
    }
  ];

  for (const collection of collections) {
    try {
      // Check if collection already exists
      const existingCollections = await db.db.listCollections({}, { nameOnly: true }).toArray();
      const collectionExists = existingCollections.some(col => col.name === collection.name);

      if (!collectionExists) {
        await db.db.createCollection(collection.name, {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              properties: collection.schema
            }
          }
        });
        console.log(`✓ Collection '${collection.name}' created successfully`);
      } else {
        console.log(`ℹ Collection '${collection.name}' already exists`);
      }
    } catch (error) {
      console.error(`✗ Error creating collection '${collection.name}':`, error.message);
    }
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ Error disconnecting from MongoDB:', error.message);
  }
}
