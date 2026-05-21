import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    default: 'boshqa',
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Income', IncomeSchema);
