import React, { useState } from 'react';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Specified username: pixiforu
    // password: cakeasy2026 (let's make it secure but clearly documented)
    if (username === 'pixiforu' && password === 'cakeasy2026') {
      setError('');
      onLoginSuccess();
    } else {
      setError('Invalid admin username or secure passcode.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-[#FFF5F8] shadow-lg space-y-6 animate-scaleIn">
      <div className="text-center space-y-2">
        <div className="h-14 w-14 bg-[#FFF5F8] text-[#D63384] rounded-2xl flex items-center justify-center mx-auto border border-[#F6B8C8]/20">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1E1E1E]">CMS Bake Station</h2>
        <p className="text-xs text-gray-400">Authorized personnel only. Please verify your identity to manage products, orders, and promotional coupons.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-100 flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Username</label>
          <div className="relative">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="pixiforu"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Secure Passcode</label>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:border-[#D63384] text-[#1E1E1E]"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#D63384] hover:bg-[#b02266] text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          Verify Credentials <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Helpful Hint banner to help the owner with the default credentials */}
      <div className="bg-[#FFF5F8] border border-pink-50 p-4 rounded-2xl text-[11px] text-gray-500 space-y-1">
        <p className="font-bold text-[#D63384]">Atelier Credentials Tip:</p>
        <p>Use your preferred username <span className="font-bold text-gray-700">pixiforu</span> and passcode <span className="font-bold text-gray-700">cakeasy2026</span> to unlock management options.</p>
      </div>
    </div>
  );
}
