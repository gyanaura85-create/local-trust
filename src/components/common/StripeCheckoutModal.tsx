import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CreditCard, Lock, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const StripeCheckoutModal: React.FC = () => {
  const { isStripeModalOpen, closeStripeCheckout, stripeOrderPending, confirmStripePayment } = useApp();

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState('Ramesh Kumar');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isStripeModalOpen || !stripeOrderPending) return null;

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('08/29');
    setCvc('924');
    setCardHolder('Ramesh Kumar');
    setError(null);
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvc) {
      setError('Please provide valid card credentials');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Simulate real Stripe payment processing with 3D Secure verification
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }

      setTimeout(() => {
        setIsSuccess(false);
        confirmStripePayment(cardNumber.slice(-4));
      }, 1400);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Stripe Header */}
        <div className="bg-[#635BFF] p-6 text-white relative">
          <button
            onClick={closeStripeCheckout}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight">stripe</span>
              <span className="text-xs bg-white/20 text-white font-medium px-2 py-0.5 rounded-full">
                TEST MODE
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <Lock className="w-3.5 h-3.5" />
              <span>256-bit Encrypted</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-white/80 text-xs font-medium">Paying NearKart Store</div>
            <div className="text-3xl font-extrabold tracking-tight mt-0.5">
              ₹{stripeOrderPending.amount.toFixed(2)}
            </div>
            <div className="text-xs text-white/90 mt-1 flex items-center gap-1.5">
              <span>{stripeOrderPending.items.length} items</span>
              <span>•</span>
              <span>{stripeOrderPending.deliveryType}</span>
            </div>
          </div>
        </div>

        {/* Card Form */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Payment Authorized!</h3>
              <p className="text-sm text-slate-500 mt-1">Transaction ID: tx_{Math.random().toString(36).substring(2, 10)}</p>
              <p className="text-xs text-emerald-600 font-semibold mt-2">Redirecting to Live Order Tracking...</p>
            </div>
          ) : (
            <form onSubmit={handlePayNow} className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Payment Details
                </span>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="text-xs text-[#635BFF] hover:underline font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Fill Demo Card
                </button>
              </div>

              {/* Name on Card */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent"
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Expiration</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">CVC / CVV</label>
                  <input
                    type="password"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="•••"
                    maxLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-[#635BFF] hover:bg-[#5346E0] active:scale-[0.99] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{stripeOrderPending.amount.toFixed(2)} with Stripe</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>PCI-DSS Level 1 Certified • End-to-end Tokenized</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
