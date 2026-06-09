import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema(
  {
    incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident' },
    message: { type: String, required: true },
    channels: [{ type: String }],
    recipients: Number,
    status: { type: String, enum: ['queued', 'sent', 'failed'], default: 'queued' }
  },
  { timestamps: true }
);

export default mongoose.models.Alert || mongoose.model('Alert', alertSchema);
