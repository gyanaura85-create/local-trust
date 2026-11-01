import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BuyerBottomNav } from './BuyerBottomNav';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ShoppingBag,
  Store,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BuyerCart: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    cartItemCount, 
    userLocation, 
    createBuyerOrder, 
    openStripeCheckout, 
    goBack, 
    navigateTo, 
    showToast 
  } = useApp();

  const [deliveryType, setDeliveryType] = useState<'Home Delivery' | 'Store Pickup'>('Home Delivery');
  const [paymentMethod, setPaymentMethod] = useState<'Stripe Card' | 'Cash on Delivery' | 'UPI'>('Stripe Card');
  const [deliveryAddress, setDeliveryAddress] = useState(userLocation || 'Bapuji Nagar, Bhubaneswar, Odisha 751009');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const deliveryFee = deliveryType === 'Home Delivery' ? 40 : 0;
  const platformFee = 5;
  const grandTotal = cartTotal + deliveryFee + platformFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }

    if (paymentMethod === 'Stripe Card') {
      // Launch integrated Stripe Checkout modal!
      openStripeCheckout(cart, deliveryType, deliveryAddress, grandTotal);
    } else {
      // Direct cash on delivery or UPI checkout
      const newOrder = createBuyerOrder(cart, deliveryType, deliveryAddress, paymentMethod);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
      navigateTo('buyer_track_order');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 min-h-full pb-8">
      
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">My Shopping Cart</h1>
            <p className="text-[11px] text-slate-500 font-medium">{cartItemCount} items selected</p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 p-8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-base font-bold text-slate-800">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Explore fresh groceries and daily essentials from your neighbourhood shops.
          </p>
          <button
            onClick={() => navigateTo('buyer_home')}
            className="mt-4 px-6 py-3 bg-[#004BB7] hover:bg-[#003C94] text-white text-xs font-bold rounded-2xl shadow-md transition-colors"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex-1 p-4 space-y-4 max-w-lg mx-auto w-full">
          
          {/* Cart Items List */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 divide-y divide-slate-100">
            {cart.map(item => (
              <div key={item.product.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">₹{item.product.price.toFixed(2)} each</div>
                  <div className="text-xs font-black text-slate-900 mt-1">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, -1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-white rounded-lg transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Options Card */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
              Delivery Preference
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('Home Delivery')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  deliveryType === 'Home Delivery'
                    ? 'border-blue-500 bg-blue-50/60 text-blue-900 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Home Delivery</div>
                  <div className="text-[10px] text-slate-500 font-normal">₹40 • 30 mins</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('Store Pickup')}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  deliveryType === 'Store Pickup'
                    ? 'border-emerald-500 bg-emerald-50/60 text-emerald-900 font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold">Store Pickup</div>
                  <div className="text-[10px] text-slate-500 font-normal">Free • Self pickup</div>
                </div>
              </button>
            </div>

            {/* Address */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-800">Delivering To:</span>
                  {isEditingAddress ? (
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1 text-xs border border-blue-400 rounded-lg"
                    />
                  ) : (
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">{deliveryAddress}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-xs font-bold text-blue-600 hover:underline shrink-0"
              >
                {isEditingAddress ? 'Done' : 'Change'}
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Select Payment Method
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                100% Secure
              </span>
            </div>

            <div className="space-y-2">
              
              {/* Stripe Payment Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Stripe Card')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  paymentMethod === 'Stripe Card'
                    ? 'border-[#635BFF] bg-indigo-50/60 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Credit / Debit Card (Stripe)</span>
                      <span className="text-[9px] bg-[#635BFF] text-white px-1.5 py-0.2 rounded-full font-bold">
                        RECOMMENDED
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">Visa, Mastercard, RuPay & Apple Pay</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'Stripe Card' ? 'border-[#635BFF] bg-[#635BFF]' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'Stripe Card' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    UPI
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">UPI Instant Pay</div>
                    <div className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'UPI' ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'UPI' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              {/* Cash On Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                    COD
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Cash on Delivery</div>
                    <div className="text-[10px] text-slate-500">Pay when order reaches your doorstep</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'Cash on Delivery' ? 'border-amber-600 bg-amber-600' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'Cash on Delivery' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

            </div>
          </div>

          {/* Bill Breakdown */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Total</span>
              <span className="font-semibold text-slate-900">₹{cartTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Delivery Partner Fee</span>
              <span className="font-semibold text-slate-900">
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>Platform & Handling Fee</span>
              <span className="font-semibold text-slate-900">₹{platformFee.toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-extrabold text-slate-900">
              <span>To Pay</span>
              <span className="text-emerald-700 text-base">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            onClick={handleCheckout}
            className="w-full py-4 px-6 rounded-2xl bg-[#004BB7] hover:bg-[#003C94] active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            {paymentMethod === 'Stripe Card' ? (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{grandTotal.toFixed(2)} with Stripe</span>
              </>
            ) : (
              <>
                <span>Place Order (₹{grandTotal.toFixed(2)})</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NearKart Buyer Guarantee • 100% Genuine Local Stores</span>
          </div>

        </div>
      )}

      {/* Buyer Bottom Nav */}
      <BuyerBottomNav />

    </div>
  );
};
