import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  product: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  debtAmount: {
    type: Number,
    min: 0,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Qarz', 'To\'langan', 'Qisman'],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Pre-save hook to calculate debtAmount based on status and paidAmount
OrderSchema.pre('save', function() {
  if (this.status === 'To\'langan') {
    this.paidAmount = this.amount;
    this.debtAmount = 0;
  } else if (this.status === 'Qarz') {
    this.paidAmount = 0;
    this.debtAmount = this.amount;
  } else { // Qisman
    // If paidAmount is greater than amount, cap it
    if (this.paidAmount > this.amount) {
      this.paidAmount = this.amount;
    }
    this.debtAmount = this.amount - this.paidAmount;
    if (this.debtAmount === 0) {
      this.status = 'To\'langan';
    } else if (this.paidAmount === 0) {
      this.status = 'Qarz';
    }
  }
});

export default mongoose.model('Order', OrderSchema);
