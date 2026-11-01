import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppScreen } from '../../types';
import { Home, ClipboardList, Plus, Package, LayoutGrid } from 'lucide-react';

export const SellerBottomNav: React.FC = () => {
  const { currentScreen, navigateTo, orders } = useApp();

  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  const navItems: { label: string; screen: AppScreen; icon: React.ReactNode; isFab?: boolean; badge?: number }[] = [
    {
      label: 'Dashboard',
      screen: 'seller_dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      label: 'Orders',
      screen: 'seller_orders',
      icon: <ClipboardList className="w-5 h-5" />,
      badge: newOrdersCount > 0 ? newOrdersCount : undefined
    },
    {
      label: 'Add Product',
      screen: 'seller_add_product',
      icon: <Plus className="w-6 h-6 text-white stroke-[2.5]" />,
      isFab: true
    },
    {
      label: 'Products',
      screen: 'seller_products',
      icon: <Package className="w-5 h-5" />
    },
    {
      label: 'More',
      screen: 'seller_more',
      icon: <LayoutGrid className="w-5 h-5" />
    }
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 select-none">
      <div className="flex items-center justify-around max-w-lg mx-auto h-14 relative">
        {navItems.map((item, idx) => {
          const isActive = currentScreen === item.screen;

          if (item.isFab) {
            return (
              <div key={idx} className="relative -top-5 flex flex-col items-center">
                <button
                  onClick={() => navigateTo(item.screen)}
                  aria-label="Add Product"
                  className="w-13 h-13 rounded-full bg-[#004BB7] hover:bg-[#003C94] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-blue-600/35 border-4 border-white transition-all cursor-pointer"
                >
                  {item.icon}
                </button>
                <span className="text-[10px] font-bold text-slate-700 mt-0.5 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={idx}
              onClick={() => navigateTo(item.screen)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer relative ${
                isActive ? 'text-[#004BB7]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-extrabold rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
