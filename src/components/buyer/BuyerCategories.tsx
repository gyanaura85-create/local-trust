import React from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerBottomNav } from './BuyerBottomNav';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const ALL_CATEGORIES = [
  { name: 'Grocery & Staples', count: '48 items', icon: '🧺', color: 'from-amber-100 to-orange-100' },
  { name: 'Atta, Rice & Dal', count: '32 items', icon: '🌾', color: 'from-yellow-100 to-amber-100' },
  { name: 'Oil & Ghee', count: '18 items', icon: '🫒', color: 'from-amber-100 to-yellow-100' },
  { name: 'Masala & Spices', count: '24 items', icon: '🌶️', color: 'from-red-100 to-rose-100' },
  { name: 'Snacks & Biscuits', count: '36 items', icon: '🍪', color: 'from-orange-100 to-amber-100' },
  { name: 'Beverages & Tea', count: '15 items', icon: '☕', color: 'from-emerald-100 to-teal-100' },
  { name: 'Personal Care & Hygiene', count: '28 items', icon: '🧴', color: 'from-blue-100 to-indigo-100' },
  { name: 'Home & Kitchen Care', count: '22 items', icon: '🧼', color: 'from-cyan-100 to-sky-100' },
  { name: 'Fashion & Wear', count: '42 items', icon: '👕', color: 'from-purple-100 to-indigo-100' },
  { name: 'Pharmacy & Wellness', count: '19 items', icon: '💊', color: 'from-teal-100 to-emerald-100' }
];

export const BuyerCategories: React.FC = () => {
  const { goBack, navigateTo } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full pb-8">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base font-bold text-slate-900">All Categories</h1>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2.5 max-w-lg mx-auto w-full">
        {ALL_CATEGORIES.map(cat => (
          <div
            key={cat.name}
            onClick={() => navigateTo('buyer_shop_view')}
            className="bg-white rounded-2xl p-3.5 shadow-xs border border-slate-200/80 hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-xl shadow-xs group-hover:scale-105 transition-transform`}>
                {cat.icon}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{cat.count}</p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
        ))}
      </div>

      <BuyerBottomNav />
    </div>
  );
};
