import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    fromFarmId: { type: String },
    toFarmId: { type: String },
    ownerName: { type: String },
    pest: { type: String },
    diseaseName: { type: String },
    riskLevel: { type: String },
    zone: { type: String, enum: ['RED', 'ORANGE', 'YELLOW'] },
    message: { type: String, required: true },
    language: { type: String, default: 'kannada' },
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['sent', 'failed'], default: 'sent' }
  },
  { timestamps: true }
);

export default mongoose.models.Alert || mongoose.model('Alert', alertSchema);
