import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
    crop: String,
    pest: String,
    severity: String,
    confidence: Number,
    sprayZones: [
      {
        row: String,
        dose: String,
        coverage: Number
      }
    ],
    imageUrl: String
  },
  { timestamps: true }
);

export default mongoose.models.Incident || mongoose.model('Incident', incidentSchema);
