import express from 'express';
import Store from '../models/Store.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Expense from '../models/Expense.js';
import Income from '../models/Income.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Today's orders count
    const todayOrdersCount = await Order.countDocuments({
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    // 2. Today's income (orders paidAmount + payments amount + manual incomes amount)
    const todayOrders = await Order.find({
      date: { $gte: startOfToday, $lte: endOfToday }
    });
    const todayPayments = await Payment.find({
      date: { $gte: startOfToday, $lte: endOfToday }
    });
    const todayManualIncomes = await Income.find({
      date: { $gte: startOfToday, $lte: endOfToday }
    });

    const todayOrdersIncome = todayOrders.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const todayPaymentsIncome = todayPayments.reduce((acc, curr) => acc + curr.amount, 0);
    const todayManualIncome = todayManualIncomes.reduce((acc, curr) => acc + curr.amount, 0);

    const todayIncome = todayOrdersIncome + todayPaymentsIncome + todayManualIncome;

    // 3. Today's expense
    const todayExpenses = await Expense.find({
      date: { $gte: startOfToday, $lte: endOfToday }
    });
    const todayExpenseTotal = todayExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    // 4. Total Debt across all stores
    const stores = await Store.find();
    const totalDebt = stores.reduce((acc, curr) => acc + (curr.totalDebt > 0 ? curr.totalDebt : 0), 0);

    // 5. Most Indebted Store
    const mostIndebtedStore = await Store.findOne({ totalDebt: { $gt: 0 } }).sort({ totalDebt: -1 });

    // 6. Chart data: last 7 days stats
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);

      // Fetch for this day
      const dayOrders = await Order.find({ date: { $gte: start, $lte: end } });
      const dayPayments = await Payment.find({ date: { $gte: start, $lte: end } });
      const dayManualIncomes = await Income.find({ date: { $gte: start, $lte: end } });
      const dayExpenses = await Expense.find({ date: { $gte: start, $lte: end } });

      const dayIncome = dayOrders.reduce((acc, curr) => acc + curr.paidAmount, 0) +
                         dayPayments.reduce((acc, curr) => acc + curr.amount, 0) +
                         dayManualIncomes.reduce((acc, curr) => acc + curr.amount, 0);
      
      const dayExpense = dayExpenses.reduce((acc, curr) => acc + curr.amount, 0);

      // Format date like "Mon", "Tue" in Uzbek or short format
      const weekdayNames = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
      const dayLabel = `${weekdayNames[start.getDay()]} (${start.getDate()})`;

      chartData.push({
        label: dayLabel,
        income: dayIncome,
        expense: dayExpense,
        orders: dayOrders.length,
      });
    }

    res.json({
      todayOrdersCount,
      todayIncome,
      todayExpense: todayExpenseTotal,
      totalDebt,
      mostIndebtedStore: mostIndebtedStore ? {
        _id: mostIndebtedStore._id,
        name: mostIndebtedStore.name,
        totalDebt: mostIndebtedStore.totalDebt,
        phone: mostIndebtedStore.phone,
      } : null,
      chartData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
