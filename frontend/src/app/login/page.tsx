"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ShieldCheck, Building2, User, Key, ArrowRight, UserPlus, LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("register");

  // Registration Form
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gstin, setGstin] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Personas
  const personas = [
    {
      name: "Binod Kumar Mandal (Owner)",
      role: "ADMIN",
      email: "admin@apexlogistics.in",
      company: "Binod Kumar Mandal Transport",
      companyId: 1,
    },
    {
      name: "Rajesh Sharma (Fleet Manager)",
      role: "FLEET_MANAGER",
      email: "fleet@apexlogistics.in",
      company: "Apex Logistics India Pvt Ltd",
      companyId: 1,
    },
    {
      name: "Priya Patel (Chief Accountant)",
      role: "ACCOUNTANT",
      email: "accounts@apexlogistics.in",
      company: "Apex Logistics India Pvt Ltd",
      companyId: 1,
    },
  ];

  const handlePersonaLogin = (p: any) => {
    localStorage.setItem("user_email", p.email);
    localStorage.setItem("company_id", p.companyId.toString());
    localStorage.setItem("user_name", p.name);
    localStorage.setItem("company_name", p.company);
    router.push("/dashboard");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName,
          full_name: fullName,
          email,
          password,
          gstin: gstin || "27AAACA1234A1Z5",
          state_code: "27",
          state_name: "Maharashtra",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Registration failed");
      }

      const data = await res.json();
      localStorage.setItem("user_email", data.user.email);
      localStorage.setItem("company_id", data.user.company_id.toString());
      localStorage.setItem("user_name", data.user.full_name);
      localStorage.setItem("company_name", companyName);
      localStorage.setItem("access_token", data.access_token);

      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-xl">
            <Truck className="h-10 w-10 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Enterprise Transport System</h1>
          <p className="text-slate-400 text-sm">Multi-Tenant Company Workspace & Isolated Data Portal</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("register")}
            className={`py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              activeTab === "register"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Create New Company Account</span>
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
              activeTab === "login"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LogIn className="h-4 w-4" />
            <span>Demo Persona Switcher</span>
          </button>
        </div>

        {/* Tab 1: Register New Company Account */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm border-b border-slate-800 pb-3">
              <Sparkles className="h-4 w-4" />
              <span>Register Your Own Transport Workspace</span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Transport Name</label>
              <input
                type="text"
                placeholder="e.g. Shree Ram Transport Services"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Owner / Full Name</label>
              <input
                type="text"
                placeholder="e.g. Abhishek Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Email</label>
                <input
                  type="email"
                  placeholder="owner@transport.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GSTIN Number (Optional)</label>
              <input
                type="text"
                placeholder="27AAACA1234A1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <span>{loading ? "Creating Account..." : "Create Isolated Workspace"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Tab 2: Persona Switcher */}
        {activeTab === "login" && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-2xl">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-3">
              Select Demo Persona (Quick Switch)
            </h2>
            <div className="space-y-3">
              {personas.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePersonaLogin(p)}
                  className="w-full p-4 rounded-xl bg-slate-950 hover:bg-slate-800/60 border border-slate-800 transition-all flex items-center justify-between group text-left"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-white group-hover:text-indigo-400 text-sm block">{p.name}</span>
                    <span className="text-xs text-slate-400 block">{p.company}</span>
                    <span className="text-[10px] font-mono text-indigo-400 font-bold block">{p.role}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
