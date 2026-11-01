import React, { useState, useEffect } from 'react';
import { checkSupabaseConnection, SUPABASE_URL } from '../../lib/supabase';
import { SUPABASE_SCHEMA_SQL } from '../../services/supabaseService';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, RefreshCw, X, Zap, Radio } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SupabaseStatusBadge: React.FC = () => {
  const { realtimeStatus, simulateIncomingOrder } = useApp();
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [latency, setLatency] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('Connecting to Supabase...');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const testConnection = async () => {
    setStatus('checking');
    const res = await checkSupabaseConnection();
    if (res.connected) {
      setStatus('connected');
      setLatency(res.latencyMs ?? null);
      setMessage(res.message);
    } else {
      setStatus('error');
      setMessage(res.message);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <>
      {/* Badge Button in Header */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
        title="Supabase Cloud Database Status & Schema"
      >
        <Database className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Supabase</span>
        <span className="flex h-2 w-2 relative">
          {status === 'connected' ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : status === 'checking' ? (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400 animate-pulse"></span>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          )}
        </span>
      </button>

      {/* Supabase Connection & Schema Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Supabase Cloud Backend
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live Connected
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Project Reference: <span className="font-mono text-emerald-300">kdnyqvhmjourunluxwdn</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              
              {/* Connection Status Box */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {status === 'connected' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  ) : status === 'error' ? (
                    <AlertCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
                  ) : (
                    <RefreshCw className="w-5 h-5 text-amber-400 mt-0.5 shrink-0 animate-spin" />
                  )}
                  <div>
                    <h4 className="font-semibold text-white">Connection Status</h4>
                    <p className="text-xs text-slate-300 mt-0.5">{message}</p>
                    {latency !== null && (
                      <p className="text-[11px] text-emerald-400 font-mono mt-1">
                        API Ping: {latency} ms
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={testConnection}
                  disabled={status === 'checking'}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 cursor-pointer shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${status === 'checking' ? 'animate-spin' : ''}`} />
                  <span>Test Ping</span>
                </button>
              </div>

              {/* Realtime Subscription Status Box */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">Supabase Realtime Channel</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        {realtimeStatus === 'SUBSCRIBED' ? 'Active & Listening' : realtimeStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Listening on Postgres changes (<code className="text-blue-300">public.orders</code>) and Broadcast channel (<code className="text-blue-300">nearkart-orders</code>).
                    </p>
                    <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>Instant Web Audio POS bell alerts when orders arrive.</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    simulateIncomingOrder();
                    setIsModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Send Test Order</span>
                </button>
              </div>

              {/* Endpoint Config */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Supabase API Endpoint</label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 truncate">
                  {SUPABASE_URL}
                </div>
              </div>

              {/* Schema SQL Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold text-slate-200">
                      PostgreSQL Tables Schema
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Copy and run in Supabase SQL Editor to initialize <code className="text-emerald-400">shops</code>, <code className="text-emerald-400">products</code>, <code className="text-emerald-400">orders</code>, and <code className="text-emerald-400">profiles</code>.
                    </p>
                  </div>
                  <button
                    onClick={copySql}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL Script'}</span>
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono overflow-x-auto max-h-56 no-scrollbar">
                    {SUPABASE_SCHEMA_SQL}
                  </pre>
                </div>
              </div>

              {/* Useful links */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800">
                <span className="text-slate-400">NearKart client & services automatically sync app data.</span>
                <a
                  href="https://supabase.com/dashboard/project/kdnyqvhmjourunluxwdn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Open Supabase Dashboard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
