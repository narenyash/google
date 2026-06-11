import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const pestRecords = [
  {
    pest: "Fall Armyworm",
    diseaseName: "Spodoptera frugiperda",
    spreadable: true,
    windBorne: true,
    spreadSpeedKmPerHour: 0.4,
    spreadHours: 72,
    humidityMultiplier: 1.3,
    affects: ["maize", "wheat", "sorghum"],
    stage: "larvae",
    severity: "HIGH"
  },
  {
    pest: "Brown Planthopper",
    diseaseName: "Nilaparvata lugens",
    spreadable: true,
    windBorne: true,
    spreadSpeedKmPerHour: 0.6,
    spreadHours: 48,
    humidityMultiplier: 1.5,
    affects: ["rice"],
    stage: "nymph",
    severity: "HIGH"
  },
  {
    pest: "Wheat Rust",
    diseaseName: "Puccinia striiformis",
    spreadable: true,
    windBorne: true,
    spreadSpeedKmPerHour: 0.3,
    spreadHours: 96,
    humidityMultiplier: 1.4,
    affects: ["wheat"],
    stage: "spore",
    severity: "HIGH"
  },
  {
    pest: "Leaf Blight",
    diseaseName: "Bipolaris maydis",
    spreadable: false,
    windBorne: false,
    spreadSpeedKmPerHour: 0,
    spreadHours: null,
    humidityMultiplier: 1.0,
    affects: ["maize", "rice"],
    stage: "fungal",
    severity: "MEDIUM"
  },
  {
    pest: "Nutrient Deficiency",
    diseaseName: "Non-infectious disorder",
    spreadable: false,
    windBorne: false,
    spreadSpeedKmPerHour: 0,
    spreadHours: null,
    humidityMultiplier: 1.0,
    affects: ["all"],
    stage: "chronic",
    severity: "LOW"
  }
];

async function seedPhase2() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ Connected to MongoDB Atlas');

    const db = mongoose.connection;

    // Step 1: Create 2dsphere index on farms collection
    console.log('\n📍 Creating 2dsphere index on farms collection...');
    try {
      await db.collection('farms').createIndex({ location: '2dsphere' });
      console.log('✓ 2dsphere index created on farms.location');
    } catch (error) {
      console.log('⚠ Index creation result:', error.message);
    }

    // Step 2: Insert pest records into outbreaks collection
    console.log('\n🐛 Inserting pest records into outbreaks collection...');
    
    for (const pest of pestRecords) {
      try {
        const result = await db.collection('outbreaks').insertOne(pest);
        console.log(`✓ Inserted: ${pest.pest} (ID: ${result.insertedId})`);
      } catch (error) {
        console.error(`✗ Failed to insert ${pest.pest}:`, error.message);
      }
    }

    // Verify
    console.log('\n📊 Verification:');
    const outbreakCount = await db.collection('outbreaks').countDocuments();
    console.log(`✓ Total documents in outbreaks collection: ${outbreakCount}`);

    const indexes = await db.collection('farms').listIndexes().toArray();
    const has2dsphere = indexes.some(idx => Object.keys(idx.key).includes('location'));
    console.log(`✓ 2dsphere index on farms: ${has2dsphere ? 'EXISTS' : 'NOT FOUND'}`);

    console.log('\n✅ Phase 2 Complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedPhase2();
