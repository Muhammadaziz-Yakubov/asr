import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Store from '../models/Store.js';

export async function recalculateStoreDebt(storeId) {
  try {
    const storeObjectId = new mongoose.Types.ObjectId(storeId);

    // 1. Calculate orders debt sum
    const ordersResult = await Order.aggregate([
      { $match: { store: storeObjectId } },
      { $group: { _id: null, totalDebt: { $sum: '$debtAmount' } } }
    ]);
    const ordersDebt = ordersResult.length > 0 ? ordersResult[0].totalDebt : 0;

    // 2. Calculate payments sum
    const paymentsResult = await Payment.aggregate([
      { $match: { store: storeObjectId } },
      { $group: { _id: null, totalPayments: { $sum: '$amount' } } }
    ]);
    const paymentsSum = paymentsResult.length > 0 ? paymentsResult[0].totalPayments : 0;

    const totalDebt = ordersDebt - paymentsSum;

    await Store.findByIdAndUpdate(storeId, { totalDebt });
    return totalDebt;
  } catch (error) {
    console.error(`Error recalculating store debt for store ${storeId}:`, error);
    throw error;
  }
}
