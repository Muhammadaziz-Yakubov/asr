import express from 'express';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// GET all financial records and summaries
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.date.$lte = end;
      }
    }

    // 1. Fetch manual incomes & expenses
    const manualIncomes = await Income.find(dateFilter).sort({ date: -1 });
    const expenses = await Expense.find(dateFilter).sort({ date: -1 });

    // 2. Fetch orders and payments with date filter
    // Orders paidAmount represents income at the time of delivery
    const orders = await Order.find({
      ...dateFilter,
      paidAmount: { $gt: 0 }
    }).populate('store', 'name');

    // Payments represent income received later to clear debt
    const payments = await Payment.find(dateFilter).populate('store', 'name');

    // 3. Calculate Totals
    const manualIncomesTotal = manualIncomes.reduce((acc, curr) => acc + curr.amount, 0);
    const ordersIncomeTotal = orders.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const paymentsIncomeTotal = payments.reduce((acc, curr) => acc + curr.amount, 0);
    
    const totalIncome = manualIncomesTotal + ordersIncomeTotal + paymentsIncomeTotal;
    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalIncome - totalExpense;

    // 4. Build a combined history of transactions for display
    const transactionHistory = [
      ...manualIncomes.map(item => ({
        _id: item._id,
        type: 'kirim',
        source: 'manual',
        amount: item.amount,
        category: item.category || 'boshqa',
        description: item.description || 'Qo\'shimcha kirim',
        date: item.date,
      })),
      ...orders.map(item => ({
        _id: item._id,
        type: 'kirim',
        source: 'order',
        amount: item.paidAmount,
        category: 'zakaz',
        description: `${item.store?.name || 'Do\'kon'} — Buyurtma to'lovi (${item.product})`,
        date: item.date,
      })),
      ...payments.map(item => ({
        _id: item._id,
        type: 'kirim',
        source: 'payment',
        amount: item.amount,
        category: 'qarz_to\'lovi',
        description: `${item.store?.name || 'Do\'kon'} — Qarz to'lovi`,
        date: item.date,
      })),
      ...expenses.map(item => ({
        _id: item._id,
        type: 'chiqim',
        source: 'expense',
        amount: item.amount,
        category: item.category,
        description: item.description || 'Xarajat',
        date: item.date,
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      summary: {
        totalIncome,
        ordersIncome: ordersIncomeTotal,
        paymentsIncome: paymentsIncomeTotal,
        manualIncome: manualIncomesTotal,
        totalExpense,
        netProfit,
      },
      transactions: transactionHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create manual income
router.post('/incomes', async (req, res) => {
  const { amount, category, description, date } = req.body;

  if (amount === undefined) {
    return res.status(400).json({ message: 'Summa kiritilishi shart' });
  }

  try {
    const income = new Income({
      amount,
      category: category || 'boshqa',
      description: description || '',
      date: date || new Date(),
    });

    const newIncome = await income.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE manual income
router.delete('/incomes/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Kirim topilmadi' });
    }

    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: 'Kirim o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create expense
router.post('/expenses', async (req, res) => {
  const { amount, category, description, date } = req.body;

  if (amount === undefined || !category) {
    return res.status(400).json({ message: 'Summa va kategoriya kiritilishi shart' });
  }

  try {
    const expense = new Expense({
      amount,
      category,
      description: description || '',
      date: date || new Date(),
    });

    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE expense
router.delete('/expenses/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Xarajat topilmadi' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Xarajat o\'chirildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
