import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
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
  Save, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
  Send
} from 'lucide-react';

export const SellerMoreSubscreens: React.FC = () => {
  const { 
    activeMoreSubscreen, 
    closeMoreSubscreen, 
    shop, 
    updateShop, 
    products, 
    updateProduct, 
    reviews, 
    addReviewReply, 
    showToast,
    logout
  } = useApp();

  // Manage Shop state
  const [shopName, setShopName] = useState(shop.name);
  const [ownerName, setOwnerName] = useState(shop.ownerName);
  const [phone, setPhone] = useState(shop.phone);
  const [email, setEmail] = useState(shop.email || '');
  const [address, setAddress] = useState(shop.address);
  const [description, setDescription] = useState(shop.description || '');

  // Business Hours state
  const [openingTime, setOpeningTime] = useState('08:00 AM');
  const [closingTime, setClosingTime] = useState(shop.closingTime);
  const [workingDays, setWorkingDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  // Delivery & Pickup state
  const [minOrder, setMinOrder] = useState(shop.minimumOrder.toString());
  const [deliveryFee, setDeliveryFee] = useState(shop.deliveryFee.toString());
  const [zones, setZones] = useState<string[]>(shop.deliveryZones);
  const [newZoneInput, setNewZoneInput] = useState('');

  // Payment & Bank Details (including Stripe)
  const [bankName, setBankName] = useState(shop.bankDetails.bankName);
  const [accountNumber, setAccountNumber] = useState(shop.bankDetails.accountNumber);
  const [ifsc, setIfsc] = useState(shop.bankDetails.ifscCode);
  const [upi, setUpi] = useState(shop.bankDetails.upiId);
  const [isStripeConnected, setIsStripeConnected] = useState(shop.bankDetails.stripeConnected);

  // Deals & Offers
  const [discountPercent, setDiscountPercent] = useState('15');
  const [promoCode, setPromoCode] = useState('NEARKART15');

  // Customer Reviews reply state
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Language state
  const [selectedLang, setSelectedLang] = useState('English');

  // Notifications state
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(true);
  const [notifSound, setNotifSound] = useState(true);

  if (!activeMoreSubscreen) return null;

  const handleSaveShopInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop({
      name: shopName,
      ownerName,
      phone,
      email,
      address,
      description
    });
    closeMoreSubscreen();
  };

  const handleSaveHours = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop({
      closingTime
    });
    showToast(`Store business hours updated: ${openingTime} to ${closingTime}`, 'success');
    closeMoreSubscreen();
  };

  const handleAddZone = () => {
    if (!newZoneInput.trim()) return;
    setZones(prev => [...prev, newZoneInput.trim()]);
    setNewZoneInput('');
    showToast(`Added delivery zone: ${newZoneInput}`, 'success');
  };

  const handleSaveDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop({
      deliveryZones: zones,
      minimumOrder: parseFloat(minOrder) || 99,
      deliveryFee: parseFloat(deliveryFee) || 30
    });
    showToast('Delivery & pickup settings saved', 'success');
    closeMoreSubscreen();
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop({
      bankDetails: {
        ...shop.bankDetails,
        bankName,
        accountNumber,
        ifscCode: ifsc,
        upiId: upi,
        stripeConnected: isStripeConnected
      }
    });
    showToast('Payment & payout credentials securely linked', 'success');
    closeMoreSubscreen();
  };

  const handleToggleStripe = () => {
    const next = !isStripeConnected;
    setIsStripeConnected(next);
    showToast(next ? 'Stripe Merchant Account linked!' : 'Stripe unlinked', 'info');
  };

  const handlePostReply = (reviewId: string) => {
    const text = replyInputs[reviewId];
    if (!text?.trim()) return;
    addReviewReply(reviewId, text.trim());
    setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-full">
      
      {/* Subscreen Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
        <button
          onClick={closeMoreSubscreen}
          className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h2 className="text-base font-bold text-slate-900 capitalize">
          {activeMoreSubscreen.replace(/_/g, ' ')}
        </h2>

        <div className="w-9" />
      </div>

      <div className="flex-1 p-5 overflow-y-auto max-w-lg mx-auto w-full space-y-5">
        
        {/* 1. MANAGE YOUR SHOP */}
        {activeMoreSubscreen === 'manage_shop' && (
          <form onSubmit={handleSaveShopInfo} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
              <input
                type="text"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={e => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Physical Store Address</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Shop Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Shop Details</span>
            </button>
          </form>
        )}

        {/* 2. BUSINESS HOURS */}
        {activeMoreSubscreen === 'business_hours' && (
          <form onSubmit={handleSaveHours} className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-900 leading-relaxed">
              Customers in your area see whether your shop is open or closed based on these hours.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daily Opening</label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={e => setOpeningTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Daily Closing</label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={e => setClosingTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Operational Days</label>
              <div className="grid grid-cols-4 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                  const isSelected = workingDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => {
                        setWorkingDays(prev => 
                          isSelected ? prev.filter(d => d !== day) : [...prev, day]
                        );
                      }}
                      className={`py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Business Hours</span>
            </button>
          </form>
        )}

        {/* 3. DELIVERY & PICKUP */}
        {activeMoreSubscreen === 'delivery_pickup' && (
          <form onSubmit={handleSaveDelivery} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Min Order Amount (₹)</label>
                <input
                  type="number"
                  value={minOrder}
                  onChange={e => setMinOrder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Charge (₹)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={e => setDeliveryFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Active Delivery Neighbourhoods</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newZoneInput}
                  onChange={e => setNewZoneInput(e.target.value)}
                  placeholder="e.g. Nayapalli, Old Town"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddZone}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                >
                  Add Zone
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {zones.map((z, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
                  >
                    <span>{z}</span>
                    <button
                      type="button"
                      onClick={() => setZones(zones.filter((_, i) => i !== idx))}
                      className="text-blue-500 hover:text-rose-600 text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Delivery Parameters</span>
            </button>
          </form>
        )}

        {/* 4. PAYMENT & BANK DETAILS (STRIPE + UPI) */}
        {activeMoreSubscreen === 'payment_bank' && (
          <form onSubmit={handleSaveBankDetails} className="space-y-4">
            
            {/* Stripe Merchant Integration Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#635BFF]/10 to-indigo-50 border border-[#635BFF]/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl text-[#635BFF] tracking-tight">stripe</span>
                  <span className="text-[10px] font-bold bg-[#635BFF] text-white px-2 py-0.5 rounded-full">
                    {isStripeConnected ? 'CONNECTED' : 'DISCONNECTED'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleStripe}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors ${
                    isStripeConnected
                      ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                      : 'bg-[#635BFF] text-white hover:bg-[#5248e0]'
                  }`}
                >
                  {isStripeConnected ? 'Disconnect' : 'Connect Stripe'}
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Receive instant online card & digital wallet payments directly into your bank account with automated daily payouts.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={e => setIfsc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">UPI ID (e.g. VPA)</label>
              <input
                type="text"
                value={upi}
                onChange={e => setUpi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Payment Details</span>
            </button>
          </form>
        )}

        {/* 5. CATEGORIES */}
        {activeMoreSubscreen === 'categories' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Active product categories in your shop:
            </p>

            <div className="space-y-2">
              {Array.from(new Set(products.map(p => p.category))).map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <div key={cat} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {cat.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{cat}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border">
                      {count} products
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. INVENTORY */}
        {activeMoreSubscreen === 'inventory' && (
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Low Stock Alerts are triggered when items drop below 20 units.</span>
            </div>

            <div className="space-y-2">
              {products.map(prod => (
                <div key={prod.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{prod.name}</h4>
                    <span className={`text-[10px] font-bold ${
                      prod.stock === 0 ? 'text-rose-600' : prod.stock < 20 ? 'text-amber-600' : 'text-emerald-700'
                    }`}>
                      {prod.stock} units left • {prod.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateProduct(prod.id, { stock: Math.max(0, prod.stock - 5) })}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold hover:bg-slate-100"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => updateProduct(prod.id, { stock: prod.stock + 10, status: 'In Stock' })}
                      className="px-2.5 h-7 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                    >
                      +10
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. DEALS & OFFERS */}
        {activeMoreSubscreen === 'deals_offers' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <h3 className="text-sm font-extrabold">Active Store Coupon</h3>
              <p className="text-2xl font-black tracking-wider mt-1 font-mono">{promoCode}</p>
              <p className="text-xs text-white/90 mt-1">Get flat {discountPercent}% OFF on orders above ₹499</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  value={discountPercent}
                  onChange={e => setDiscountPercent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <button
                type="button"
                onClick={() => showToast(`Coupon ${promoCode} published live to local buyers!`, 'success')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Apply Coupon Store-Wide
              </button>
            </div>
          </div>
        )}

        {/* 8. SALES REPORT */}
        {activeMoreSubscreen === 'sales_report' && (
          <div className="space-y-4">
            
            {/* KPI overview */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <span className="text-[11px] font-bold text-blue-700">Monthly Revenue</span>
                <div className="text-xl font-extrabold text-blue-950 mt-1">₹48,250</div>
                <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% vs last month
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-700">Orders Fulfilled</span>
                <div className="text-xl font-extrabold text-emerald-950 mt-1">312</div>
                <span className="text-[10px] text-slate-500 font-medium mt-1 block">99.2% on-time delivery</span>
              </div>
            </div>

            {/* Visual Bar chart mock */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-800 mb-3">Weekly Sales Trend (₹)</h4>
              <div className="flex items-end justify-between h-36 pt-4 gap-2">
                {[
                  { day: 'Mon', val: 4200, h: '60%' },
                  { day: 'Tue', val: 5600, h: '75%' },
                  { day: 'Wed', val: 3900, h: '50%' },
                  { day: 'Thu', val: 6800, h: '85%' },
                  { day: 'Fri', val: 7400, h: '95%' },
                  { day: 'Sat', val: 8900, h: '100%' },
                  { day: 'Sun', val: 8100, h: '90%' }
                ].map(item => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-semibold text-slate-500 font-mono">₹{item.val / 1000}k</span>
                    <div className="w-full bg-blue-100 rounded-t-lg overflow-hidden flex items-end h-24">
                      <div className="w-full bg-blue-600 rounded-t-lg transition-all" style={{ height: item.h }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 9. CUSTOMERS REVIEWS */}
        {activeMoreSubscreen === 'reviews' && (
          <div className="space-y-3">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                    <span className="text-[10px] text-slate-400">• {rev.date}</span>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  "{rev.comment}"
                </p>

                {rev.reply && (
                  <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900 mt-2">
                    <span className="font-bold block text-[11px] text-blue-700 mb-0.5">Your Response:</span>
                    <span>{rev.reply}</span>
                  </div>
                )}

                {!rev.reply && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write reply to customer..."
                      value={replyInputs[rev.id] || ''}
                      onChange={e => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handlePostReply(rev.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 10. LANGUAGE */}
        {activeMoreSubscreen === 'language' && (
          <div className="space-y-2">
            {[
              { name: 'English', local: 'English' },
              { name: 'Hindi', local: 'हिन्दी' },
              { name: 'Odia', local: 'ଓଡ଼ିଆ' },
              { name: 'Bengali', local: 'বাংলা' },
              { name: 'Urdu', local: 'اردو' },
              { name: 'Telugu', local: 'తెలుగు' }
            ].map(l => (
              <button
                key={l.name}
                type="button"
                onClick={() => {
                  setSelectedLang(l.name);
                  showToast(`Language set to ${l.name} (${l.local})`, 'success');
                  closeMoreSubscreen();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-colors ${
                  selectedLang === l.name
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{l.name}</div>
                  <div className="text-[11px] text-slate-500">{l.local}</div>
                </div>
                {selectedLang === l.name && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        )}

        {/* 11. CUSTOMER SUPPORT */}
        {activeMoreSubscreen === 'support' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 leading-relaxed">
              NearKart Merchant Helpdesk is available 24/7. Reach out directly via toll-free phone or WhatsApp support!
            </div>

            <div className="space-y-2.5">
              <a
                href="tel:18002008080"
                className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 hover:bg-blue-50/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Toll Free Helpline</h4>
                  <p className="text-[11px] text-slate-500">1800-200-8080 (Toll Free)</p>
                </div>
              </a>

              <button
                type="button"
                onClick={() => showToast('Opening Merchant WhatsApp Support Desk...', 'info')}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 hover:bg-emerald-50/50 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">WhatsApp Instant Chat</h4>
                  <p className="text-[11px] text-slate-500">+91 99000 11223</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 12. NOTIFICATIONS */}
        {activeMoreSubscreen === 'notifications' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Order Alerts</h4>
                <p className="text-[11px] text-slate-500">Instant sound and push notification on new orders</p>
              </div>
              <input
                type="checkbox"
                checked={notifOrders}
                onChange={e => setNotifOrders(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Marketing & Promotional Updates</h4>
                <p className="text-[11px] text-slate-500">Tips to boost local shop visibility and sales</p>
              </div>
              <input
                type="checkbox"
                checked={notifMarketing}
                onChange={e => setNotifMarketing(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Audio Chimes</h4>
                <p className="text-[11px] text-slate-500">Play chime when order status updates</p>
              </div>
              <input
                type="checkbox"
                checked={notifSound}
                onChange={e => setNotifSound(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600"
              />
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
