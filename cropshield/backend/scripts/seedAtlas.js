import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function main() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in .env');
  }

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection.db;
  const farms = db.collection('farms');
  const outbreaks = db.collection('outbreaks');

  console.log('Connected to MongoDB Atlas');

  // create 2dsphere index on farms.location
  try {
    const indexes = await farms.indexes();
    const has2dsphere = indexes.some(index => index.key && index.key.location === '2dsphere');
    if (!has2dsphere) {
      await farms.createIndex({ location: '2dsphere' });
      console.log('Created 2dsphere index on farms.location');
    } else {
      console.log('2dsphere index on farms.location already exists');
    }
  } catch (error) {
    console.error('Error creating 2dsphere index:', error.message);
    process.exit(1);
  }

  // insert outbreak documents
  const pestDocs = [
    {
      pest: 'Fall Armyworm',
      diseaseName: 'Spodoptera frugiperda',
      spreadable: true,
      windBorne: true,
      spreadSpeedKmPerHour: 0.4,
      spreadHours: 72,
      humidityMultiplier: 1.3,
      affects: ['maize', 'wheat', 'sorghum'],
      stage: 'larvae',
      severity: 'HIGH'
    },
    {
      pest: 'Brown Planthopper',
      diseaseName: 'Nilaparvata lugens',
      spreadable: true,
      windBorne: true,
      spreadSpeedKmPerHour: 0.6,
      spreadHours: 48,
      humidityMultiplier: 1.5,
      affects: ['rice'],
      stage: 'nymph',
      severity: 'HIGH'
    },
    {
      pest: 'Wheat Rust',
      diseaseName: 'Puccinia striiformis',
      spreadable: true,
      windBorne: true,
      spreadSpeedKmPerHour: 0.3,
      spreadHours: 96,
      humidityMultiplier: 1.4,
      affects: ['wheat'],
      stage: 'spore',
      severity: 'HIGH'
    },
    {
      pest: 'Leaf Blight',
      diseaseName: 'Bipolaris maydis',
      spreadable: false,
      windBorne: false,
      spreadSpeedKmPerHour: 0,
      spreadHours: null,
      humidityMultiplier: 1.0,
      affects: ['maize', 'rice'],
      stage: 'fungal',
      severity: 'MEDIUM'
    },
    {
      pest: 'Nutrient Deficiency',
      diseaseName: 'Non-infectious disorder',
      spreadable: false,
      windBorne: false,
      spreadSpeedKmPerHour: 0,
      spreadHours: null,
      humidityMultiplier: 1.0,
      affects: ['all'],
      stage: 'chronic',
      severity: 'LOW'
    }
  ];

  try {
    const existingCount = await outbreaks.countDocuments({ pest: { $in: pestDocs.map(doc => doc.pest) } });
    if (existingCount === pestDocs.length) {
      console.log('All outbreak documents already exist, skipping insert');
    } else {
      const existingPests = await outbreaks.distinct('pest', { pest: { $in: pestDocs.map(doc => doc.pest) } });
      const docsToInsert = pestDocs.filter(doc => !existingPests.includes(doc.pest));
      if (docsToInsert.length > 0) {
        const result = await outbreaks.insertMany(docsToInsert);
        console.log(`Inserted ${result.insertedCount} outbreak documents`);
      }
    }
  } catch (error) {
    console.error('Error inserting outbreak documents:', error.message);
    process.exit(1);
  }

  const finalCount = await outbreaks.countDocuments({ pest: { $in: pestDocs.map(doc => doc.pest) } });
  console.log(`Outbreak documents count for inserted pests: ${finalCount}`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB Atlas');
}

main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});