import express from 'express';
import Payment from '../models/Payment.js';
import Store from '../models/Store.js';
import { recalculateStoreDebt } from '../utils/debtCalculator.js';

const router = express.Router();

// GET all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('store', 'name phone')
      .sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create payment
router.post('/', async (req, res) => {
  const { store: storeId, amount, date, description } = req.body;

  if (!storeId || amount === undefined) {
    return res.status(400).json({ message: 'Do\'kon va summa kiritilishi shart' });
  }

  try {
    const storeExists = await Store.findById(storeId);
    if (!storeExists) {
      return res.status(404).json({ message: 'Do\'kon topilmadi' });
    }

    const payment = new Payment({
      store: storeId,
      amount,
      date: date || new Date(),
      description: description || '',
    });

    const newPayment = await payment.save();

    // Recalculate debt
    await recalculateStoreDebt(storeId);

    await newPayment.populate('store', 'name phone');
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update payment
router.put('/:id', async (req, res) => {
  const { store: storeId, amount, date, description } = req.body;

  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'To\'lov topilmadi' });
    }

    const oldStoreId = payment.store.toString();

    if (storeId) {
      const storeExists = await Store.findById(storeId);
      if (!storeExists) {
        return res.status(404).json({ message: 'Do\'kon topilmadi' });
      }
      payment.store = storeId;
    }

    if (amount !== undefined) payment.amount = amount;
    if (date) payment.date = date;
    if (description !== undefined) payment.description = description;

    const updatedPayment = await payment.save();

    // Recalculate debt for the store(s)
    await recalculateStoreDebt(payment.store);
    if (storeId && storeId !== oldStoreId) {
      await recalculateStoreDebt(oldStoreId);
    }

    await updatedPayment.populate('store', 'name phone');
    res.json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE payment
router.delete('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'To\'lov topilmadi' });
    }

    const storeId = payment.store.toString();
    await Payment.findByIdAndDelete(req.params.id);

    // Recalculate debt
    await recalculateStoreDebt(storeId);

    res.json({ message: 'To\'lov o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
