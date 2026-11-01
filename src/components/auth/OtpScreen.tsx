import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { NearKartLogo } from '../common/NearKartLogo';
import { ArrowLeft, ArrowRight, Phone, Clock, KeyRound } from 'lucide-react';

export const OtpScreen: React.FC = () => {
  const { 
    goBack, 
    navigateTo, 
    userPhone, 
    generatedOtp, 
    resendOtp, 
    verifyOtp, 
    resendTimer 
  } = useApp();

  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Pasted full OTP code
      const digits = value.replace(/[^0-9]/g, '').slice(0, 6).split('');
      const newOtp = [...otpValues];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpValues(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const digit = value.replace(/[^0-9]/g, '');
    const newOtp = [...otpValues];
    newOtp[index] = digit;
    setOtpValues(newOtp);

    // Auto advance to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    const isValid = verifyOtp(fullOtp);
    if (isValid) {
      navigateTo('role_select');
    }
  };

  const handleFillDemoOtp = () => {
    const digits = generatedOtp.split('');
    setOtpValues(digits);
    inputRefs.current[5]?.focus();
  };

  const formattedTimer = `00:${resendTimer < 10 ? '0' : ''}${resendTimer}`;

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
        <NearKartLogo size="md" showTagline={true} />

        {/* Title */}
        <div className="text-center mt-6">
          <h1 className="text-2xl font-extrabold text-[#0B2545] tracking-tight">
            OTP Verification
          </h1>
          <p className="text-xs text-slate-500 mt-2 max-w-[260px] mx-auto leading-relaxed">
            We have sent a 6 digit OTP to your mobile number
          </p>
        </div>

        {/* Mobile Number Badge */}
        <div className="mt-4 flex items-center justify-between gap-3 px-4 py-2 bg-blue-50/80 border border-blue-100 rounded-full w-full max-w-[300px]">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Phone className="w-3 h-3" />
            </div>
            <span>{userPhone}</span>
          </div>
          <button
            onClick={() => navigateTo('login')}
            className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Change
          </button>
        </div>

        {/* Quick Demo OTP Helper Card */}
        <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-800">
          <KeyRound className="w-3.5 h-3.5 text-amber-600" />
          <span>Real-time Code: <strong>{generatedOtp}</strong></span>
          <button
            type="button"
            onClick={handleFillDemoOtp}
            className="ml-1 text-[11px] font-bold text-blue-700 underline hover:text-blue-900 cursor-pointer"
          >
            Auto-Fill
          </button>
        </div>

        {/* 6 OTP Inputs Form */}
        <form onSubmit={handleVerify} className="w-full mt-6 space-y-5 max-w-sm">
          <div className="flex items-center justify-between gap-2 px-1">
            {otpValues.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-12 h-14 text-center text-xl font-bold rounded-2xl border-2 transition-all focus:outline-none ${
                  val
                    ? 'border-blue-600 bg-blue-50/50 text-blue-900 shadow-sm'
                    : 'border-blue-200 bg-white text-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                }`}
                required
              />
            ))}
          </div>

          {/* Resend Timer */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Resend OTP in</span>
            <span className="font-bold text-blue-700 font-mono">{formattedTimer}</span>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#004BB7] hover:bg-[#003C94] active:scale-[0.99] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <span>Verify OTP</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Resend link */}
          <div className="text-center pt-1">
            <span className="text-xs text-slate-500">Didn't receive the OTP? </span>
            <button
              type="button"
              onClick={resendOtp}
              disabled={resendTimer > 0}
              className={`text-xs font-bold transition-colors cursor-pointer ${
                resendTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-blue-600 hover:underline'
              }`}
            >
              Resend Again
            </button>
          </div>
        </form>
      </div>

      {/* Cityscape illustration + Blue shopping cart with bags at bottom */}
      <div className="w-full relative mt-6 flex flex-col items-center pointer-events-none">
        <svg viewBox="0 0 400 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          {/* Skyline */}
          <rect x="15" y="40" width="25" height="40" rx="2" fill="#DBEAFE" />
          <rect x="45" y="25" width="28" height="55" rx="2" fill="#BFDBFE" />
          <rect x="85" y="45" width="22" height="35" rx="2" fill="#DBEAFE" />
          <rect x="115" y="30" width="30" height="50" rx="2" fill="#BFDBFE" />
          <rect x="160" y="42" width="25" height="38" rx="2" fill="#DBEAFE" />
          <circle cx="75" cy="65" r="12" fill="#93C5FD" opacity="0.6" />
          <circle cx="150" cy="68" r="14" fill="#60A5FA" opacity="0.4" />
          
          {/* Shopping cart with bags on right */}
          <g transform="translate(280, 20)">
            <rect x="15" y="5" width="14" height="25" rx="2" fill="#155EEF" />
            <rect x="25" y="2" width="16" height="28" rx="2" fill="#16A34A" />
            <path d="M5 25H42L38 48H12L5 25Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
            <circle cx="16" cy="54" r="4.5" fill="#1E40AF" />
            <circle cx="34" cy="54" r="4.5" fill="#1E40AF" />
          </g>

          <path d="M-10 80C120 65 280 65 410 80V90H-10Z" fill="#155EEF" fillOpacity="0.8" />
          <path d="M-10 83C140 70 270 70 410 83V90H-10Z" fill="#16A34A" />
        </svg>
      </div>

    </div>
  );
};
