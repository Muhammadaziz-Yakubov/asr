import express from 'express';
import Store from '../models/Store.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// GET all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find().sort({ totalDebt: -1, name: 1 });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single store with history
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Do\'kon topilmadi' });
    }

    const orders = await Order.find({ store: req.params.id }).sort({ date: -1 });
    const payments = await Payment.find({ store: req.params.id }).sort({ date: -1 });

    res.json({
      store,
      orders,
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create store
router.post('/', async (req, res) => {
  const { name, phone } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: 'Do\'kon nomi kiritilishi shart' });
  }

  try {
    // Check if store with same name exists
    const existing = await Store.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Bunday nomli do\'kon allaqachon mavjud' });
    }

    const store = new Store({
      name: name.trim(),
      phone: phone ? phone.trim() : '',
    });

    const newStore = await store.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update store
router.put('/:id', async (req, res) => {
  const { name, phone } = req.body;

  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Do\'kon topilmadi' });
    }

    if (name) {
      const existing = await Store.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ message: 'Bunday nomli do\'kon allaqachon mavjud' });
      }
      store.name = name.trim();
    }
    
    if (phone !== undefined) {
      store.phone = phone.trim();
    }

    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE store and cascade delete orders & payments
router.delete('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Do\'kon topilmadi' });
    }

    // Delete associated orders and payments
    await Order.deleteMany({ store: req.params.id });
    await Payment.deleteMany({ store: req.params.id });
    
    await Store.findByIdAndDelete(req.params.id);

    res.json({ message: 'Do\'kon va unga tegishli barcha ma\'lumotlar o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
