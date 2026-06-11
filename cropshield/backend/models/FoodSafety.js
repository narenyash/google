import mongoose from 'mongoose';

const foodSafetySchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
    pesticides: [
      {
        name: String,
        concentration: Number,
        lastSprayDate: Date
      }
    ],
    harvestDate: Date,
    certificateUrl: String
  },
  { timestamps: true }
);

export default mongoose.models.FoodSafety || mongoose.model('FoodSafety', foodSafetySchema);
