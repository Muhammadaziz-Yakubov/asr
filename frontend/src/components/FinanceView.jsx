import React, { useState } from 'react';
import { 
  Plus, 
  Minus,
  Trash2, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Filter,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function FinanceView({
  financeData,
  loading,
  onFetchFinance,
  onCreateExpense,
  onDeleteExpense,
  onCreateIncome,
  onDeleteIncome
}) {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);

  // Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Add Expense State
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('yoqilg\'i');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  // Add Income State
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('boshqa');
  const [incomeDesc, setIncomeDesc] = useState('');
  const [incomeDate, setIncomeDate] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    onFetchFinance({ startDate, endDate });
  };

  const handleFilterReset = () => {
    setStartDate('');
    setEndDate('');
    onFetchFinance({});
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseCategory) return;

    onCreateExpense({
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      description: expenseDesc,
      date: expenseDate ? new Date(expenseDate) : new Date()
    });

    setExpenseAmount('');
    setExpenseCategory('yoqilg\'i');
    setExpenseDesc('');
    setExpenseDate('');
    setIsExpenseOpen(false);
  };

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    if (!incomeAmount) return;

    onCreateIncome({
      amount: parseFloat(incomeAmount),
      category: incomeCategory,
      description: incomeDesc,
      date: incomeDate ? new Date(incomeDate) : new Date()
    });

    setIncomeAmount('');
    setIncomeCategory('boshqa');
    setIncomeDesc('');
    setIncomeDate('');
    setIsIncomeOpen(false);
  };

  const summary = financeData?.summary || { totalIncome: 0, totalExpense: 0, netProfit: 0 };
  const transactions = financeData?.transactions || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Moliya</h2>
          <p className="text-slate-500 text-sm mt-0.5">Moliya ko'rsatkichlari, yoqilg'i va avto xarajatlar tahlili</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            id="add-income-btn"
            onClick={() => setIsIncomeOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-full font-bold text-xs tracking-tight shadow-md transition-all duration-300 active:scale-95 justify-center w-full sm:w-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Kirim qo'shish</span>
          </button>
          <button
            id="add-expense-btn"
            onClick={() => setIsExpenseOpen(true)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-full font-bold text-xs tracking-tight shadow-md transition-all duration-300 active:scale-95 justify-center w-full sm:w-auto cursor-pointer"
          >
            <Minus className="w-4 h-4" />
            <span>Chiqim (Xarajat)</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar - clean integrated design */}
      <form onSubmit={handleFilterSubmit} className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-stretch md:items-end">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Boshlanish sanasi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tugash sanasi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleFilterReset}
            className="flex-1 md:flex-none justify-center px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-full font-bold text-xs transition-colors cursor-pointer"
          >
            Tozalash
          </button>
          <button
            type="submit"
            className="flex-1 md:flex-none justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold flex items-center gap-1.5 text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrlash</span>
          </button>
        </div>
      </form>

      {/* Financial Summary Cards (Premium Apple Card representations) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full translate-x-6 -translate-y-6 blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Kirim (Umumiy)</span>
            <div className="bg-emerald-500/10 text-emerald-600 p-2.5 rounded-2xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 tracking-tight mb-1">
            {formatCurrency(summary.totalIncome)}
          </h3>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
            Sotuv + Qarz yig'ish yozuvlari
          </p>
        </div>

        {/* Total Expense */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full translate-x-6 -translate-y-6 blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Chiqim (Xarajatlar)</span>
            <div className="bg-rose-500/10 text-rose-600 p-2.5 rounded-2xl">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-rose-600 tracking-tight mb-1">
            {formatCurrency(summary.totalExpense)}
          </h3>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
            Yoqilg'i & avto xizmat xarajatlari
          </p>
        </div>

        {/* Net Profit - Glowing Apple Card Metallic Gradient */}
        <div className={`p-6 rounded-3xl relative overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${
          summary.netProfit >= 0 
            ? 'bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 text-white shadow-emerald-500/15'
            : 'bg-gradient-to-br from-rose-500 via-pink-500 to-orange-500 text-white shadow-rose-500/15'
        }`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full translate-x-6 -translate-y-6 blur-xl"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Sof Foyda</span>
            <div className="bg-white/20 text-white p-2.5 rounded-2xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold tracking-tight mb-1">
            {formatCurrency(summary.netProfit)}
          </h3>
          <p className="text-white/80 text-[9px] font-bold uppercase tracking-wider">
            Sof foyda = Kirim - Chiqim
          </p>
        </div>
      </div>

      {/* Transactions History List */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-extrabold text-slate-900 text-base">Moliyaviy operatsiyalar tarixi</h3>
          <span className="text-[10px] text-slate-500 font-extrabold bg-white border border-slate-200 px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Jami: {transactions.length} ta yozuv
          </span>
        </div>

        {loading && !transactions.length ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-850 rounded-full animate-spin"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 italic">Hech qanday operatsiya topilmadi</div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto pr-1">
            {transactions.map((tx) => {
              const isKirim = tx.type === 'kirim';
              return (
                <div key={tx._id} className="px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between hover:bg-slate-100/20 transition-colors gap-3">
                  {/* Left part: icon, description & date */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className={`p-2.5 rounded-2xl border shrink-0 ${
                      isKirim 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                        : 'bg-rose-50 text-rose-600 border-rose-100/50'
                    }`}>
                      {isKirim ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-slate-900 text-xs sm:text-sm break-words leading-snug">
                        {tx.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 mt-1 font-bold">
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider">
                          Kategoriya: <span className="text-slate-600 font-extrabold">{tx.category}</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 text-[9px] uppercase tracking-wider">
                          <Calendar className="w-3 h-3 text-slate-300" />
                          <span>{new Date(tx.date).toLocaleDateString('uz-UZ')}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right part: amount & delete button */}
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className={`text-xs sm:text-base font-extrabold tracking-tight ${
                      isKirim ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {isKirim ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>

                    {/* Disable deletion for automatic entries (orders & payments) */}
                    {tx.source === 'expense' ? (
                      <button 
                        onClick={() => {
                          if (confirm('Ushbu xarajatni o\'chirmoqchimisiz?')) {
                            onDeleteExpense(tx._id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                        title="Xarajatni o'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : tx.source === 'manual' ? (
                      <button 
                        onClick={() => {
                          if (confirm('Ushbu kirimni o\'chirmoqchimisiz?')) {
                            onDeleteIncome(tx._id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all cursor-pointer"
                        title="Kirimni o'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      // Placeholder to align list items
                      <div className="w-9"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Expense (Chiqim) Modal Sheet */}
      {isExpenseOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl max-w-md w-full overflow-y-auto max-h-[90vh] animate-zoomIn border border-white/60">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-lg">Chiqim kiritish (Xarajat)</h3>
              <button 
                onClick={() => setIsExpenseOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chiqim summasi (so'm)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="Masalan: 45000"
                  className="w-full apple-input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategoriya</label>
                  <select
                    required
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                  >
                    <option value="yoqilg'i">Yoqilg'i</option>
                    <option value="xarajat">Mashina xarajati</option>
                    <option value="boshqa">Boshqa xarajatlar</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sana (ixtiyoriy)</label>
                  <input 
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tafsilot (Izoh)</label>
                <textarea 
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="Masalan: Damasga metan quyildi yoki Moy almashtirildi..."
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsExpenseOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 text-xs transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-md shadow-rose-500/10 transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Manual Income (Kirim) Modal Sheet */}
      {isIncomeOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl max-w-md w-full overflow-y-auto max-h-[90vh] animate-zoomIn border border-white/60">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-lg">Yangi qo'shimcha kirim kiritish</h3>
              <button 
                onClick={() => setIsIncomeOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleIncomeSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kirim summasi (so'm)</label>
                <input 
                  type="number"
                  required
                  min="0"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  placeholder="Masalan: 100000"
                  className="w-full apple-input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategoriya</label>
                  <input 
                    type="text"
                    value={incomeCategory}
                    onChange={(e) => setIncomeCategory(e.target.value)}
                    placeholder="Masalan: Mukofot yoki Boshqa"
                    className="w-full apple-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sana (ixtiyoriy)</label>
                  <input 
                    type="date"
                    value={incomeDate}
                    onChange={(e) => setIncomeDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tafsilot (Izoh)</label>
                <textarea 
                  value={incomeDesc}
                  onChange={(e) => setIncomeDesc(e.target.value)}
                  placeholder="Kirim bo'yicha qo'shimcha tafsilotlar..."
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsIncomeOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 text-xs transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs shadow-md shadow-emerald-500/10 transition-colors"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
