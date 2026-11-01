import React from 'react';
import { useApp } from '../../context/AppContext';
import { NearKartLogo } from '../common/NearKartLogo';
import { Store, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';

export const RoleSelectScreen: React.FC = () => {
  const { navigateTo, setRole, goBack } = useApp();

  const handleSelectSeller = () => {
    setRole('seller');
    navigateTo('seller_register');
  };

  const handleSelectBuyer = () => {
    setRole('buyer');
    navigateTo('buyer_profile');
  };

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between p-6 bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#FFFFFF] overflow-y-auto no-scrollbar">
      
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
        <NearKartLogo size="lg" showTagline={true} />

        {/* Heading */}
        <div className="text-center mt-6">
          <h1 className="text-2xl font-extrabold text-[#0B2545] tracking-tight">
            Choose Your Role
          </h1>
          <p className="text-xs text-slate-500 mt-2 max-w-[260px] mx-auto leading-relaxed">
            Continue as per your need
          </p>
        </div>

        {/* Roles Selection Cards */}
        <div className="w-full mt-8 space-y-4 max-w-sm">
          
          {/* Seller Card */}
          <button
            onClick={handleSelectSeller}
            className="w-full p-5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-white border-2 border-blue-200/80 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100/80 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                <Store className="w-7 h-7" />
              </div>
              <div className="border-l border-slate-200 pl-4 py-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Seller
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  List your products, grow your business
                </p>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Buyer Card */}
          <button
            onClick={handleSelectBuyer}
            className="w-full p-5 rounded-2xl bg-gradient-to-r from-emerald-50/60 to-white border-2 border-emerald-200/80 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.99] transition-all flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <div className="border-l border-slate-200 pl-4 py-1">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Buyer
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Shop nearby, get the best deals
                </p>
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:translate-x-1 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

        </div>
      </div>

      {/* Cityscape illustration */}
      <div className="w-full relative mt-8 flex flex-col items-center pointer-events-none">
        <svg viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto opacity-75">
          <rect x="20" y="35" width="25" height="45" rx="2" fill="#DBEAFE" />
          <rect x="55" y="20" width="30" height="60" rx="2" fill="#BFDBFE" />
          <rect x="95" y="40" width="24" height="40" rx="2" fill="#DBEAFE" />
          <rect x="130" y="25" width="28" height="55" rx="2" fill="#BFDBFE" />
          <rect x="175" y="35" width="30" height="45" rx="2" fill="#DBEAFE" />
          <rect x="220" y="22" width="32" height="58" rx="2" fill="#BFDBFE" />
          <circle cx="45" cy="55" r="12" fill="#93C5FD" opacity="0.6" />
          <circle cx="160" cy="60" r="14" fill="#60A5FA" opacity="0.4" />
          <path d="M-10 70C120 50 280 50 410 70V80H-10Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-10 74C140 58 270 58 410 74V80H-10Z" fill="#16A34A" />
        </svg>
      </div>

    </div>
  );
};
