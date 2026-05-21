import express from 'express';
import Order from '../models/Order.js';
import Store from '../models/Store.js';
import { recalculateStoreDebt } from '../utils/debtCalculator.js';

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('store', 'name phone')
      .sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create order
router.post('/', async (req, res) => {
  const { store: storeId, product, amount, paidAmount, status, date } = req.body;

  if (!storeId || !product || amount === undefined || !status) {
    return res.status(400).json({ message: 'Barcha majburiy maydonlarni to\'ldiring' });
  }

  try {
    const storeExists = await Store.findById(storeId);
    if (!storeExists) {
      return res.status(404).json({ message: 'Do\'kon topilmadi' });
    }

    const order = new Order({
      store: storeId,
      product,
      amount,
      paidAmount: paidAmount || 0,
      status,
      date: date || new Date(),
    });

    const newOrder = await order.save();
    
    // Recalculate debt
    await recalculateStoreDebt(storeId);

    // Populate store info before sending response
    await newOrder.populate('store', 'name phone');

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update order
router.put('/:id', async (req, res) => {
  const { store: storeId, product, amount, paidAmount, status, date } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }

    const oldStoreId = order.store.toString();

    if (storeId) {
      const storeExists = await Store.findById(storeId);
      if (!storeExists) {
        return res.status(404).json({ message: 'Do\'kon topilmadi' });
      }
      order.store = storeId;
    }

    if (product) order.product = product;
    if (amount !== undefined) order.amount = amount;
    if (paidAmount !== undefined) order.paidAmount = paidAmount;
    if (status) order.status = status;
    if (date) order.date = date;

    // Use save() to trigger the pre-save Hook
    const updatedOrder = await order.save();

    // Recalculate debt for the store(s)
    await recalculateStoreDebt(order.store);
    if (storeId && storeId !== oldStoreId) {
      await recalculateStoreDebt(oldStoreId);
    }

    await updatedOrder.populate('store', 'name phone');
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }

    const storeId = order.store.toString();
    await Order.findByIdAndDelete(req.params.id);

    // Recalculate debt
    await recalculateStoreDebt(storeId);

    res.json({ message: 'Buyurtma o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
