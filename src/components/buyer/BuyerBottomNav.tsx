import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppScreen } from '../../types';
import { Home, LayoutGrid, ShoppingCart, ClipboardList, User } from 'lucide-react';

export const BuyerBottomNav: React.FC = () => {
  const { currentScreen, navigateTo, cartItemCount } = useApp();

  const navItems: { label: string; screen: AppScreen; icon: React.ReactNode; badge?: number }[] = [
    {
      label: 'Home',
      screen: 'buyer_home',
      icon: <Home className="w-5 h-5" />
    },
    {
      label: 'Categories',
      screen: 'buyer_categories',
      icon: <LayoutGrid className="w-5 h-5" />
    },
    {
      label: 'Cart',
      screen: 'buyer_cart',
      icon: <ShoppingCart className="w-5 h-5" />,
      badge: cartItemCount > 0 ? cartItemCount : undefined
    },
    {
      label: 'Orders',
      screen: 'buyer_orders',
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      label: 'Profile',
      screen: 'buyer_profile_view',
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 select-none">
      <div className="flex items-center justify-around max-w-lg mx-auto h-14">
        {navItems.map((item, idx) => {
          const isActive = currentScreen === item.screen;

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
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-rose-600 text-white text-[9px] font-extrabold rounded-full animate-pulse">
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
