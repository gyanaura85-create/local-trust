import React from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerBottomNav } from './BuyerBottomNav';
import { ShoppingBag, ChevronRight, Clock, Truck, ArrowRight, RotateCcw } from 'lucide-react';
import { Order } from '../../types';

export const BuyerOrders: React.FC = () => {
  const { orders, setSelectedOrder, navigateTo, showToast } = useApp();

  const handleTrack = (order: Order) => {
    setSelectedOrder(order);
    navigateTo('buyer_track_order');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full pb-8">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20">
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">My Orders</h1>
        <p className="text-xs text-slate-500 font-medium">Track live orders and view past purchases</p>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-4 space-y-3.5 max-w-lg mx-auto w-full">
        {orders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white rounded-3xl p-8 border border-slate-200">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">No orders yet</h3>
            <p className="text-xs text-slate-400 mt-1">Start shopping from stores around your neighbourhood.</p>
          </div>
        ) : (
          orders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-slate-900">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                    order.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : order.status === 'out_for_delivery'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{order.createdAt}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={order.items[0]?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                    alt="Order Item"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {order.items[0]?.name}
                    {order.items.length > 1 && ` + ${order.items.length - 1} more items`}
                  </h4>
                  <div className="text-xs font-black text-slate-900 mt-0.5">
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {order.deliveryType} • Paid with {order.paymentMethod}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleTrack(order)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Live Track</span>
                </button>

                <button
                  onClick={() => {
                    showToast('Items reordered into cart', 'success');
                    navigateTo('buyer_cart');
                  }}
                  className="px-3 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reorder</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <BuyerBottomNav />
    </div>
  );
};
