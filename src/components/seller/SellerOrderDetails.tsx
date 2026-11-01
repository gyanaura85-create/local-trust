import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  PhoneCall, 
  MapPin, 
  FileText, 
  Check, 
  X, 
  Clock, 
  Truck, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { OrderStatus } from '../../types';

export const SellerOrderDetails: React.FC = () => {
  const { 
    selectedOrder, 
    goBack, 
    updateOrderStatus, 
    navigateTo, 
    showToast 
  } = useApp();

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  if (!selectedOrder) {
    return (
      <div className="p-8 text-center bg-white min-h-full flex flex-col items-center justify-center">
        <p className="text-slate-500 text-sm">No order selected.</p>
        <button
          onClick={goBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleStatusClick = (newStatus: OrderStatus) => {
    updateOrderStatus(selectedOrder.id, newStatus);
  };

  const handleCall = () => {
    showToast(`Calling customer ${selectedOrder.customerName} on ${selectedOrder.customerPhone}...`, 'info');
  };

  const statusPipeline: { key: OrderStatus; label: string }[] = [
    { key: 'new', label: 'New' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' }
  ];

  const currentStatusIndex = statusPipeline.findIndex(s => s.key === selectedOrder.status);

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full pb-8">
      
      {/* Top Header matching screenshot 12 */}
      <div className="w-full bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">Order Details</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-mono font-bold text-blue-600">{selectedOrder.id}</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold capitalize ${
                selectedOrder.status === 'new'
                  ? 'bg-blue-100 text-blue-700'
                  : selectedOrder.status === 'preparing'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedOrder.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Body */}
      <div className="p-4 space-y-3.5 max-w-lg mx-auto w-full">
        
        {/* Customer Card */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-base">
              {selectedOrder.customerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{selectedOrder.customerName}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedOrder.customerPhone}</p>
            </div>
          </div>

          <button
            onClick={handleCall}
            className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Call</span>
          </button>
        </div>

        {/* Delivery Information Card */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Delivery Information
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <Truck className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900">{selectedOrder.deliveryType}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {selectedOrder.customerAddress}
              </p>
              
              <button
                onClick={() => setShowMapModal(true)}
                className="mt-2 text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>View on Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            Order Summary
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items</span>
              <span className="font-semibold text-slate-900">{selectedOrder.items.length} Items</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">₹{selectedOrder.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Delivery Charge</span>
              <span className="font-semibold text-slate-900">₹{selectedOrder.deliveryCharge.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-sm font-bold text-slate-900">
              <span>Total Amount</span>
              <span className="text-emerald-700 text-base font-extrabold">₹{selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => setShowInvoiceModal(true)}
            className="w-full mt-3 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>View Bill / Invoice</span>
            </div>
            <span>›</span>
          </button>
        </div>

        {/* Order Items Card matching screenshot 12 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold text-slate-900">
              Order Items ({selectedOrder.items.length})
            </div>
            <span className="text-[11px] font-semibold text-blue-600 cursor-pointer hover:underline">
              View All
            </span>
          </div>

          <div className="divide-y divide-slate-100 space-y-2.5">
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 truncate">{item.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.quantity} x ₹{item.price}
                    </div>
                  </div>
                </div>

                <div className="font-extrabold text-slate-900 shrink-0">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Update Order Status Stepper & Action Grid matching screenshot 12 */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
          <div className="text-xs font-bold text-slate-900 mb-3">
            Update Order Status
          </div>

          {/* Stepper Pipeline Indicator */}
          <div className="relative mb-5 px-2">
            <div className="absolute top-3 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
            <div 
              className="absolute top-3 left-4 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
              style={{
                width: `${Math.max(0, Math.min(100, (currentStatusIndex / (statusPipeline.length - 1)) * 100))}%`
              }}
            />

            <div className="flex justify-between items-center relative z-10 text-[9px] font-semibold text-slate-500">
              {statusPipeline.map((step, idx) => {
                const isPassed = currentStatusIndex >= idx;
                const isCurrent = currentStatusIndex === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isPassed
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}>
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span className={`mt-1 whitespace-nowrap text-[9px] ${
                      isCurrent ? 'text-blue-700 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6 Action Status Buttons matching screenshot 12 */}
          <div className="grid grid-cols-2 gap-2.5">
            
            {/* Accept Order */}
            <button
              onClick={() => handleStatusClick('accepted')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedOrder.status === 'accepted'
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-300'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Accept Order</span>
            </button>

            {/* Reject Order */}
            <button
              onClick={() => handleStatusClick('rejected')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedOrder.status === 'rejected'
                  ? 'bg-rose-700 text-white ring-2 ring-rose-300'
                  : 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
              }`}
            >
              <X className="w-4 h-4" />
              <span>Reject Order</span>
            </button>

            {/* Start Preparing */}
            <button
              onClick={() => handleStatusClick('preparing')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedOrder.status === 'preparing'
                  ? 'bg-blue-700 text-white ring-2 ring-blue-300'
                  : 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Start Preparing</span>
            </button>

            {/* Mark as Ready */}
            <button
              onClick={() => handleStatusClick('ready')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedOrder.status === 'ready'
                  ? 'bg-purple-700 text-white ring-2 ring-purple-300'
                  : 'bg-purple-50 text-purple-700 border border-purple-300 hover:bg-purple-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Ready</span>
            </button>

            {/* Out for Delivery */}
            <button
              onClick={() => handleStatusClick('out_for_delivery')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedOrder.status === 'out_for_delivery'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Out for Delivery</span>
            </button>

            {/* Mark as Delivered */}
            <button
              onClick={() => handleStatusClick('delivered')}
              className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                selectedOrder.status === 'delivered'
                  ? 'bg-emerald-800 text-white ring-2 ring-emerald-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-400 hover:bg-emerald-100'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Mark as Delivered</span>
            </button>

          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Update the status as per the order progress.</span>
          </p>
        </div>

      </div>

      {/* Bill / Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-base text-slate-900">Tax Invoice & Bill</span>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Invoice #INV-{selectedOrder.id.replace('#', '')}</span>
                  <span className="text-emerald-700">PAID</span>
                </div>
                <div className="text-[11px] text-slate-500">Date: {selectedOrder.createdAt}</div>
                <div className="text-[11px] text-slate-500">Payment: {selectedOrder.paymentMethod}</div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Purchased Items:</span>
                <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="py-1 flex justify-between">
                      <span className="text-slate-700">{it.name} (x{it.quantity})</span>
                      <span className="font-semibold text-slate-900">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span>₹{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t">
                  <span>Total Paid</span>
                  <span className="text-emerald-700">₹{selectedOrder.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                  setShowInvoiceModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Bill</span>
              </button>
              <button
                onClick={() => {
                  showToast('Invoice PDF downloaded', 'success');
                  setShowInvoiceModal(false);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1"
              >
                <Download className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Map View Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-sm text-slate-900">Delivery Route Location</span>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Map Canvas Preview */}
            <div className="w-full h-48 rounded-2xl bg-blue-50 border border-blue-200 relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2563EB" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Store & Destination Pins */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-white/95 px-2 py-0.5 rounded-full shadow-xs mt-1 text-slate-800">
                  {selectedOrder.customerAddress.split(',')[0]}
                </span>
                <span className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                  Distance: 1.8 km (Est. 8 mins)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              <strong>Customer Address:</strong> {selectedOrder.customerAddress}
            </p>

            <button
              onClick={() => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder.customerAddress)}`, '_blank');
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in Google Maps</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
