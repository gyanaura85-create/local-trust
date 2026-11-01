import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SellerBottomNav } from './SellerBottomNav';
import { 
  User, 
  Phone, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  Check, 
  X, 
  Clock, 
  MoreHorizontal, 
  Eye, 
  PhoneCall, 
  FileText,
  ChevronRight,
  Filter,
  Zap,
  Volume2,
  VolumeX
} from 'lucide-react';
import { OrderStatus, Order } from '../../types';

export const SellerOrders: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    setSelectedOrder, 
    navigateTo, 
    simulateIncomingOrder,
    isAudioMuted,
    toggleAudioMute,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('New');
  const [selectedOrderForMore, setSelectedOrderForMore] = useState<string | null>(null);

  // Tab definitions matching screenshot 10
  const tabs = [
    { key: 'New', count: orders.filter(o => o.status === 'new').length },
    { key: 'Accepted', count: orders.filter(o => o.status === 'accepted').length },
    { key: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
    { key: 'Ready', count: orders.filter(o => o.status === 'ready').length },
    { key: 'Out for Delivery', count: orders.filter(o => o.status === 'out_for_delivery').length },
    { key: 'Delivered', count: orders.filter(o => o.status === 'delivered').length }
  ];

  const statusTabMap: Record<string, OrderStatus> = {
    'New': 'new',
    'Accepted': 'accepted',
    'Preparing': 'preparing',
    'Ready': 'ready',
    'Out for Delivery': 'out_for_delivery',
    'Delivered': 'delivered'
  };

  const filteredOrders = orders.filter(order => {
    return order.status === statusTabMap[activeTab];
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    navigateTo('seller_order_details');
  };

  const handleNextStatus = (order: Order) => {
    const progression: Record<OrderStatus, OrderStatus> = {
      'new': 'accepted',
      'accepted': 'preparing',
      'preparing': 'ready',
      'ready': 'out_for_delivery',
      'out_for_delivery': 'delivered',
      'delivered': 'delivered',
      'rejected': 'rejected'
    };
    const next = progression[order.status];
    updateOrderStatus(order.id, next);
  };

  const handleCallCustomer = (phone: string, name: string) => {
    showToast(`Calling customer ${name} (${phone})...`, 'info');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        
        <div className="p-4 flex items-center justify-between pb-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Seller Orders
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Real-time incoming orders & delivery updates
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleAudioMute}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isAudioMuted 
                  ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={isAudioMuted ? 'Unmute order bell chime' : 'Mute order chime'}
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={simulateIncomingOrder}
              className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:scale-95 px-2.5 py-1.5 rounded-xl border border-blue-200 transition-all cursor-pointer shadow-xs"
              title="Dispatches an incoming order via Supabase Realtime channel"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>Simulate</span>
            </button>
          </div>
        </div>

        {/* Scrollable Status Tabs matching screenshot 10 */}
        <div className="flex items-center gap-1 px-3 overflow-x-auto no-scrollbar pb-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#004BB7] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.key}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Orders List Container */}
      <div className="flex-1 p-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h3 className="font-bold text-slate-700 text-base">No orders in "{activeTab}"</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              When buyers place orders or status changes occur, they will appear here in real-time.
            </p>
            <button
              onClick={() => setActiveTab('New')}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
            >
              View New Orders
            </button>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 hover:shadow-md transition-shadow relative"
            >
              
              {/* Order ID & Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold text-slate-900">
                    {order.id}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    order.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'preparing'
                      ? 'bg-amber-100 text-amber-700'
                      : order.status === 'ready'
                      ? 'bg-purple-100 text-purple-700'
                      : order.status === 'out_for_delivery'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-rose-100 text-rose-700'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{order.timeAgo}</span>
                </div>
              </div>

              {/* Order Information Rows */}
              <div className="py-3 space-y-2 text-xs">
                
                {/* Customer Name */}
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{order.customerName}</span>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono">{order.customerPhone}</span>
                </div>

                {/* Items & Total Amount */}
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <ShoppingBag className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{order.items.length} Items</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-extrabold">₹{order.totalAmount}</span>
                </div>

                {/* Delivery Type */}
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{order.deliveryType}</span>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2 text-slate-500 text-[11px] leading-relaxed">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{order.customerAddress}</span>
                </div>

              </div>

              {/* Action Buttons Row matching screenshot 10 */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                
                {/* View Details Button */}
                <button
                  onClick={() => handleViewDetails(order)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                {/* Condition: New Order has Accept & Reject buttons */}
                {order.status === 'new' ? (
                  <>
                    <button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => updateOrderStatus(order.id, 'rejected')}
                      className="py-2.5 px-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Progression button */}
                    {order.status !== 'delivered' && (
                      <button
                        onClick={() => handleNextStatus(order)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#004BB7] hover:bg-[#003C94] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                      >
                        <span>Update Status</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* More action button with popover */}
                    <div className="relative">
                      <button
                        onClick={() => setSelectedOrderForMore(selectedOrderForMore === order.id ? null : order.id)}
                        className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                        <span>More</span>
                      </button>

                      {selectedOrderForMore === order.id && (
                        <div className="absolute right-0 bottom-full mb-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-30">
                          <button
                            onClick={() => {
                              handleCallCustomer(order.customerPhone, order.customerName);
                              setSelectedOrderForMore(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 rounded-xl flex items-center gap-2"
                          >
                            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                            <span>Call Customer</span>
                          </button>

                          <button
                            onClick={() => {
                              handleViewDetails(order);
                              setSelectedOrderForMore(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 rounded-xl flex items-center gap-2"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Print Invoice</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>

            </div>
          ))
        )}
      </div>

      {/* Seller Bottom Nav */}
      <SellerBottomNav />

    </div>
  );
};
