import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NearKartLogo } from '../common/NearKartLogo';
import { 
  ArrowLeft, 
  ArrowRight, 
  Store, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  LayoutGrid, 
  ImagePlus, 
  Navigation, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const CATEGORIES = [
  'Grocery & Daily Essentials',
  'Fashion & Clothing',
  'Electronics & Mobiles',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Pharmacy & Health',
  'Food & Restaurant'
];

export const SellerRegisterScreen: React.FC = () => {
  const { goBack, navigateTo, userPhone, updateShop, showToast, setIsAuthenticated } = useApp();

  const [shopName, setShopName] = useState('Sharma General Store');
  const [ownerName, setOwnerName] = useState('Ali Khan');
  const [phoneNumber, setPhoneNumber] = useState(userPhone || '+91 98765 43210');
  const [email, setEmail] = useState('sharma.store@nearkart.com');
  const [location, setLocation] = useState('Bapuji Nagar, Main Market, Bhubaneswar, Odisha 751009');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80'
  );

  const handleDetectLocation = () => {
    setLocation('Shop No. 14, Bapuji Nagar Market, Bhubaneswar (GPS Detected)');
    showToast('GPS coordinates mapped to Bhubaneswar Market', 'success');
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      showToast('Shop photo uploaded', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName || !ownerName || !location) {
      showToast('Please fill required fields', 'warning');
      return;
    }

    updateShop({
      name: shopName,
      ownerName,
      phone: phoneNumber,
      email,
      address: location,
      category,
      photo: photoPreview || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=80'
    });

    setIsAuthenticated(true);
    showToast('Shop successfully registered and activated!', 'success');
    navigateTo('seller_dashboard');
  };

  return (
    <div className="relative w-full h-full min-h-[750px] flex flex-col justify-between p-6 bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#FFFFFF] overflow-y-auto no-scrollbar">
      
      {/* Top curved swooshes */}
      <div className="absolute top-0 left-0 w-80 h-36 pointer-events-none opacity-90">
        <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M-40 -20C40 40 180 60 260 10L180 -40Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-20 -10C60 50 200 70 300 -10L220 -30Z" fill="#16A34A" fillOpacity="0.8" />
        </svg>
      </div>

      {/* Top Navigation */}
      <div className="w-full flex items-center justify-between z-10">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full flex flex-col items-center pt-2 z-10">
        {/* NearKart Logo */}
        <NearKartLogo size="md" showTagline={true} />

        {/* Title */}
        <div className="text-center mt-5">
          <h1 className="text-2xl font-extrabold text-[#0B2545] tracking-tight">
            Seller Registration
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-[260px] mx-auto">
            Register your shop to grow your business
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-3.5 max-w-sm">
          
          {/* Shop Name */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-700">Shop Name</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. ABC General Store"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Owner Name */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-700">Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Ali Khan"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Email ID (Optional) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-700">Email ID (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. you@example.com"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Shop Location */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-[11px] font-semibold text-slate-700">Shop Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 123 Main Street, Your City"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent truncate"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleDetectLocation}
              title="Detect Location via GPS"
              className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {/* Shop Categories Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCatDropdown(!showCatDropdown)}
              className="w-full bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs text-left cursor-pointer hover:border-blue-400"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-slate-700">Shop Categories</label>
                <div className="text-xs font-medium text-slate-900 truncate">{category}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {showCatDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl p-1 z-30 max-h-48 overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setShowCatDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium transition-colors ${
                      category === cat ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Upload Shop Photo Card */}
          <div className="relative border-2 border-dashed border-blue-200/90 bg-blue-50/40 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-blue-50/70 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImagePick}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-14 h-14 rounded-2xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Shop Preview" className="w-full h-full object-cover" />
              ) : (
                <ImagePlus className="w-6 h-6" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Upload Shop Photo</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Add a clear photo of your shop (Optional)
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#004BB7] hover:bg-[#003C94] active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer mt-4"
          >
            <span>Register Shop</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Safe info footnote */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Your information is safe with us</span>
          </div>

        </form>
      </div>

      {/* Bottom wave */}
      <div className="w-full relative mt-6 flex flex-col items-center pointer-events-none">
        <svg viewBox="0 0 400 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M-10 30C120 10 280 15 410 30V40H-10Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-10 33C140 18 270 18 410 33V40H-10Z" fill="#16A34A" />
        </svg>
      </div>

    </div>
  );
};
