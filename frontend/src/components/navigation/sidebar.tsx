"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Building2, 
  MapPin, 
  Receipt, 
  ShieldCheck, 
  LogOut,
  Play
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Custom Billing Builder", href: "/billing", icon: Receipt },
  { name: "Commercial Video Ad", href: "/video-ad", icon: Play },
  { name: "GST Invoices & Billing", href: "/invoices", icon: Receipt },
  { name: "Fleet Vehicles", href: "/vehicles", icon: Truck },
  { name: "Drivers & Wallets", href: "/drivers", icon: Users },
  { name: "Customer Directory", href: "/customers", icon: Building2 },
  { name: "Trip Dispatch & P&L", href: "/trips", icon: MapPin },
  { name: "Operations & Fuel", href: "/ops", icon: ShieldCheck },
  { name: "Reports & CSV Export", href: "/reports", icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Rajesh Sharma");
  const [companyName, setCompanyName] = useState("Apex Logistics");
  const [userEmail, setUserEmail] = useState("admin@apexlogistics.in");

  useEffect(() => {
    const storedUser = localStorage.getItem("user_name");
    const storedCompany = localStorage.getItem("company_name");
    const storedEmail = localStorage.getItem("user_email");

    if (storedUser) setUserName(storedUser);
    if (storedCompany) setCompanyName(storedCompany);
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between flex-shrink-0">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight line-clamp-1">{companyName}</h1>
            <p className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">Enterprise Workspace</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-white truncate max-w-[110px]">{userName}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
            ADMIN
          </span>
        </div>
        <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
        <Link
          href="/login"
          className="flex items-center justify-center space-x-2 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Switch Account / Logout</span>
        </Link>
      </div>
    </aside>
  );
}
