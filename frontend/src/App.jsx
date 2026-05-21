import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import StoresView from './components/StoresView';
import OrdersView from './components/OrdersView';
import PaymentsView from './components/PaymentsView';
import FinanceView from './components/FinanceView';

import { 
  dashboardService, 
  storeService, 
  orderService, 
  paymentService, 
  financeService 
} from './services/api';

import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [financeData, setFinanceData] = useState(null);

  // Detail / Drawer State
  const [storeDetails, setStoreDetails] = useState(null);

  // Quick action modal triggers
  const [preselectedStoreId, setPreselectedStoreId] = useState('');
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  // Helper to show toasts
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch all data
  const loadAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [statsData, storesData, ordersData, paymentsData, finance] = await Promise.all([
        dashboardService.getStats(),
        storeService.getAll(),
        orderService.getAll(),
        paymentService.getAll(),
        financeService.getRecords(),
      ]);
      setStats(statsData);
      setStores(storesData);
      setOrders(ordersData);
      setPayments(paymentsData);
      setFinanceData(finance);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Ma\'lumotlarni yuklashda xatolik yuz berdi', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  // Fetch single store details (orders + payments history)
  const handleFetchStoreDetails = async (id) => {
    try {
      const details = await storeService.getOne(id);
      setStoreDetails(details);
    } catch (error) {
      showToast('Do\'kon ma\'lumotlarini yuklashda xatolik', 'error');
    }
  };

  // Dashboard and Sidebar quick actions
  const handleDashboardAction = (action) => {
    if (action === 'addOrder') {
      setActiveTab('orders');
      setPreselectedStoreId('');
      // Trigger modal open via simple DOM dispatch or standard react state
      setTimeout(() => {
        const btn = document.getElementById('add-order-btn') || document.querySelector('button[title="Zakaz qo\'shish"]');
        if (btn) btn.click();
      }, 100);
    } else if (action === 'addPayment') {
      setActiveTab('payments');
      setPreselectedStoreId('');
      setTimeout(() => {
        const btn = document.getElementById('add-payment-btn') || document.querySelector('button[title="To\'lov qabul qilish"]');
        if (btn) btn.click();
      }, 100);
    } else if (action === 'addStore') {
      setActiveTab('stores');
      setTimeout(() => {
        const btn = document.getElementById('add-store-btn') || document.querySelector('button[title="Do\'kon qo\'shish"]');
        if (btn) btn.click();
      }, 100);
    } else if (action === 'addIncome') {
      setActiveTab('finance');
      setTimeout(() => {
        const btn = document.getElementById('add-income-btn');
        if (btn) btn.click();
      }, 100);
    } else if (action === 'addExpense') {
      setActiveTab('finance');
      setTimeout(() => {
        const btn = document.getElementById('add-expense-btn');
        if (btn) btn.click();
      }, 100);
    }
  };

  // Store card quick actions
  const handleOpenQuickOrder = (store) => {
    setActiveTab('orders');
    setPreselectedStoreId(store._id);
    setTimeout(() => {
      // Find and click the Add Order button
      const addBtn = document.querySelector('button[title="Zakaz qo\'shish"]');
      if (addBtn) addBtn.click();
      
      // Select the store in the dropdown
      setTimeout(() => {
        const select = document.querySelector('select');
        if (select) {
          select.value = store._id;
          // Trigger React state update by dispatching change event
          const event = new Event('change', { bubbles: true });
          select.dispatchEvent(event);
        }
      }, 100);
    }, 150);
  };

  const handleOpenQuickPayment = (store) => {
    setActiveTab('payments');
    setPreselectedStoreId(store._id);
    setTimeout(() => {
      // Find and click the Add Payment button
      const addBtn = document.querySelector('button[title="To\'lov qabul qilish"]');
      if (addBtn) addBtn.click();
      
      // Select the store in the dropdown
      setTimeout(() => {
        const select = document.querySelector('select');
        if (select) {
          select.value = store._id;
          const event = new Event('change', { bubbles: true });
          select.dispatchEvent(event);
        }
      }, 100);
    }, 150);
  };

  // STORES API ACTIONS
  const handleCreateStore = async (data) => {
    try {
      await storeService.create(data);
      showToast('Do\'kon muvaffaqiyatli qo\'shildi');
      loadAllData(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Do\'kon qo\'shishda xatolik', 'error');
    }
  };

  const handleUpdateStore = async (id, data) => {
    try {
      await storeService.update(id, data);
      showToast('Do\'kon ma\'lumotlari yangilandi');
      loadAllData(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Do\'konni tahrirlashda xatolik', 'error');
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await storeService.delete(id);
      showToast('Do\'kon va barcha ma\'lumotlari o\'chirildi');
      loadAllData(true);
    } catch (error) {
      showToast('Do\'konni o\'chirishda xatolik', 'error');
    }
  };

  // ORDERS API ACTIONS
  const handleCreateOrder = async (data) => {
    try {
      await orderService.create(data);
      showToast('Zakaz muvaffaqiyatli qo\'shildi');
      loadAllData(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Zakaz qo\'shishda xatolik', 'error');
    }
  };

  const handleUpdateOrder = async (id, data) => {
    try {
      await orderService.update(id, data);
      showToast('Zakaz ma\'lumotlari yangilandi');
      loadAllData(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Zakazni tahrirlashda xatolik', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await orderService.delete(id);
      showToast('Zakaz o\'chirildi');
      loadAllData(true);
    } catch (error) {
      showToast('Zakazni o\'chirishda xatolik', 'error');
    }
  };

  // PAYMENTS API ACTIONS
  const handleCreatePayment = async (data) => {
    try {
      await paymentService.create(data);
      showToast('To\'lov qabul qilindi');
      loadAllData(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'To\'lov qo\'shishda xatolik', 'error');
    }
  };

  const handleUpdatePayment = async (id, data) => {
    try {
      await paymentService.update(id, data);
      showToast('To\'lov ma\'lumotlari tahrirlandi');
      loadAllData(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'To\'lovni tahrirlashda xatolik', 'error');
    }
  };

  const handleDeletePayment = async (id) => {
    try {
      await paymentService.delete(id);
      showToast('To\'lov o\'chirildi');
      loadAllData(true);
    } catch (error) {
      showToast('To\'lovni o\'chirishda xatolik', 'error');
    }
  };

  // FINANCE API ACTIONS
  const handleFetchFinanceData = async (filters) => {
    setLoading(true);
    try {
      const records = await financeService.getRecords(filters);
      setFinanceData(records);
    } catch (error) {
      showToast('Moliya ma\'lumotlarini filtrlashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (data) => {
    try {
      await financeService.createExpense(data);
      showToast('Xarajat muvaffaqiyatli saqlandi');
      loadAllData(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Xarajat qo\'shishda xatolik', 'error');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await financeService.deleteExpense(id);
      showToast('Xarajat o\'chirildi');
      loadAllData(true);
    } catch (error) {
      showToast('Xarajatni o\'chirishda xatolik', 'error');
    }
  };

  const handleCreateIncome = async (data) => {
    try {
      await financeService.createIncome(data);
      showToast('Kirim muvaffaqiyatli saqlandi');
      loadAllData(true);
    } catch (error) {
      showToast(error.response?.data?.message || 'Kirim qo\'shishda xatolik', 'error');
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await financeService.deleteIncome(id);
      showToast('Kirim o\'chirildi');
      loadAllData(true);
    } catch (error) {
      showToast('Kirimni o\'chirishda xatolik', 'error');
    }
  };

  // Render view depending on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            stats={stats} 
            loading={loading} 
            onAction={handleDashboardAction} 
          />
        );
      case 'stores':
        return (
          <StoresView
            stores={stores}
            loading={loading}
            onCreateStore={handleCreateStore}
            onUpdateStore={handleUpdateStore}
            onDeleteStore={handleDeleteStore}
            onOpenQuickOrder={handleOpenQuickOrder}
            onOpenQuickPayment={handleOpenQuickPayment}
            storeDetails={storeDetails}
            fetchStoreDetails={handleFetchStoreDetails}
            clearStoreDetails={() => setStoreDetails(null)}
          />
        );
      case 'orders':
        return (
          <OrdersView
            orders={orders}
            stores={stores}
            loading={loading}
            onCreateOrder={handleCreateOrder}
            onUpdateOrder={handleUpdateOrder}
            onDeleteOrder={handleDeleteOrder}
          />
        );
      case 'payments':
        return (
          <PaymentsView
            payments={payments}
            stores={stores}
            loading={loading}
            onCreatePayment={handleCreatePayment}
            onUpdatePayment={handleUpdatePayment}
            onDeletePayment={handleDeletePayment}
          />
        );
      case 'finance':
        return (
          <FinanceView
            financeData={financeData}
            loading={loading}
            onFetchFinance={handleFetchFinanceData}
            onCreateExpense={handleCreateExpense}
            onDeleteExpense={handleDeleteExpense}
            onCreateIncome={handleCreateIncome}
            onDeleteIncome={handleDeleteIncome}
          />
        );
      default:
        return <div>Sahifa topilmadi</div>;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 px-4.5 py-3.5 glass-modal rounded-2xl shadow-2xl animate-slideUp max-w-md border border-white/60">
          <div className={`p-2 rounded-xl ${
            toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-600' :
            toast.type === 'error' ? 'bg-rose-500/10 text-rose-600' : 'bg-blue-500/10 text-blue-600'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 stroke-[2.5]" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 stroke-[2.5]" />}
            {toast.type === 'info' && <Info className="w-5 h-5 stroke-[2.5]" />}
          </div>
          <p className="text-sm font-semibold text-slate-900 tracking-tight">{toast.message}</p>
          <button 
            onClick={() => setToast(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-black/5 rounded-xl ml-auto apple-transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onQuickAction={handleDashboardAction} />

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 min-h-screen p-4 md:p-8 pb-28 md:pb-8 relative">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
