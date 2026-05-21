import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Coins, 
  TrendingUp,
  PackageCheck,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onQuickAction }) {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stores', label: 'Do\'konlar', icon: Store },
    { id: 'orders', label: 'Zakazlar', icon: ShoppingBag },
    { id: 'payments', label: 'To\'lovlar', icon: Coins },
    { id: 'finance', label: 'Daromad', icon: TrendingUp },
  ];

  const handleAction = (action) => {
    setIsActionSheetOpen(false);
    if (action === 'viewFinance') {
      setActiveTab('finance');
    } else if (onQuickAction) {
      onQuickAction(action);
    }
  };

  return (
    <>
      {/* Sidebar for Desktop - macOS Sonoma Frosted Glass Style */}
      <aside className="hidden md:flex w-64 glass-sidebar min-h-screen fixed left-0 top-0 flex-col z-30">
        {/* Brand Logo & Name */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <img 
            src="/logo.jpg" 
            alt="ASR Logo" 
            className="w-10 h-10 rounded-full object-cover border border-slate-200/60 shadow-sm"
          />
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 uppercase">
              ASR
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Delivery & Debt</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 active:scale-95 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">© 2026 ASR Delivery</p>
          <a 
            href="https://t.me/mister_yakubov" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[9px] text-slate-400 hover:text-blue-650 mt-0.5 italic transition-colors block font-semibold cursor-pointer"
          >
            Yaratuvchi: Muhammadaziz Yakubov
          </a>
        </div>
      </aside>

      {/* True iOS-Style Tab Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl border-t border-slate-200/40 shadow-[0_-2px_15px_rgba(0,0,0,0.03)] pb-[env(safe-area-inset-bottom,12px)] pt-1.5 px-3">
        <div className="grid grid-cols-5 items-center justify-between max-w-lg mx-auto">
          {/* Item 1: Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-95 ${
              activeTab === 'dashboard' ? 'text-blue-600 font-semibold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 stroke-[2]" />
            <span className="text-[9px] font-bold tracking-tight">Asosiy</span>
          </button>

          {/* Item 2: Do'konlar */}
          <button
            onClick={() => setActiveTab('stores')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-95 ${
              activeTab === 'stores' ? 'text-blue-600 font-semibold' : 'text-slate-400'
            }`}
          >
            <Store className="w-5 h-5 stroke-[2]" />
            <span className="text-[9px] font-bold tracking-tight">Do'konlar</span>
          </button>

          {/* Item 3: Center Plus Button (Quick Action Menu) */}
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsActionSheetOpen(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-900 text-white shadow-lg active:scale-90 active:bg-slate-800 transition-all duration-200 -translate-y-3.5 border-4 border-white/95"
              title="Tezkor amallar"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>

          {/* Item 4: Zakazlar */}
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-95 ${
              activeTab === 'orders' ? 'text-blue-600 font-semibold' : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-5 h-5 stroke-[2]" />
            <span className="text-[9px] font-bold tracking-tight">Zakazlar</span>
          </button>

          {/* Item 5: To'lovlar (We will put To'lovlar as 5th item, and Daromad will be in the Quick Action menu. This makes exactly 5 columns!) */}
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex flex-col items-center justify-center gap-1 py-1 transition-all duration-200 active:scale-95 ${
              activeTab === 'payments' ? 'text-blue-600 font-semibold' : 'text-slate-400'
            }`}
          >
            <Coins className="w-5 h-5 stroke-[2]" />
            <span className="text-[9px] font-bold tracking-tight">To'lovlar</span>
          </button>
        </div>
      </div>

      {/* iOS Action Sheet Bottom Sheet */}
      {isActionSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsActionSheetOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 animate-fadeIn"
          />
          {/* Slide-up panel */}
          <div className="absolute bottom-0 inset-x-0 bg-slate-100/95 backdrop-blur-2xl rounded-t-[24px] px-4 pt-5 pb-[calc(env(safe-area-inset-bottom,16px)+20px)] shadow-[0_-10px_30px_rgba(0,0,0,0.15)] border-t border-white/20 animate-slideUp">
            {/* iOS Grabber */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-5" />
            
            {/* Title */}
            <div className="text-center mb-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tezkor amallar</h4>
            </div>

            {/* Grouped Actions (iOS Style grouped list) */}
            <div className="bg-white/95 rounded-2xl overflow-hidden divide-y divide-slate-100 border border-slate-200/30 shadow-sm mb-4">
              <button 
                onClick={() => handleAction('addOrder')}
                className="w-full flex items-center gap-3.5 px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <div className="bg-blue-500 text-white p-2 rounded-xl">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-800">Yangi zakaz</span>
                  <span className="block text-[10px] text-slate-400">Yangi buyurtma va qarz kiritish</span>
                </div>
              </button>

              <button 
                onClick={() => handleAction('addPayment')}
                className="w-full flex items-center gap-3.5 px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <div className="bg-emerald-500 text-white p-2 rounded-xl">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-800">To'lov qabul qilish</span>
                  <span className="block text-[10px] text-slate-400">Do'kon to'lagan naqd pulni kiritish</span>
                </div>
              </button>

              <button 
                onClick={() => handleAction('addStore')}
                className="w-full flex items-center gap-3.5 px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <div className="bg-indigo-500 text-white p-2 rounded-xl">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-800">Yangi do'kon qo'shish</span>
                  <span className="block text-[10px] text-slate-400">Yangi savdo nuqtasini ro'yxatdan o'tkazish</span>
                </div>
              </button>
            </div>

            {/* Finance Actions (iOS Style grouped list) */}
            <div className="bg-white/95 rounded-2xl overflow-hidden divide-y divide-slate-100 border border-slate-200/30 shadow-sm mb-5">
              <button 
                onClick={() => handleAction('addIncome')}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <div className="bg-emerald-500 text-white p-2 rounded-xl">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">Kirim qo'shish</span>
              </button>

              <button 
                onClick={() => handleAction('addExpense')}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <div className="bg-rose-500 text-white p-2 rounded-xl">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">Chiqim / Xarajat qo'shish</span>
              </button>

              <button 
                onClick={() => handleAction('viewFinance')}
                className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <div className="bg-slate-600 text-white p-2 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-slate-800">Daromad & Moliya hisoboti</span>
              </button>
            </div>

            {/* Cancel Button (iOS separate style) */}
            <button 
              onClick={() => setIsActionSheetOpen(false)}
              className="w-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-bold py-4 rounded-2xl border border-slate-200/40 transition-colors shadow-sm text-center text-sm cursor-pointer"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </>
  );
}
