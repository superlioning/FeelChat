// models/Case.js
import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
});

export default mongoose.models.Case || mongoose.model('Case', caseSchema);