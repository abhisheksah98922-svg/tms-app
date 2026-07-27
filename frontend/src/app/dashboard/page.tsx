"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/navigation/sidebar";
import { 
  TrendingUp, 
  DollarSign, 
  Truck, 
  MapPin, 
  Receipt, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Users,
  Building2,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  const { data: dashboard, isLoading, isError } = useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/dashboard`);
      if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
      return res.json();
    },
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Executive Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Fleet Operations & Trip Profitability Overview</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              Live Production State
            </span>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Link href="/billing" className="p-3.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 transition-all flex items-center space-x-2 text-indigo-300 text-xs font-bold">
            <Receipt className="h-4 w-4" />
            <span>Custom Bill Studio</span>
          </Link>
          <Link href="/trips" className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center space-x-2 text-slate-200 text-xs font-bold">
            <MapPin className="h-4 w-4 text-sky-400" />
            <span>Dispatch Trip</span>
          </Link>
          <Link href="/vehicles" className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center space-x-2 text-slate-200 text-xs font-bold">
            <Truck className="h-4 w-4 text-emerald-400" />
            <span>Add Vehicle</span>
          </Link>
          <Link href="/drivers" className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center space-x-2 text-slate-200 text-xs font-bold">
            <Users className="h-4 w-4 text-amber-400" />
            <span>Add Driver</span>
          </Link>
          <Link href="/customers" className="p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all flex items-center space-x-2 text-slate-200 text-xs font-bold">
            <Building2 className="h-4 w-4 text-violet-400" />
            <span>Add Customer</span>
          </Link>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Clock className="h-8 w-8 animate-spin mx-auto text-indigo-400" />
            <p>Loading real-time financial metrics...</p>
          </div>
        ) : isError ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center space-x-4">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm">Dashboard Feed Offline</h3>
              <p className="text-xs text-rose-400/80 mt-1">Unable to connect to FastAPI backend service. Verify server port 8000.</p>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-white">₹{(dashboard?.total_revenue || 0).toLocaleString("en-IN")}</h3>
                  <p className="text-xs text-emerald-400 flex items-center mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Gross Freight Billed
                  </p>
                </div>
              </div>

              {/* Net Profit */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net P&L Profit</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-indigo-400">₹{(dashboard?.total_net_profit || 0).toLocaleString("en-IN")}</h3>
                  <p className="text-xs text-slate-400 mt-1">Freight minus All Trip Expenses</p>
                </div>
              </div>

              {/* Active Fleet */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Vehicles</span>
                  <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                    <Truck className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-white">{dashboard?.active_vehicles || 0}</h3>
                  <p className="text-xs text-sky-400 mt-1">Available & In-Transit Vehicles</p>
                </div>
              </div>

              {/* Pending Receivables */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Receivables</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Receipt className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold text-amber-400">₹{(dashboard?.pending_receivables || 0).toLocaleString("en-IN")}</h3>
                  <p className="text-xs text-slate-400 mt-1">Uncollected Customer Invoices</p>
                </div>
              </div>
            </div>

            {/* Recent Trips Table */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg text-white">Recent Dispatched Trips</h2>
                <span className="text-xs text-indigo-400 font-medium">Live P&L Ledger</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Trip No</th>
                      <th className="py-3 px-4">Route</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Freight</th>
                      <th className="py-3 px-4 text-right">Total Expenses</th>
                      <th className="py-3 px-4 text-right">Net Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {!dashboard?.recent_trips || dashboard.recent_trips.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <MapPin className="h-8 w-8 text-slate-600" />
                            <p className="text-slate-300 font-semibold text-sm">No recent trips dispatched yet</p>
                            <p className="text-slate-500 text-xs">Use the quick action buttons above to dispatch your first trip or create custom bills!</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      dashboard.recent_trips.map((t: any) => (
                        <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-medium text-indigo-400">{t.trip_no}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-200">{t.origin} → {t.destination}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              t.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                              t.status === "IN_TRANSIT" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                              "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-white">₹{t.freight_rate.toLocaleString("en-IN")}</td>
                          <td className="py-3.5 px-4 text-right text-slate-400">₹{t.total_expenses.toLocaleString("en-IN")}</td>
                          <td className={`py-3.5 px-4 text-right font-bold ${t.net_profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            ₹{t.net_profit.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
