import React from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerBottomNav } from './BuyerBottomNav';
import { 
  User, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  Store, 
  CreditCard, 
  ShieldCheck, 
  Headphones, 
  LogOut, 
  ChevronRight
} from 'lucide-react';

export const BuyerProfile: React.FC = () => {
  const { 
    userName, 
    userPhone, 
    userLocation, 
    switchRole, 
    logout, 
    orders, 
    showToast 
  } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full pb-8">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-5 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
              {userName.charAt(0) || 'R'}
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900">{userName}</h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{userPhone}</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[200px]">{userLocation.split(',')[0]}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => switchRole('seller')}
            className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Seller Mode</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-lg mx-auto w-full">

        {/* Account Menu List */}
        <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
          
          <div 
            onClick={() => showToast('Opening saved delivery addresses...', 'info')}
            className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Saved Addresses</h4>
                <p className="text-[11px] text-slate-500">{userLocation}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => showToast('Payment methods secured via Stripe', 'info')}
            className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Payment Methods</h4>
                <p className="text-[11px] text-slate-500">Stripe Saved Cards & UPI</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => showToast('Connecting to 24/7 Buyer Helpline...', 'info')}
            className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Customer Support</h4>
                <p className="text-[11px] text-slate-500">Instant chat & order queries</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={logout}
            className="p-4 flex items-center justify-between hover:bg-rose-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-rose-600">Log Out</h4>
                <p className="text-[11px] text-slate-500">End shopping session</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </div>

        </div>

      </div>

      <BuyerBottomNav />
    </div>
  );
};
