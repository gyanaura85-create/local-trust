import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Check, 
  Eye, 
  X, 
  ShoppingBag, 
  MapPin, 
  Zap, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const RealtimeOrderAlert: React.FC = () => {
  const { 
    activeRealtimeAlert, 
    dismissRealtimeAlert, 
    acceptRealtimeAlert, 
    setSelectedOrder, 
    navigateTo, 
    isAudioMuted, 
    toggleAudioMute 
  } = useApp();

  if (!activeRealtimeAlert) return null;

  const order = activeRealtimeAlert;

  const handleView = () => {
    setSelectedOrder(order);
    dismissRealtimeAlert();
    navigateTo('seller_order_details');
  };

  const handleAccept = () => {
    acceptRealtimeAlert(order.id);
  };

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 w-full max-w-md px-3 z-50 animate-bounce-short pointer-events-auto">
      <div className="bg-slate-950/95 text-white rounded-3xl p-4 shadow-2xl border-2 border-amber-400/80 backdrop-blur-xl ring-8 ring-amber-500/20">
        
        {/* Top Header Badge & Audio Control */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse border border-amber-400/30">
              <Bell className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-amber-400 uppercase">
                  New Order Received!
                </span>
                <span className="flex items-center gap-0.5 text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  <Zap className="w-2.5 h-2.5" />
                  Realtime
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Order ID: <span className="text-white font-bold">{order.id}</span></p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleAudioMute}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isAudioMuted 
                  ? 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white' 
                  : 'bg-blue-600/30 text-blue-400 border-blue-500/40 hover:bg-blue-600/50'
              }`}
              title={isAudioMuted ? 'Unmute order chimes' : 'Mute audio chime'}
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={dismissRealtimeAlert}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Order Brief Info */}
        <div className="py-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-100 text-sm">{order.customerName}</span>
            <span className="font-black text-emerald-400 text-sm">₹{order.totalAmount}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">
              {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
            </span>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{order.customerAddress}</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
              {order.deliveryType}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 font-semibold border border-blue-800/50">
              {order.paymentMethod} • {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/40 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept Order</span>
          </button>

          <button
            onClick={handleView}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
        </div>

      </div>
    </div>
  );
};
