import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  Store,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from 'lucide-react';

export default function DashboardView({ 
  stats, 
  loading, 
  onAction 
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(val);
  };

  const chartData = stats?.chartData || [];
  const maxChartValue = Math.max(...chartData.map(d => Math.max(d.income, d.expense)), 100000);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tizim holati</h2>
          <p className="text-slate-500 text-sm mt-0.5">Bugungi ko'rsatkichlar va asosiy hisob-kitoblar</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-white/70 backdrop-blur-md border border-slate-200/50 px-4 py-2.5 rounded-2xl text-slate-600 shadow-sm font-semibold">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Sana:</span>
          <span className="text-slate-900 font-bold">{new Date().toLocaleDateString('uz-UZ')}</span>
        </div>
      </div>

      {/* 4 macOS Widget Style Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Today's Income */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full translate-x-6 -translate-y-6 blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Bugungi daromad</span>
            <div className="bg-emerald-500/10 text-emerald-600 p-2.5 rounded-2xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            {formatCurrency(stats?.todayIncome || 0)}
          </h3>
          <p className="text-emerald-600 text-xs font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Naqd kirim</span>
          </p>
        </div>

        {/* Card 2: Today's Orders */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full translate-x-6 -translate-y-6 blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Bugungi buyurtmalar</span>
            <div className="bg-blue-500/10 text-blue-600 p-2.5 rounded-2xl">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            {stats?.todayOrdersCount || 0} ta
          </h3>
          <p className="text-blue-600 text-xs font-semibold">
            Yetkazilgan zakazlar
          </p>
        </div>

        {/* Card 3: Total Debt */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full translate-x-6 -translate-y-6 blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Umumiy qarz</span>
            <div className="bg-rose-500/10 text-rose-600 p-2.5 rounded-2xl">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-rose-600 tracking-tight mb-1">
            {formatCurrency(stats?.totalDebt || 0)}
          </h3>
          <p className="text-rose-600 text-xs font-semibold flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Kutilayotgan mablag'</span>
          </p>
        </div>

        {/* Card 4: Most Indebted Store */}
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full translate-x-6 -translate-y-6 blur-xl group-hover:scale-125 transition-transform duration-500"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Eng ko'p qarzdor</span>
            <div className="bg-amber-500/10 text-amber-600 p-2.5 rounded-2xl">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-850 tracking-tight mb-1 truncate max-w-full">
            {stats?.mostIndebtedStore ? stats.mostIndebtedStore.name : 'Mavjud emas'}
          </h3>
          <p className="text-amber-600 text-xs font-bold">
            {stats?.mostIndebtedStore ? formatCurrency(stats.mostIndebtedStore.totalDebt) : 'Qarzlar yo\'q'}
          </p>
        </div>
      </div>

      {/* Main Content Area: Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Widget */}
        <div className="glass-card p-6 rounded-3xl lg:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Oxirgi 7 kunlik faollik</h3>
              <p className="text-xs text-slate-500">Kirim va Chiqim hisoboti</p>
            </div>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-full"></div>
                <span className="text-slate-500">Kirim</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-gradient-to-t from-rose-500 to-rose-400 rounded-full"></div>
                <span className="text-slate-500">Chiqim</span>
              </div>
            </div>
          </div>

          <div className="h-64 flex flex-col justify-between relative">
            {/* Grid Line Marks */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40 py-2">
              <div className="border-b border-slate-200/50 w-full"></div>
              <div className="border-b border-slate-200/50 w-full"></div>
              <div className="border-b border-slate-200/50 w-full"></div>
              <div className="border-b border-slate-200/50 w-full"></div>
            </div>

            {/* Chart Bars */}
            <div className="flex-1 flex items-end justify-around gap-2 pt-6 relative z-10">
              {chartData.map((day, idx) => {
                const incomeHeight = (day.income / maxChartValue) * 100;
                const expenseHeight = (day.expense / maxChartValue) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group max-w-[70px]">
                    <div className="w-full flex justify-center gap-2 items-end h-40 relative">
                      {/* Income Bar (Green Gradient) */}
                      <div 
                        style={{ height: `${Math.max(incomeHeight, 4)}%` }}
                        className="w-3.5 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-full transition-all duration-300 group-hover:scale-y-105 group-hover:brightness-110 relative shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none shadow-md font-bold">
                          K: {formatCurrency(day.income)}
                        </div>
                      </div>
                      
                      {/* Expense Bar (Red Gradient) */}
                      <div 
                        style={{ height: `${Math.max(expenseHeight, 4)}%` }}
                        className="w-3.5 bg-gradient-to-t from-rose-500 to-rose-400 rounded-full transition-all duration-300 group-hover:scale-y-105 group-hover:brightness-110 relative shadow-[0_2px_8px_rgba(244,63,94,0.15)]"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 pointer-events-none shadow-md font-bold">
                          Ch: {formatCurrency(day.expense)}
                        </div>
                      </div>
                    </div>
                    {/* Label */}
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-3 select-none">
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel - macOS Widget Style */}
        <div className="glass-card p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Tezkor amallar</h3>
              <p className="text-slate-500 text-xs">Kerakli operatsiyalarni darhol bajarish</p>
            </div>

            <div className="space-y-3">
              {/* Add Order Button */}
              <button 
                onClick={() => onAction('addOrder')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl transition-all duration-300 active:scale-[0.98] group/btn border border-slate-100 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white p-2.5 rounded-xl shadow-md shadow-blue-500/10 group-hover/btn:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Yangi zakaz</span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Zakaz va qarz kiritish</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              {/* Receive Payment Button */}
              <button 
                onClick={() => onAction('addPayment')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl transition-all duration-300 active:scale-[0.98] group/btn border border-slate-100 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 text-white p-2.5 rounded-xl shadow-md shadow-emerald-500/10 group-hover/btn:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">To'lov qabul qilish</span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Qarzni kamaytirish</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
              </button>

              {/* Add Store Button */}
              <button 
                onClick={() => onAction('addStore')}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl transition-all duration-300 active:scale-[0.98] group/btn border border-slate-100 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500 text-white p-2.5 rounded-xl shadow-md shadow-indigo-500/10 group-hover/btn:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Yangi do'kon qo'shish</span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase mt-0.5">Savdo nuqtasi yaratish</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Bugungi zakazlar</span>
            <span className="font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{stats?.todayOrdersCount || 0} ta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
