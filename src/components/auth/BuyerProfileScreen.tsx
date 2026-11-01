import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NearKartLogo } from '../common/NearKartLogo';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Phone, 
  MapPin, 
  ShoppingCart, 
  Tag, 
  Bell, 
  ShieldCheck 
} from 'lucide-react';

import { supabaseService } from '../../services/supabaseService';

export const BuyerProfileScreen: React.FC = () => {
  const { goBack, navigateTo, userName, setUserName, userPhone, setUserPhone, userLocation, setUserLocation, showToast, setIsAuthenticated } = useApp();

  const [name, setName] = useState(userName || 'Ramesh Kumar');
  const [phone, setPhone] = useState(userPhone || '9876543210');
  const [location, setLocation] = useState(userLocation || 'Bapuji Nagar, Bhubaneswar, Odisha 751009');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) {
      showToast('Please enter your name and location', 'warning');
      return;
    }
    setUserName(name);
    setUserPhone(phone);
    setUserLocation(location);
    setIsAuthenticated(true);
    supabaseService.saveProfile({
      name,
      phone,
      location,
      role: 'buyer'
    });
    showToast(`Welcome ${name}! Local shops near ${location.split(',')[0]} are now active.`, 'success');
    navigateTo('buyer_home');
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

      <div className="w-full flex flex-col items-center pt-1 z-10">
        
        {/* Brand Logo & Character Hero Header matching screenshot 6 */}
        <div className="relative w-full flex items-center justify-between max-w-sm mb-4">
          <div className="flex-1">
            <NearKartLogo size="md" showTagline={false} className="items-start text-left" />
          </div>

          {/* Shopper Character Illustration with phone and shopping bags */}
          <div className="w-28 h-28 relative flex items-center justify-center shrink-0">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center relative shadow-inner overflow-hidden">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Boy Face & Hoodie */}
                <circle cx="50" cy="35" r="16" fill="#FCD34D" />
                <path d="M36 28C36 18 64 18 64 28V32H36V28Z" fill="#1E293B" />
                {/* Blue Hoodie */}
                <path d="M25 75C25 50 75 50 75 75V100H25V75Z" fill="#2563EB" />
                {/* Smartphone in hand */}
                <rect x="38" y="44" width="12" height="20" rx="2" fill="#0F172A" />
                <rect x="40" y="46" width="8" height="15" rx="1" fill="#60A5FA" />
                {/* Green & Blue shopping bags */}
                <rect x="62" y="62" width="14" height="20" rx="2" fill="#16A34A" />
                <rect x="74" y="65" width="12" height="18" rx="2" fill="#3B82F6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-left w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-[#0B2545] tracking-tight">
            Shopping Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete your details to start shopping
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full mt-5 space-y-3.5 max-w-sm">
          
          {/* Your Name */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-700">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-700">Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 flex items-center gap-3 shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-slate-700">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#004BB7] hover:bg-[#003C94] active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer mt-4"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Why Register? Box */}
        <div className="w-full max-w-sm mt-6 p-4 rounded-2xl bg-white/80 border border-blue-100 shadow-xs">
          
          <div className="relative flex items-center justify-center mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-100" />
            </div>
            <span className="relative px-3 bg-white text-xs font-extrabold text-[#0B2545] tracking-tight">
              Why Register?
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            
            {/* Easy Shopping */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-tight">Easy<br/>Shopping</span>
            </div>

            {/* Best Deals */}
            <div className="flex flex-col items-center border-l border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                <Tag className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-tight">Best<br/>Deals</span>
            </div>

            {/* Order Updates */}
            <div className="flex flex-col items-center border-l border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-tight">Order<br/>Updates</span>
            </div>

            {/* Safe & Secure */}
            <div className="flex flex-col items-center border-l border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 leading-tight">Safe &<br/>Secure</span>
            </div>

          </div>
        </div>

        {/* Slogan */}
        <div className="mt-4 text-center">
          <p className="text-xs font-semibold text-blue-900 italic tracking-wide">
            Shop Smart, Live Better
          </p>
        </div>

      </div>

      {/* Bottom wave */}
      <div className="w-full relative mt-4 flex flex-col items-center pointer-events-none">
        <svg viewBox="0 0 400 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M-10 30C120 10 280 15 410 30V40H-10Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-10 33C140 18 270 18 410 33V40H-10Z" fill="#16A34A" />
        </svg>
      </div>

    </div>
  );
};
