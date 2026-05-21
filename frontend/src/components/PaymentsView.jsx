import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Coins, 
  Calendar,
  Info,
  ArrowUpRight,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function PaymentsView({
  payments,
  stores,
  loading,
  onCreatePayment,
  onUpdatePayment,
  onDeletePayment
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  // Filters State
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('');

  // Add Payment Form State
  const [storeId, setStoreId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [description, setDescription] = useState('');

  // Edit Payment Form State
  const [editStoreId, setEditStoreId] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editPaymentDate, setEditPaymentDate] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!storeId || !amount) return;

    onCreatePayment({
      store: storeId,
      amount: parseFloat(amount),
      date: paymentDate ? new Date(paymentDate) : new Date(),
      description
    });

    // Reset fields
    setStoreId('');
    setAmount('');
    setPaymentDate('');
    setDescription('');
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPayment || !editStoreId || !editAmount) return;

    onUpdatePayment(editingPayment._id, {
      store: editStoreId,
      amount: parseFloat(editAmount),
      date: editPaymentDate ? new Date(editPaymentDate) : new Date(),
      description: editDescription
    });

    setEditingPayment(null);
    setIsEditOpen(false);
  };

  const openEditModal = (payment) => {
    setEditingPayment(payment);
    setEditStoreId(payment.store?._id || '');
    setEditAmount(payment.amount);
    setEditPaymentDate(payment.date ? new Date(payment.date).toISOString().split('T')[0] : '');
    setEditDescription(payment.description || '');
    setIsEditOpen(true);
  };

  // Filter Logic
  const filteredPayments = payments.filter(payment => {
    return selectedStoreFilter ? payment.store?._id === selectedStoreFilter : true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">To'lovlar</h2>
          <p className="text-slate-500 text-sm mt-0.5">Do'konlardan qabul qilingan qarz to'lovlari tarixi</p>
        </div>
        <button
          id="add-payment-btn"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-full font-bold text-sm tracking-tight shadow-md transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>To'lov qabul qilish</span>
        </button>
      </div>

      {/* Filter Bar (sleek glass capsule layout) */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Do'kon bo'yicha filtrlash:</span>
        <div className="w-full md:w-64">
          <select
            value={selectedStoreFilter}
            onChange={(e) => setSelectedStoreFilter(e.target.value)}
            className="w-full px-4 py-3 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
          >
            <option value="">Barcha do'konlar</option>
            {stores.map(store => (
              <option key={store._id} value={store._id}>{store.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Payments Table/List */}
      {loading && !payments.length ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-850 rounded-full animate-spin"></div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl max-w-md mx-auto space-y-4">
          <div className="bg-slate-100 p-4 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Coins className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">To'lovlar topilmadi</h3>
            <p className="text-slate-400 text-xs px-6">Ushbu do'kon bo'yicha hech qanday to'lov tarixi mavjud emas.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View - iCloud clean style */}
          <div className="hidden md:block glass-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Do'kon</th>
                    <th className="px-6 py-4">To'langan summa</th>
                    <th className="px-6 py-4">Sana</th>
                    <th className="px-6 py-4">Izoh / Tafsilot</th>
                    <th className="px-6 py-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredPayments.map((payment) => {
                    return (
                      <tr key={payment._id} className="hover:bg-slate-100/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-slate-900 block">
                            {payment.store?.name || <span className="text-rose-500 italic font-semibold">O'chirilgan do'kon</span>}
                          </span>
                          {payment.store?.phone && (
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{payment.store.phone}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                            <span>{formatCurrency(payment.amount)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-400">
                          {new Date(payment.date).toLocaleDateString('uz-UZ')}
                        </td>
                        <td className="px-6 py-4 text-slate-600 max-w-[240px] truncate">
                          {payment.description ? (
                            <span className="bg-slate-50 border border-slate-150 text-slate-650 font-semibold px-2.5 py-1 rounded-lg text-xs" title={payment.description}>
                              {payment.description}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-xs">Izoh yo'q</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-1 justify-end">
                            <button 
                              onClick={() => openEditModal(payment)}
                              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
                              title="Tahrirlash"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('Ushbu to\'lovni o\'chirmoqchimisiz? Do\'kon qarzi qayta hisoblanadi.')) {
                                  onDeletePayment(payment._id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card List View */}
          <div className="block md:hidden space-y-4 pb-20">
            {filteredPayments.map((payment) => (
              <div key={payment._id} className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {payment.store?.name || <span className="text-rose-500 italic font-semibold">O'chirilgan do'kon</span>}
                    </h4>
                    {payment.store?.phone && (
                      <span className="text-xs text-slate-400 font-bold block mt-0.5">{payment.store.phone}</span>
                    )}
                  </div>
                  <span className="font-extrabold text-emerald-600 flex items-center gap-0.5 text-base bg-emerald-50 border border-emerald-100/50 px-3 py-1.5 rounded-2xl">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    <span>{formatCurrency(payment.amount)}</span>
                  </span>
                </div>
                
                {payment.description && (
                  <div className="bg-slate-50/60 p-3 rounded-2xl border border-slate-100/60 text-xs text-slate-650 font-medium">
                    <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Izoh</span>
                    {payment.description}
                  </div>
                )}
                
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold">Sana: {new Date(payment.date).toLocaleDateString('uz-UZ')}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(payment)}
                      className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-slate-100/60"
                      title="Tahrirlash"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Ushbu to\'lovni o\'chirmoqchimisiz? Do\'kon qarzi qayta hisoblanadi.')) {
                          onDeletePayment(payment._id);
                        }
                      }}
                      className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-all border border-rose-100/60"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Payment Modal Sheet */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl max-w-md w-full overflow-hidden animate-zoomIn border border-white/60">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Yangi to'lov qabul qilish</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Do'kon</label>
                <select
                  required
                  value={storeId}
                  onChange={(e) => setStoreId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                >
                  <option value="">Do'konni tanlang...</option>
                  {stores.map(store => (
                    <option key={store._id} value={store._id}>
                      {store.name} (Qarz: {formatCurrency(store.totalDebt)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">To'lov summasi (so'm)</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Masalan: 50000"
                    className="w-full apple-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sana (ixtiyoriy)</label>
                  <input 
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Izoh (ixtiyoriy)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="To'lov bo'yicha qo'shimcha tafsilotlar..."
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 text-xs transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-md shadow-blue-500/10 transition-colors"
                >
                  Qabul qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Payment Modal Sheet */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl max-w-md w-full overflow-hidden animate-zoomIn border border-white/60">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">To'lovni tahrirlash</h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Do'kon</label>
                <select
                  required
                  value={editStoreId}
                  onChange={(e) => setEditStoreId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                >
                  <option value="">Do'konni tanlang...</option>
                  {stores.map(store => (
                    <option key={store._id} value={store._id}>{store.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">To'lov summasi (so'm)</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full apple-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sana</label>
                  <input 
                    type="date"
                    value={editPaymentDate}
                    onChange={(e) => setEditPaymentDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Izoh</label>
                <textarea 
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-full font-bold hover:bg-slate-50 text-xs transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs shadow-md shadow-blue-500/10 transition-colors"
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
