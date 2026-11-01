import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerBottomNav } from './SellerBottomNav';
import { 
  Menu, 
  Bell, 
  User, 
  CheckCircle, 
  Camera, 
  Calendar, 
  ChevronDown, 
  ShoppingBag, 
  ClipboardList, 
  IndianRupee, 
  Star, 
  Megaphone,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Share2
} from 'lucide-react';
import { NearKartLogo } from '../common/NearKartLogo';
import { SellerNotificationModal } from './SellerNotificationModal';

export const SellerDashboard: React.FC = () => {
  const { 
    shop, 
    updateShop, 
    orders, 
    ads, 
    navigateTo, 
    setSelectedOrder, 
    unreadOrdersCount,
    realtimeStatus,
    showToast 
  } = useApp();

  const [selectedDate, setSelectedDate] = useState('08 May 2025');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Compute live statistics
  const newOrders = orders.filter(o => o.status === 'new');
  const totalOrdersCount = orders.length;
  const totalSalesAmount = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);

  const toggleShopStatus = () => {
    const nextStatus = !shop.isOpen;
    updateShop({ isOpen: nextStatus });
    showToast(nextStatus ? 'Shop is now marked OPEN to buyers' : 'Shop is now marked CLOSED', 'info');
  };

  const handleShareShop = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Shop link copied to clipboard!', 'success');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F1F5F9] min-h-full">
      
      {/* Top Header Bar */}
      <div className="w-full bg-[#004BB7] text-white px-5 pt-3 pb-8">
        
        {/* Navigation & Brand row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('seller_more')}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <NearKartLogo size="sm" showTagline={false} className="flex-row items-center gap-1.5" />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsNotificationModalOpen(true)}
              className="relative p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Order Notifications & Live Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadOrdersCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-[#004BB7] animate-pulse">
                  {unreadOrdersCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#004BB7]" />
              )}
            </button>
            <button
              onClick={() => navigateTo('seller_more')}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shop Info Card */}
        <div className="mt-5 flex items-center gap-3.5">
          {/* Shop Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white p-0.5 shadow-md overflow-hidden border-2 border-white">
              <img
                src={shop.photo}
                alt={shop.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button
              onClick={() => navigateTo('seller_more')}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-[#004BB7] hover:scale-110 transition-transform cursor-pointer"
              title="Change Shop Photo"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          {/* Shop details */}
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold text-white tracking-tight">{shop.name}</h2>
              <CheckCircle className="w-4 h-4 text-emerald-400 fill-emerald-400 text-white shrink-0" />
            </div>
            <p className="text-xs text-blue-100 font-medium mt-0.5">{shop.category}</p>
            
            {/* Open / Closed toggle */}
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              <button
                onClick={toggleShopStatus}
                className="flex items-center gap-1.5 bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
              >
                <span className={`w-2 h-2 rounded-full ${shop.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                <span className="font-semibold text-white">{shop.isOpen ? 'Open' : 'Closed'}</span>
              </button>
              <span className="text-blue-200">|</span>
              <span className="text-blue-100 text-[11px]">Closes at {shop.closingTime}</span>
            </div>
          </div>

          {/* Quick share button */}
          <button
            onClick={handleShareShop}
            title="Share Shop"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main Body with Negative Margin Overlap */}
      <div className="flex-1 px-4 -mt-5 space-y-4 pb-6 z-20">
        
        {/* Today's Summary Card matching screenshot 7 */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          
          {/* Card Title & Date Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-800">Today's Summary</span>
            </div>

            {/* Date Picker trigger */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{selectedDate}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showDatePicker && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-30">
                  {['08 May 2025', '07 May 2025', '06 May 2025', 'This Month'].map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        setSelectedDate(d);
                        setShowDatePicker(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-blue-50 rounded-lg"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 4 Metrics in a row */}
          <div className="grid grid-cols-4 gap-2 pt-3 text-center">
            
            {/* New Orders */}
            <div 
              onClick={() => navigateTo('seller_orders')}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-blue-50/50 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 leading-tight">
                {newOrders.length}
              </span>
              <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                New Orders
              </span>
            </div>

            {/* Total Orders */}
            <div 
              onClick={() => navigateTo('seller_orders')}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-emerald-50/50 transition-colors cursor-pointer border-l border-slate-100"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 leading-tight">
                {totalOrdersCount}
              </span>
              <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                Total Orders
              </span>
            </div>

            {/* Total Sales */}
            <div 
              onClick={() => navigateTo('seller_more_subscreen')}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-amber-50/50 transition-colors cursor-pointer border-l border-slate-100"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                <IndianRupee className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 leading-tight">
                ₹{totalSalesAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                Total Sales
              </span>
            </div>

            {/* Shop Rating */}
            <div 
              onClick={() => navigateTo('seller_more')}
              className="flex flex-col items-center p-2 rounded-2xl hover:bg-purple-50/50 transition-colors cursor-pointer border-l border-slate-100"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                <Star className="w-5 h-5 fill-purple-600 text-purple-600" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 leading-tight">
                {shop.rating.toFixed(1)}
              </span>
              <span className="text-[10px] font-medium text-slate-500 mt-0.5">
                Shop Rating
              </span>
            </div>

          </div>

        </div>

        {/* Ad Space Section matching screenshot 7 & 8 */}
        {ads.length > 0 ? (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>Live Shop Advertisement</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {ads[0].status}
              </span>
            </div>

            <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-100">
              <img
                src={ads[0].mediaUrl}
                alt={ads[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-3 flex flex-col justify-end text-white">
                <h4 className="text-sm font-bold line-clamp-1">{ads[0].title}</h4>
                <p className="text-[11px] text-slate-200 line-clamp-1">{ads[0].description}</p>
                <span className="text-[9px] text-emerald-400 font-semibold mt-1">
                  Valid until {ads[0].validUntil}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-[11px] text-slate-500">Seen by ~840 local shoppers</span>
              <button
                onClick={() => navigateTo('seller_create_ad')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Edit or Add New</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => navigateTo('seller_create_ad')}
            className="border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50/80 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Ad Space</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
              Your ad will be shown here. You can add your own banner or offer
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-full shadow-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Shop Ad</span>
            </div>
          </div>
        )}

        {/* Quick Incoming Orders Feed */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
            <button
              onClick={() => navigateTo('seller_orders')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 3).map(order => (
              <div
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  navigateTo('seller_order_details');
                }}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 flex items-center justify-between cursor-pointer transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{order.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      order.status === 'new'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'preparing'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {order.customerName} • {order.items.length} Items
                  </p>
                </div>

                <div className="text-right">
                  <div className="font-extrabold text-sm text-slate-900">₹{order.totalAmount}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{order.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Seller Bottom Nav */}
      <SellerBottomNav />

      {/* Real-time Order Notifications Modal */}
      <SellerNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

    </div>
  );
};
