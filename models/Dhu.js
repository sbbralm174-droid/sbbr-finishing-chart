import mongoose from 'mongoose';

const DhuSchema = new mongoose.Schema({
  date: { type: String, required: true },
  floor: { type: String, required: true }, // এই লাইনটি যোগ করুন
  totalPieces: { type: Number, required: true },
  totalDefects: { type: Number, required: true },
  dhu: { type: Number, required: true }
});

export default mongoose.models.Dhu || mongoose.model('Dhu', DhuSchema);