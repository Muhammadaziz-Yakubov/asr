import React, { useState } from 'react';
import { 
  Plus, 
  Phone, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  History, 
  X, 
  ShoppingBag,
  Coins,
  ArrowUpRight,
  User,
  Store,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function StoresView({ 
  stores, 
  loading, 
  onCreateStore, 
  onUpdateStore, 
  onDeleteStore,
  onOpenQuickOrder,
  onOpenQuickPayment,
  storeDetails,
  fetchStoreDetails,
  clearStoreDetails
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  
  // Create store form state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Edit store form state
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newName) return;
    onCreateStore({ name: newName, phone: newPhone });
    setNewName('');
    setNewPhone('');
    setIsAddOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editName || !editingStore) return;
    onUpdateStore(editingStore._id, { name: editName, phone: editPhone });
    setEditingStore(null);
    setIsEditOpen(false);
  };

  const openEditModal = (store) => {
    setEditingStore(store);
    setEditName(store.name);
    setEditPhone(store.phone || '');
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Do'konlar</h2>
          <p className="text-slate-500 text-sm mt-0.5">Savdo do'konlari ro'yxati va ularning qarz hisobotlari</p>
        </div>
        <button
          id="add-store-btn"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-full font-bold text-sm tracking-tight shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Do'kon qo'shish</span>
        </button>
      </div>

      {/* Grid of Store Cards */}
      {loading && !stores.length ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-850 rounded-full animate-spin"></div>
        </div>
      ) : stores.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl max-w-md mx-auto space-y-5">
          <div className="bg-slate-100 p-4 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Store className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Hozircha do'konlar yo'q</h3>
            <p className="text-slate-400 text-xs px-4">Savdo operatsiyalarini boshlash uchun birinchi do'koningizni qo'shing.</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="apple-btn-primary px-6 py-3 text-sm"
          >
            Do'kon qo'shish
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => {
            const hasDebt = store.totalDebt > 0;
            return (
              <div 
                key={store._id}
                className="glass-card rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Options Panel (Edit/Delete) - Clean and subtle */}
                <div className="absolute top-4 right-4 flex gap-1 z-10">
                  <button 
                    onClick={() => openEditModal(store)}
                    className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100/80 rounded-full transition-all"
                    title="Tahrirlash"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Rostdan ham "${store.name}" do'konini o'chirmoqchimisiz? Barcha zakazlar va to'lovlar ham o'chib ketadi!`)) {
                        onDeleteStore(store._id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Header Content */}
                <div className="p-6">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Do'kon</span>
                    <h3 className="font-extrabold text-slate-800 text-lg tracking-tight truncate pr-16" title={store.name}>
                      {store.name}
                    </h3>
                    {store.phone ? (
                      <a 
                        href={`tel:${store.phone}`}
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors mt-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{store.phone}</span>
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Telefon kiritilmagan</span>
                    )}
                  </div>

                  {/* Debt block (Clean Apple Card representation) */}
                  <div className={`mt-6 p-4.5 rounded-2xl flex items-center justify-between border ${
                    hasDebt 
                      ? 'bg-rose-50/50 border-rose-100/60' 
                      : 'bg-emerald-50/50 border-emerald-100/60'
                  }`}>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Qarz balansi</span>
                      <span className={`text-lg font-extrabold tracking-tight ${hasDebt ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formatCurrency(store.totalDebt || 0)}
                      </span>
                    </div>
                    {hasDebt ? (
                      <div className="bg-rose-500/10 text-rose-600 p-2.5 rounded-xl">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="bg-emerald-500/10 text-emerald-600 p-2.5 rounded-xl">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions (Premium subtle footer controls) */}
                <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/40">
                  <button
                    onClick={() => onOpenQuickOrder(store)}
                    className="flex flex-col items-center justify-center py-3 border-r border-slate-100 hover:bg-slate-100/50 text-slate-500 hover:text-blue-600 transition-colors group/foot"
                  >
                    <ShoppingBag className="w-4 h-4 mb-1 text-blue-500 group-hover/foot:scale-105 transition-transform" />
                    <span className="text-[10px] font-bold">Zakaz</span>
                  </button>
                  <button
                    onClick={() => onOpenQuickPayment(store)}
                    className="flex flex-col items-center justify-center py-3 border-r border-slate-100 hover:bg-slate-100/50 text-slate-500 hover:text-emerald-600 transition-colors group/foot"
                  >
                    <Coins className="w-4 h-4 mb-1 text-emerald-500 group-hover/foot:scale-105 transition-transform" />
                    <span className="text-[10px] font-bold">To'lov</span>
                  </button>
                  <button
                    onClick={() => fetchStoreDetails(store._id)}
                    className="flex flex-col items-center justify-center py-3 hover:bg-slate-100/50 text-slate-500 hover:text-indigo-600 transition-colors group/foot"
                  >
                    <History className="w-4 h-4 mb-1 text-indigo-500 group-hover/foot:scale-105 transition-transform" />
                    <span className="text-[10px] font-bold">Tarix</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Store Modal Sheet */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl max-w-md w-full overflow-hidden animate-zoomIn border border-white/60">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Yangi do'kon qo'shish</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Do'kon nomi</label>
                <input 
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Masalan: Safia Konditerlik uyi"
                  className="w-full apple-input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon raqami (ixtiyoriy)</label>
                <input 
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Masalan: +998901234567"
                  className="w-full apple-input"
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
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Modal Sheet */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-modal rounded-3xl max-w-md w-full overflow-hidden animate-zoomIn border border-white/60">
            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-lg">Do'konni tahrirlash</h3>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Do'kon nomi</label>
                <input 
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full apple-input"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon raqami (ixtiyoriy)</label>
                <input 
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full apple-input"
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

      {/* Store History Detail - iOS Slide Left Drawer */}
      {storeDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-white/95 backdrop-blur-2xl h-full max-w-xl w-full shadow-2xl border-l border-slate-100 flex flex-col justify-between overflow-hidden animate-slideLeft">
            
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <span className="text-[9px] text-blue-600 bg-blue-50 border border-blue-100/50 font-bold px-3 py-1 rounded-full uppercase tracking-wider">Do'kon tarixi</span>
                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight mt-1.5">
                  {storeDetails.store.name}
                </h3>
                {storeDetails.store.phone && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{storeDetails.store.phone}</span>
                  </p>
                )}
              </div>
              <button 
                onClick={clearStoreDetails}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {/* Debt Summary Panel */}
              <div className="p-5 rounded-2xl flex justify-between items-center bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Qoldiq qarz</span>
                  <span className={`text-xl font-extrabold tracking-tight ${storeDetails.store.totalDebt > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {formatCurrency(storeDetails.store.totalDebt || 0)}
                  </span>
                </div>
                {storeDetails.store.totalDebt > 0 ? (
                  <button 
                    onClick={() => {
                      const details = storeDetails.store;
                      clearStoreDetails();
                      onOpenQuickPayment(details);
                    }}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-md shadow-slate-900/10 transition-all active:scale-95"
                  >
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Qarzni yopish</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-3.5 py-2 rounded-full font-bold">Hisob yopilgan</span>
                )}
              </div>

              {/* Drawer Split Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Orders History Column */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                    <span>Zakazlar ({storeDetails.orders.length})</span>
                  </h4>
                  {storeDetails.orders.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4">Zakazlar mavjud emas</p>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {storeDetails.orders.map((order) => (
                        <div key={order._id} className="p-3.5 bg-white border border-slate-100/80 rounded-xl space-y-1.5 shadow-sm">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-xs text-slate-800 truncate block max-w-[70%]">{order.product}</span>
                            <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full border ${
                              order.status === 'To\'langan' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                              order.status === 'Qarz' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-755 border-amber-100'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                            <span>{new Date(order.date).toLocaleDateString('uz-UZ')}</span>
                            <span className="font-extrabold text-slate-900">{formatCurrency(order.amount)}</span>
                          </div>
                          {order.status === 'Qisman' && (
                            <div className="text-[9px] text-slate-400 pt-1.5 border-t border-slate-100/50 flex justify-between font-medium">
                              <span>T: {formatCurrency(order.paidAmount)}</span>
                              <span className="text-rose-600 font-bold">Q: {formatCurrency(order.debtAmount)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payments History Column */}
                <div className="space-y-4">
                  <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2.5 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-500" />
                    <span>To'lovlar ({storeDetails.payments.length})</span>
                  </h4>
                  {storeDetails.payments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4">To'lovlar mavjud emas</p>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {storeDetails.payments.map((payment) => (
                        <div key={payment._id} className="p-3.5 bg-white border border-slate-100/80 rounded-xl space-y-2 shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs text-emerald-600 flex items-center gap-0.5">
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>{formatCurrency(payment.amount)}</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold">{new Date(payment.date).toLocaleDateString('uz-UZ')}</span>
                          </div>
                          {payment.description && (
                            <p className="text-[9px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 truncate font-medium">
                              {payment.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={clearStoreDetails}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs tracking-wide uppercase transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
