import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  X, 
  Volume2, 
  VolumeX, 
  Zap, 
  Play, 
  CheckCircle, 
  Clock, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { playOrderAlertSound } from '../../utils/audioAlert';

interface SellerNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellerNotificationModal: React.FC<SellerNotificationModalProps> = ({ isOpen, onClose }) => {
  const { 
    orders, 
    realtimeStatus, 
    isAudioMuted, 
    toggleAudioMute, 
    simulateIncomingOrder, 
    setSelectedOrder, 
    navigateTo, 
    unreadOrdersCount, 
    clearUnreadOrders,
    showToast 
  } = useApp();

  if (!isOpen) return null;

  const handleSelectOrder = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    onClose();
    navigateTo('seller_order_details');
  };

  const handleTestChime = () => {
    playOrderAlertSound();
    showToast('Chime test played via Web Audio API 🔔', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
        
        {/* Header */}
        <div className="bg-[#004BB7] text-white p-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 text-white flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                  <span>Order Alerts</span>
                  {unreadOrdersCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500 text-white font-black">
                      {unreadOrdersCount} new
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-blue-100 font-medium">
                    Supabase Realtime: {realtimeStatus === 'SUBSCRIBED' ? 'Active & Listening' : realtimeStatus}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Bar inside Header */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudioMute}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold transition-colors cursor-pointer"
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
              <span>{isAudioMuted ? 'Muted' : 'Sound On'}</span>
            </button>

            {/* Test Sound */}
            <button
              onClick={handleTestChime}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-blue-100 font-medium transition-colors cursor-pointer"
              title="Test audio chime"
            >
              <Play className="w-3 h-3 text-white" />
              <span>Test Bell</span>
            </button>

            {/* Mark read */}
            {unreadOrdersCount > 0 && (
              <button
                onClick={clearUnreadOrders}
                className="text-[11px] text-blue-200 hover:text-white font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Live Simulation Banner */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-slate-200/60 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Simulate Real-time Buyer Order</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dispatches an order via Supabase channel to test instant seller chime & alert
            </p>
          </div>

          <button
            onClick={() => {
              simulateIncomingOrder();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#004BB7] hover:bg-[#003C94] active:scale-95 text-white font-bold text-xs whitespace-nowrap shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate</span>
          </button>
        </div>

        {/* Order Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[360px]">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Recent Incoming Orders
          </h4>

          {orders.slice(0, 6).map((order) => {
            const isNew = order.status === 'new';
            return (
              <div
                key={order.id}
                onClick={() => handleSelectOrder(order)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isNew
                    ? 'bg-blue-50/70 border-blue-200 hover:bg-blue-50'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isNew ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    <ShoppingBag className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold capitalize ${
                        isNew ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-0.5">
                      {order.customerName} • {order.items.length} items
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{order.timeAgo}</span>
                      <span>•</span>
                      <span className="text-slate-600 font-semibold">{order.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right pl-2">
                  <span className="font-extrabold text-sm text-slate-900 block">
                    ₹{order.totalAmount}
                  </span>
                  <span className="text-[10px] text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5 mt-1">
                    View <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Real-time subscription active</span>
          </div>

          <button
            onClick={() => {
              onClose();
              navigateTo('seller_orders');
            }}
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            Go to Orders Manager →
          </button>
        </div>

      </div>
    </div>
  );
};
