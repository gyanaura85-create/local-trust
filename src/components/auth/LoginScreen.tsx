import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NearKartLogo } from '../common/NearKartLogo';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

interface CountryCode {
  country: string;
  code: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { country: 'India', code: '+91', flag: '🇮🇳' },
  { country: 'Pakistan', code: '+92', flag: '🇵🇰' },
  { country: 'United States', code: '+1', flag: '🇺🇸' },
  { country: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { country: 'UAE', code: '+971', flag: '🇦🇪' }
];

export const LoginScreen: React.FC = () => {
  const { navigateTo, userPhone, setUserPhone, resendOtp, showToast } = useApp();

  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // default +91 or +92
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showCountryMenu, setShowCountryMenu] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 7) {
      showToast('Please enter a valid mobile number', 'warning');
      return;
    }
    const fullPhone = `${selectedCountry.code} ${phoneNumber}`;
    setUserPhone(fullPhone);
    navigateTo('role_select');
  };

  const handleVerifyOtp = () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      showToast('Please enter a valid mobile number', 'warning');
      return;
    }
    const fullPhone = `${selectedCountry.code} ${phoneNumber}`;
    setUserPhone(fullPhone);
    resendOtp();
    navigateTo('otp');
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

      <div className="w-full flex flex-col items-center pt-8 z-10">
        {/* NearKart Logo */}
        <NearKartLogo size="lg" showTagline={true} />

        {/* Heading */}
        <div className="text-center mt-6">
          <h1 className="text-2xl font-extrabold text-[#0B2545] tracking-tight">
            Welcome to NearKart
          </h1>
          <p className="text-xs text-slate-500 mt-2 max-w-[270px] mx-auto leading-relaxed">
            Enter your mobile number to continue and explore your neighbourhood marketplace.
          </p>
        </div>

        {/* Storefront graphic */}
        <div className="my-6 relative flex items-center justify-center">
          <div className="w-48 h-32 relative flex items-center justify-center">
            {/* Soft skyline behind */}
            <div className="absolute inset-0 flex items-end justify-center opacity-30 pb-2">
              <div className="w-10 h-16 bg-blue-300 rounded-t-sm mx-1" />
              <div className="w-12 h-24 bg-blue-400 rounded-t-sm mx-1" />
              <div className="w-8 h-14 bg-blue-300 rounded-t-sm mx-1" />
            </div>

            {/* Shop awning */}
            <div className="relative z-10 w-28 bg-white rounded-xl shadow-lg border border-slate-200/80 p-2 flex flex-col items-center">
              {/* Awning stripes */}
              <div className="w-full h-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-t-lg flex overflow-hidden">
                <div className="w-1/4 h-full bg-blue-600" />
                <div className="w-1/4 h-full bg-white" />
                <div className="w-1/4 h-full bg-blue-600" />
                <div className="w-1/4 h-full bg-white" />
              </div>
              {/* Window & Cart */}
              <div className="w-full py-2.5 flex items-center justify-center">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Fresh Green Foliage Accents */}
            <div className="absolute -left-2 bottom-3 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
              🌱
            </div>
            <div className="absolute -right-2 bottom-3 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
              🌿
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleContinue} className="w-full space-y-4 max-w-sm">
          
          {/* Mobile Number Box */}
          <div className="relative">
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-blue-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all p-1.5">
              
              {/* Country Code Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountryMenu(!showCountryMenu)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-800"
                >
                  <span className="text-base">{selectedCountry.flag}</span>
                  <span>{selectedCountry.code}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showCountryMenu && (
                  <div className="absolute left-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30">
                    {COUNTRY_CODES.map(c => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setShowCountryMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-medium hover:bg-blue-50 flex items-center gap-2 text-slate-700"
                      >
                        <span>{c.flag}</span>
                        <span className="flex-1">{c.country}</span>
                        <span className="font-semibold text-blue-600">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Vertical divider */}
              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* Number Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter Mobile Number"
                className="flex-1 px-3 py-2 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                maxLength={12}
                required
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#004BB7] hover:bg-[#003C94] active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Optional OTP Verification Button */}
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 font-semibold text-xs flex items-center justify-center gap-1.5 border border-blue-200/80 transition-all cursor-pointer"
          >
            <span>Verify via 6-digit OTP instead</span>
          </button>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-start gap-2.5 pt-2 px-1">
            <button
              type="button"
              onClick={() => setAgreeTerms(!agreeTerms)}
              className="mt-0.5 text-emerald-600 shrink-0"
            >
              <CheckCircle2 className={`w-5 h-5 ${agreeTerms ? 'fill-emerald-600 text-white' : 'text-slate-300'}`} />
            </button>
            <p className="text-[11px] text-slate-500 leading-tight select-none">
              By continuing, you agree to our{' '}
              <span className="text-[#004BB7] font-semibold hover:underline cursor-pointer">
                Terms & Conditions
              </span>{' '}
              and{' '}
              <span className="text-[#004BB7] font-semibold hover:underline cursor-pointer">
                Privacy Policy
              </span>.
            </p>
          </div>

        </form>
      </div>

      {/* Bottom wave */}
      <div className="w-full relative mt-6 flex flex-col items-center pointer-events-none">
        <svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M-10 35C120 10 280 15 410 35V45H-10Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-10 38C140 20 270 20 410 38V45H-10Z" fill="#16A34A" />
        </svg>
      </div>

    </div>
  );
};
