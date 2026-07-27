"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/navigation/sidebar";
import { Users, Plus, Wallet, ShieldCheck, X } from "lucide-react";

export default function DriversPage() {
  const queryClient = useQueryClient();
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  const { data: drivers, isLoading } = useQuery({
    queryKey: ["driversList"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/drivers`);
      if (!res.ok) throw new Error("Failed to fetch drivers");
      return res.json();
    },
  });

  const { data: walletLedger } = useQuery({
    queryKey: ["driverWallet", selectedDriver?.id],
    queryFn: async () => {
      if (!selectedDriver) return [];
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/drivers/${selectedDriver.id}/wallet`);
      if (!res.ok) throw new Error("Failed to fetch wallet");
      return res.json();
    },
    enabled: !!selectedDriver,
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Driver Roster & Wallets</h1>
            <p className="text-slate-400 text-sm mt-1">Driver licensing compliance, monthly salary allocations, and trip wallet ledgers</p>
          </div>
        </div>

        {/* Drivers Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Driver Name</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">License No</th>
                  <th className="py-3 px-4">License Expiry</th>
                  <th className="py-3 px-4">Monthly Salary</th>
                  <th className="py-3 px-4">Wallet Balance</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">Loading driver roster...</td>
                  </tr>
                ) : (
                  drivers?.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{d.name}</td>
                      <td className="py-3.5 px-4 text-slate-300 font-mono text-xs">{d.phone}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-indigo-400">{d.license_no}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{d.license_expiry}</td>
                      <td className="py-3.5 px-4 text-slate-200">₹{d.salary_monthly.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">₹{(d.wallet_balance || 0).toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedDriver(d)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
                        >
                          View Ledger
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wallet Ledger Modal */}
        {selectedDriver && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-lg p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedDriver.name} — Driver Wallet</h3>
                  <p className="text-xs text-slate-400">Transaction History & Expense Advances</p>
                </div>
                <button onClick={() => setSelectedDriver(null)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                {walletLedger?.length === 0 ? (
                  <p className="text-sm text-slate-400 py-4 text-center">No wallet transactions recorded.</p>
                ) : (
                  walletLedger?.map((w: any) => (
                    <div key={w.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-white">{w.description}</p>
                        <p className="text-slate-500">{new Date(w.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`font-bold font-mono text-sm ${w.transaction_type === "CREDIT" ? "text-emerald-400" : "text-rose-400"}`}>
                        {w.transaction_type === "CREDIT" ? "+" : "-"}₹{w.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
