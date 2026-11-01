import React from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerBottomNav } from './BuyerBottomNav';
import { 
  ArrowLeft, 
  HelpCircle, 
  MapPin, 
  RotateCcw, 
  Headphones, 
  CheckCircle2, 
  Truck, 
  Check, 
  ChevronRight
} from 'lucide-react';

export const BuyerTrackOrder: React.FC = () => {
  const { 
    selectedOrder, 
    orders, 
    goBack, 
    navigateTo, 
    showToast 
  } = useApp();

  const activeOrder = selectedOrder || orders[0];

  if (!activeOrder) {
    return (
      <div className="p-8 text-center bg-white min-h-full flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">No active order to track.</p>
        <button
          onClick={() => navigateTo('buyer_home')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return Home
        </button>
      </div>
    );
  }

  const handleHelp = () => {
    showToast('Connecting you with Sharma General Store support...', 'info');
  };

  const handleReorder = () => {
    showToast(`Items from order ${activeOrder.id} added to cart!`, 'success');
    navigateTo('buyer_cart');
  };

  const statusSteps = [
    { key: 'new', label: 'Order Placed', desc: 'Order received and confirmed' },
    { key: 'accepted', label: 'Order Accepted', desc: 'Seller confirmed order' },
    { key: 'preparing', label: 'Preparing', desc: 'Seller is preparing your order' },
    { key: 'ready', label: 'Ready', desc: 'Your order will be ready soon' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Your order is on the way' },
    { key: 'delivered', label: 'Delivered', desc: 'Your order will be delivered' }
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === activeOrder.status);

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full pb-8">
      
      {/* Top Header matching screenshot 12 */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">My Order</h1>
            <span className="text-xs font-mono font-bold text-blue-600">{activeOrder.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={handleHelp}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600"
          >
            <span>Help</span>
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Track Body */}
      <div className="p-4 space-y-4 max-w-lg mx-auto w-full">
        
        {/* Estimated Delivery Card matching screenshot 12 */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block">Estimated Delivery</span>
            <div className="text-xs sm:text-sm font-extrabold text-emerald-700 mt-1">
              {activeOrder.estimatedDelivery}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Current status: <strong className="text-blue-600 capitalize">{activeOrder.status.replace(/_/g, ' ')}</strong>
            </div>
          </div>

          {/* Delivery Rider Scooter Illustration */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-10">
              {/* Delivery box */}
              <rect x="6" y="14" width="14" height="16" rx="2" fill="#16A34A" />
              <line x1="8" y1="22" x2="18" y2="22" stroke="#FFFFFF" strokeWidth="1.5" />
              {/* Scooter frame */}
              <path d="M18 30H38L44 18H50" stroke="#004BB7" strokeWidth="3" strokeLinecap="round" />
              <path d="M38 18L32 30H24" stroke="#004BB7" strokeWidth="2.5" />
              {/* Rider body */}
              <circle cx="34" cy="10" r="4.5" fill="#1E293B" />
              <path d="M30 15L38 22" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
              {/* Wheels */}
              <circle cx="16" cy="34" r="5" fill="#1E40AF" stroke="#60A5FA" strokeWidth="2" />
              <circle cx="44" cy="34" r="5" fill="#1E40AF" stroke="#60A5FA" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Dynamic Order Status Stepper matching screenshot 12 */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Order Status</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
              <span>Real-Time Updates</span>
            </span>
          </div>

          {/* Vertical Timeline */}
          <div className="space-y-4 pl-1">
            {statusSteps.map((step, idx) => {
              const isPast = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;
              const isFuture = currentStepIndex < idx;

              // Find timestamp if stored in timeline
              const stepData = activeOrder.statusTimeline.find(s => s.status === step.key);
              const timeDisplay = stepData?.timestamp || '';

              return (
                <div key={step.key} className="flex items-start gap-3.5 relative group">
                  
                  {/* Connecting Line */}
                  {idx < statusSteps.length - 1 && (
                    <div 
                      className={`absolute left-3.5 top-7 w-0.5 h-8 transition-colors ${
                        isPast ? 'bg-emerald-500' : 'bg-slate-200'
                      }`} 
                    />
                  )}

                  {/* Icon Node */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                    isPast
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm'
                      : 'bg-white border-2 border-slate-300 text-slate-300'
                  }`}>
                    {isPast ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isCurrent ? 'text-blue-700 text-sm' : isPast ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                      {timeDisplay && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {timeDisplay.includes(',') ? timeDisplay.split(',')[1] : timeDisplay}
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 leading-snug ${
                      isCurrent ? 'text-blue-900 font-medium' : 'text-slate-500'
                    }`}>
                      {stepData?.note || step.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Information Card */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Delivery Information
          </div>
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-900 block">{activeOrder.deliveryType}</span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{activeOrder.customerAddress}</p>
              <button 
                onClick={() => showToast('Tracking delivery on map...', 'info')}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Order Summary
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <span className="text-slate-600">{activeOrder.items.length} Items</span>
            <button 
              onClick={() => showToast('All 10 items verified and packed', 'info')}
              className="text-blue-600 font-bold hover:underline"
            >
              View Details
            </button>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
            <span>Total Amount</span>
            <span className="text-emerald-700 text-base font-extrabold">₹{activeOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Need Help Card */}
        <div 
          onClick={handleHelp}
          className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Need Help?</h4>
              <p className="text-[11px] text-slate-500">Chat with us or call the store</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Reorder Button matching screenshot 12 */}
        <button
          onClick={handleReorder}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reorder</span>
        </button>

        {/* Footnote callout badge matching screenshot 12 */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Buyer can see real-time order status as updated by the seller.</span>
        </div>

      </div>

      {/* Buyer Bottom Nav */}
      <BuyerBottomNav />

    </div>
  );
};
