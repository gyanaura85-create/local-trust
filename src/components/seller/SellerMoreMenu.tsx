import React from 'react';
import { useApp } from '../../context/AppContext';
import { SellerBottomNav } from './SellerBottomNav';
import { 
  Store, 
  Clock, 
  Truck, 
  Landmark, 
  LayoutGrid, 
  Box, 
  Tag, 
  BarChart3, 
  Star, 
  Globe, 
  Headphones, 
  Bell, 
  LogOut, 
  ChevronRight, 
  CheckCircle,
  Camera
} from 'lucide-react';
import { SellerMoreSubscreenType } from '../../types';

export const SellerMoreMenu: React.FC = () => {
  const { 
    shop, 
    openMoreSubscreen, 
    logout, 
    showToast,
    navigateTo 
  } = useApp();

  const handleItemClick = (type: SellerMoreSubscreenType) => {
    openMoreSubscreen(type);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out of your seller account?')) {
      logout();
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full">
      
      {/* Top Shop Profile Card matching screenshot 11 */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div 
          onClick={() => openMoreSubscreen('manage_shop')}
          className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden border-2 border-emerald-500 shrink-0">
              <img
                src={shop.photo}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-extrabold text-slate-900">{shop.name}</h2>
                <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-600 text-white" />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{shop.category}</p>
              <div className="flex items-center gap-1.5 text-xs mt-1">
                <span className="font-bold text-emerald-600">Open</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 text-[11px]">Closes at {shop.closingTime}</span>
              </div>
            </div>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Main Sections List matching screenshot 11 */}
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        
        {/* GROUP 1: Shop Management */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 px-1">
            Shop Management
          </h3>

          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
            
            {/* Manage Your Shop */}
            <button
              onClick={() => handleItemClick('manage_shop')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Manage Your Shop
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Update shop details, address, and information
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Business Hours */}
            <button
              onClick={() => handleItemClick('business_hours')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Business Hours
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Set open hours and holidays
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Delivery and Pickup */}
            <button
              onClick={() => handleItemClick('delivery_pickup')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    Delivery and Pickup
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage delivery zones and pickup options
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Payment and Bank Details */}
            <button
              onClick={() => handleItemClick('payment_bank')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Payment and Bank Details
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage bank account and payout information
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>
        </div>

        {/* GROUP 2: Products & Sales */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 px-1">
            Products & Sales
          </h3>

          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
            
            {/* Categories */}
            <button
              onClick={() => handleItemClick('categories')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Categories
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage your product categories
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Inventory */}
            <button
              onClick={() => handleItemClick('inventory')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Inventory
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Track stock and manage inventory
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Deals and Offers */}
            <button
              onClick={() => handleItemClick('deals_offers')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    Deals and Offers
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Create and manage deals and discounts
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Sales Report */}
            <button
              onClick={() => handleItemClick('sales_report')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                    Sales Report
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    View sales performance and reports
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>
        </div>

        {/* GROUP 3: Support & Account */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 px-1">
            Support & Account
          </h3>

          <div className="bg-white rounded-3xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
            
            {/* Customers Reviews */}
            <button
              onClick={() => handleItemClick('reviews')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                    Customers Reviews
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    View and respond to customer reviews
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Language */}
            <button
              onClick={() => handleItemClick('language')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Language
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Change app language
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Customer Support */}
            <button
              onClick={() => handleItemClick('support')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Customer Support
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Get help and support
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Notification */}
            <button
              onClick={() => handleItemClick('notifications')}
              className="w-full p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Notification
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage your notification preferences
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className="w-full p-4 flex items-center justify-between hover:bg-rose-50/60 transition-colors text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-600">
                    Log Out
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Logout from your seller account
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

          </div>
        </div>

      </div>

      {/* Seller Bottom Nav */}
      <SellerBottomNav />

    </div>
  );
};
