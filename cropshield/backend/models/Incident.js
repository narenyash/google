import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema(
  {
    farmId: { type: String },
    district: { type: String },
    crop: { type: String },
    cropType: { type: String },
    pest: { type: String },
    diseaseName: { type: String },
    severity: { type: String },
    confidence: { type: Number },
    affectedPercent: { type: Number },
    pesticideSavedPercent: { type: Number },
    fieldSizeAcres: { type: Number },
    latitude: { type: Number },
    longitude: { type: Number },
    imageUrl: { type: String },
    treatment: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Incident || mongoose.model('Incident', incidentSchema);
