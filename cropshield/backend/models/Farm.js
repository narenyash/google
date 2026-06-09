import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    village: { type: String, required: true },
    crop: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

export default mongoose.models.Farm || mongoose.model('Farm', farmSchema);
