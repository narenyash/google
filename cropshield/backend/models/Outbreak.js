import mongoose from 'mongoose';

const outbreakSchema = new mongoose.Schema(
  {
    village: { type: String, required: true },
    pest: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    affectedFarms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }],
    startDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'controlled', 'resolved'], default: 'active' }
  },
  { timestamps: true }
);

export default mongoose.models.Outbreak || mongoose.model('Outbreak', outbreakSchema);
