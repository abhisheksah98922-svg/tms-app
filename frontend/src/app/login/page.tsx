"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ShieldCheck, UserCheck, KeyRound, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@apexlogistics.in");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 400);
  };

  const selectPersona = (pEmail: string) => {
    setEmail(pEmail);
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400 mb-2">
            <Truck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Apex Logistics TMS</h1>
          <p className="text-slate-400 text-sm">Logistics Operating System & Billing Platform</p>
        </div>

        {/* Quick Demo Personas */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block text-center">
            Quick Persona Switcher
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => selectPersona("admin@apexlogistics.in")}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                email === "admin@apexlogistics.in"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => selectPersona("fleet@apexlogistics.in")}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                email === "fleet@apexlogistics.in"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              Fleet Manager
            </button>
            <button
              onClick={() => selectPersona("accountant@apexlogistics.in")}
              className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
                email === "accountant@apexlogistics.in"
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200"
              }`}
            >
              Accountant
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-indigo-600/25"
          >
            <span>{isLoading ? "Signing in..." : "Access System"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
