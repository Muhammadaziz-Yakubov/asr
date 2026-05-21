import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.model('Payment', PaymentSchema);
