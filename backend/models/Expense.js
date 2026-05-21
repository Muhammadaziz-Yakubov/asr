import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ['yoqilg\'i', 'xarajat', 'boshqa'],
    required: true,
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

export default mongoose.model('Expense', ExpenseSchema);
