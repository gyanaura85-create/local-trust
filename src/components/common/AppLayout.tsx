import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Smartphone, 
  Monitor, 
  Store, 
  ShoppingBag, 
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  Wifi,
  BatteryMedium,
  Zap
} from 'lucide-react';
import { StripeCheckoutModal } from './StripeCheckoutModal';
import { SupabaseStatusBadge } from './SupabaseStatusBadge';
import { RealtimeOrderAlert } from './RealtimeOrderAlert';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { 
    role, 
    switchRole, 
    toasts, 
    removeToast,
    currentScreen,
    restartOnboarding,
    simulateIncomingOrder
  } = useApp();

  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>('mobile');

  // Format current local time for mobile status bar (or standard 9:41 like iOS)
  const currentTime = '9:41';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Top Universal App Control Bar for Testing & Demo */}
      <header className="w-full bg-slate-950/90 text-white border-b border-slate-800 px-4 py-2.5 z-40 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-xs text-white shadow-sm">
                NK
              </div>
              <span className="font-bold text-sm tracking-tight text-white hidden sm:inline">NearKart</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
              Live System
            </span>
            <SupabaseStatusBadge />
          </div>

          {/* Role Switcher & Flow Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Restart Onboarding Flow button */}
            <button
              onClick={restartOnboarding}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restart Flow: Splash -> Login -> Role Select -> Registration"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Restart Flow</span>
            </button>

            {/* Test Realtime Order Simulation Button */}
            <button
              onClick={simulateIncomingOrder}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Dispatches live test order via Supabase Realtime channel"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="hidden md:inline">Test Live Order</span>
            </button>

            {/* Seller / Buyer toggle */}
            <div className="flex items-center bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => switchRole('seller')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  role === 'seller'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Seller</span>
              </button>
              <button
                onClick={() => switchRole('buyer')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  role === 'buyer'
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buyer</span>
              </button>
            </div>

            {/* Frame Viewport Mode */}
            <div className="hidden lg:flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile Phone Frame (Figma Exact)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('expanded')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'expanded' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Expanded Viewport"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="w-full flex-1 flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-x-hidden">
        
        {viewMode === 'mobile' ? (
          /* Phone Shell matching Figma Screenshots */
          <div className="w-full max-w-[430px] min-h-[100dvh] md:min-h-[880px] md:max-h-[920px] md:h-[890px] bg-white md:rounded-[48px] md:shadow-2xl md:ring-12 md:ring-slate-800/80 overflow-hidden flex flex-col relative border border-slate-200/50">
            
            {/* Top iOS Status Bar */}
            <div className="w-full pt-3 px-7 pb-1 flex items-center justify-between text-slate-800 font-semibold text-xs tracking-tight shrink-0 select-none z-30">
              <span>{currentTime}</span>
              <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto hidden md:block opacity-10" />
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <BatteryMedium className="w-4 h-4" />
              </div>
            </div>

            {/* Scrollable Screen Body */}
            <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col bg-[#F8FAFC]">
              {children}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-full py-1.5 flex justify-center bg-transparent shrink-0">
              <div className="w-32 h-1 bg-slate-400/40 rounded-full" />
            </div>

          </div>
        ) : (
          /* Expanded / Dual View Canvas */
          <div className="w-full max-w-6xl min-h-[85vh] bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-800/40">
            <div className="flex-1 w-full overflow-y-auto relative flex flex-col bg-[#F8FAFC]">
              {children}
            </div>
          </div>
        )}

      </main>

      {/* Realtime Order Alert Banner for Sellers */}
      <RealtimeOrderAlert />

      {/* Stripe Modal */}
      <StripeCheckoutModal />

      {/* Global Interactive Toast Notification Stack */}
      <aside aria-label="Notifications" className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium border backdrop-blur-md animate-slide-up ${
              t.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/30'
                : t.type === 'error'
                ? 'bg-rose-950/90 text-rose-100 border-rose-500/30'
                : t.type === 'warning'
                ? 'bg-amber-950/90 text-amber-100 border-amber-500/30'
                : 'bg-slate-950/90 text-slate-100 border-slate-700'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {t.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="opacity-70 hover:opacity-100 text-xs px-1"
            >
              ✕
            </button>
          </div>
        ))}
      </aside>

    </div>
  );
};
