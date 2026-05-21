import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  ShoppingBag, 
  Calendar,
  DollarSign,
  Info,
  CheckCircle,
  AlertCircle,
  Phone,
  Store
} from 'lucide-react';

export default function OrdersView({
  orders,
  stores,
  loading,
  onCreateOrder,
  onUpdateOrder,
  onDeleteOrder
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState('');

  // Add Order Form State
  const [storeId, setStoreId] = useState('');
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('Qarz'); // Qarz, To'langan, Qisman
  const [paidAmount, setPaidAmount] = useState('');
  const [orderDate, setOrderDate] = useState('');

  // Edit Order Form State
  const [editStoreId, setEditStoreId] = useState('');
  const [editProduct, setEditProduct] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editStatus, setEditStatus] = useState('Qarz');
  const [editPaidAmount, setEditPaidAmount] = useState('');
  const [editOrderDate, setEditOrderDate] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!storeId || !product || !amount) return;

    onCreateOrder({
      store: storeId,
      product,
      amount: parseFloat(amount),
      status,
      paidAmount: status === 'Qisman' ? parseFloat(paidAmount || 0) : 0,
      date: orderDate ? new Date(orderDate) : new Date()
    });

    // Reset fields
    setStoreId('');
    setProduct('');
    setAmount('');
    setStatus('Qarz');
    setPaidAmount('');
    setOrderDate('');
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingOrder || !editStoreId || !editProduct || !editAmount) return;

    onUpdateOrder(editingOrder._id, {
      store: editStoreId,
      product: editProduct,
      amount: parseFloat(editAmount),
      status: editStatus,
      paidAmount: editStatus === 'Qisman' ? parseFloat(editPaidAmount || 0) : 0,
      date: editOrderDate ? new Date(editOrderDate) : new Date()
    });

    setEditingOrder(null);
    setIsEditOpen(false);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setEditStoreId(order.store?._id || '');
    setEditProduct(order.product);
    setEditAmount(order.amount);
    setEditStatus(order.status);
    setEditPaidAmount(order.paidAmount || '');
    setEditOrderDate(order.date ? new Date(order.date).toISOString().split('T')[0] : '');
    setIsEditOpen(true);
  };

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStore = selectedStoreFilter ? order.store?._id === selectedStoreFilter : true;
    return matchesSearch && matchesStore;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Zakazlar</h2>
          <p className="text-slate-500 text-sm mt-0.5">Barcha yetkazilgan zakazlar va ularning to'lov holati</p>
        </div>
        <button
          id="add-order-btn"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-full font-bold text-sm tracking-tight shadow-md transition-all duration-300 active:scale-95 w-full sm:w-auto justify-center cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Zakaz qo'shish</span>
        </button>
      </div>

      {/* Filter and Search Bar (frosted capsule style) */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mahsulot nomi bo'yicha qidirish..."
            className="w-full pl-11 pr-4 py-3 bg-slate-100/50 focus:bg-white border border-transparent focus:border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-semibold apple-transition"
          />
        </div>

        {/* Store Filter */}
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

      {/* Orders Table/List */}
      {loading && !orders.length ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-850 rounded-full animate-spin"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl max-w-md mx-auto space-y-4">
          <div className="bg-slate-100 p-4 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Zakazlar topilmadi</h3>
            <p className="text-slate-400 text-xs px-6">Siz izlayotgan mezonlar bo'yicha hech qanday buyurtma yozuvlari mavjud emas.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View - iCloud/macOS style */}
          <div className="hidden md:block glass-card rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Do'kon</th>
                    <th className="px-6 py-4">Mahsulot</th>
                    <th className="px-6 py-4">Summa</th>
                    <th className="px-6 py-4">Sana</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredOrders.map((order) => {
                    return (
                      <tr key={order._id} className="hover:bg-slate-100/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-slate-900 block">
                            {order.store?.name || <span className="text-rose-500 italic font-semibold">O'chirilgan do'kon</span>}
                          </span>
                          {order.store?.phone && (
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{order.store.phone}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-600">{order.product}</td>
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-slate-900 block">{formatCurrency(order.amount)}</span>
                          {order.status === 'Qisman' && (
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                              (To'landi: {formatCurrency(order.paidAmount)})
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-400">
                          {new Date(order.date).toLocaleDateString('uz-UZ')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[9px] font-extrabold px-3 py-1 rounded-full border ${
                            order.status === 'To\'langan' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' 
                              : order.status === 'Qarz' 
                                ? 'bg-rose-50 text-rose-700 border-rose-100/50' 
                                : 'bg-amber-50 text-amber-700 border-amber-100/50'
                          }`}>
                            {order.status === 'To\'langan' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                            {order.status === 'Qarz' && <AlertCircle className="w-3 h-3 text-rose-600" />}
                            {order.status === 'Qisman' && <Info className="w-3 h-3 text-amber-600" />}
                            <span>{order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-1 justify-end">
                            <button 
                              onClick={() => openEditModal(order)}
                              className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
                              title="Tahrirlash"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm('Ushbu zakazni o\'chirmoqchimisiz? Do\'kon qarzi qayta hisoblanadi.')) {
                                  onDeleteOrder(order._id);
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

          {/* Mobile Card List View - Package widgets */}
          <div className="block md:hidden space-y-4 pb-20">
            {filteredOrders.map((order) => (
              <div key={order._id} className="glass-card p-5 rounded-3xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {order.store?.name || <span className="text-rose-500 italic font-semibold">O'chirilgan do'kon</span>}
                    </h4>
                    {order.store?.phone && (
                      <span className="text-xs text-slate-400 font-bold block mt-0.5">{order.store.phone}</span>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1 rounded-full border ${
                    order.status === 'To\'langan' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50' 
                      : order.status === 'Qarz' 
                        ? 'bg-rose-50 text-rose-700 border-rose-100/50' 
                        : 'bg-amber-50 text-amber-700 border-amber-100/50'
                  }`}>
                    {order.status === 'To\'langan' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                    {order.status === 'Qarz' && <AlertCircle className="w-3 h-3 text-rose-600" />}
                    {order.status === 'Qisman' && <Info className="w-3 h-3 text-amber-600" />}
                    <span>{order.status}</span>
                  </span>
                </div>
                
                <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center text-sm">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Mahsulot</span>
                    <span className="text-slate-800 font-bold">{order.product}</span>
                  </div>
                  <div className="text-right space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Summa</span>
                    <span className="font-extrabold text-slate-900 text-base block">{formatCurrency(order.amount)}</span>
                  </div>
                </div>

                {order.status === 'Qisman' && (
                  <div className="bg-slate-50/60 p-3 rounded-2xl border border-slate-100 text-xs flex justify-between text-slate-500 font-semibold">
                    <span>T: {formatCurrency(order.paidAmount)}</span>
                    <span className="text-rose-600 font-bold">Q: {formatCurrency(order.amount - order.paidAmount)}</span>
                  </div>
                )}
                
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold">Sana: {new Date(order.date).toLocaleDateString('uz-UZ')}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEditModal(order)}
                      className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-full transition-all border border-slate-100/60"
                      title="Tahrirlash"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Ushbu zakazni o\'chirmoqchimisiz? Do\'kon qarzi qayta hisoblanadi.')) {
                          onDeleteOrder(order._id);
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

      {/* Add Order Modal Sheet */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl max-w-md w-full overflow-hidden animate-zoomIn border border-white/60">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Yangi zakaz qo'shish</h3>
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
                    <option key={store._id} value={store._id}>{store.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mahsulot nomi</label>
                <input 
                  type="text"
                  required
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="Masalan: Pepsi 1.5L (10 block)"
                  className="w-full apple-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zakaz summasi (so'm)</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Masalan: 120000"
                    className="w-full apple-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sana (ixtiyoriy)</label>
                  <input 
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">To'lov statusi</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Qarz', 'To\'langan', 'Qisman'].map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setStatus(statusOption)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                        status === statusOption
                          ? statusOption === 'To\'langan' ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/10'
                            : statusOption === 'Qarz' ? 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/10'
                            : 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/10'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Paid Amount for Partially Paid */}
              {status === 'Qisman' && (
                <div className="animate-fadeIn space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">To'langan summa (so'm)</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    max={amount || undefined}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    placeholder="Masalan: 50000"
                    className="w-full apple-input"
                  />
                  {amount && paidAmount && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1">
                      Do'kon qarziga qo'shiladi: {formatCurrency(parseFloat(amount) - parseFloat(paidAmount))}
                    </p>
                  )}
                </div>
              )}

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
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Modal Sheet */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl max-w-md w-full overflow-hidden animate-zoomIn border border-white/60">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Zakazni tahrirlash</h3>
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
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mahsulot nomi</label>
                <input 
                  type="text"
                  required
                  value={editProduct}
                  onChange={(e) => setEditProduct(e.target.value)}
                  className="w-full apple-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zakaz summasi (so'm)</label>
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
                    value={editOrderDate}
                    onChange={(e) => setEditOrderDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100/50 hover:bg-slate-100 border border-transparent rounded-xl focus:outline-none focus:ring-4 focus:ring-slate-100 text-xs font-bold text-slate-700 bg-white apple-transition cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">To'lov statusi</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Qarz', 'To\'langan', 'Qisman'].map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() => setEditStatus(statusOption)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                        editStatus === statusOption
                          ? statusOption === 'To\'langan' ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/10'
                            : statusOption === 'Qarz' ? 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/10'
                            : 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/10'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-650'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional Paid Amount for Partially Paid */}
              {editStatus === 'Qisman' && (
                <div className="animate-fadeIn space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">To'langan summa (so'm)</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    max={editAmount || undefined}
                    value={editPaidAmount}
                    onChange={(e) => setEditPaidAmount(e.target.value)}
                    className="w-full apple-input"
                  />
                  {editAmount && editPaidAmount && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1">
                      Do'kon qarziga qo'shiladi: {formatCurrency(parseFloat(editAmount) - parseFloat(editPaidAmount))}
                    </p>
                  )}
                </div>
              )}

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
