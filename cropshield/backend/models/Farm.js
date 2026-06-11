import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    farmId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    village: { type: String, required: true },
    district: { type: String },
    cropType: { type: String, required: true },
    language: { type: String, default: 'kannada' },
    fieldSizeAcres: { type: Number, default: 1 },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    }
  },
  { timestamps: true }
);

farmSchema.index({ location: '2dsphere' });

export default mongoose.models.Farm || mongoose.model('Farm', farmSchema);
