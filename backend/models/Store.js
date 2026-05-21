import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  totalDebt: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Store', StoreSchema);
