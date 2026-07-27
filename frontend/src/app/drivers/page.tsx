"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/navigation/sidebar";
import { Users, Plus, Wallet, ShieldCheck, X, Sparkles } from "lucide-react";

export default function DriversPage() {
  const queryClient = useQueryClient();
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [salary, setSalary] = useState("28000");

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

  const createDriverMutation = useMutation({
    mutationFn: async (newDriver: any) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/drivers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDriver),
      });
      if (!res.ok) throw new Error("Failed to create driver");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driversList"] });
      setIsModalOpen(false);
      setDriverName("");
      setPhone("");
      setLicenseNo("");
    },
  });

  const handleQuickAddSample = () => {
    createDriverMutation.mutate({
      name: "Ramesh Kumar",
      phone: "+91 98765 43210",
      license_no: "MH-04-2026-987",
      license_expiry: "2027-12-31",
      salary_monthly: 28000.0,
      status: "AVAILABLE",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDriverMutation.mutate({
      name: driverName,
      phone: phone || "+91 98000 00000",
      license_no: licenseNo || "DL-MH-2026",
      license_expiry: "2027-12-31",
      salary_monthly: parseFloat(salary) || 25000.0,
      status: "AVAILABLE",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Driver Roster & Wallets</h1>
            <p className="text-slate-400 text-sm mt-1">Driver licensing compliance, monthly salary allocations, and trip wallet ledgers</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleQuickAddSample}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 font-medium rounded-xl text-sm transition-all"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Quick Add 1 Sample Driver</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Driver</span>
            </button>
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
                ) : !drivers || drivers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Users className="h-10 w-10 text-slate-600" />
                        <p className="text-slate-300 font-semibold text-base">No drivers registered yet</p>
                        <p className="text-slate-500 text-xs max-w-sm">Click "Add New Driver" to add drivers, or click "Quick Add 1 Sample Driver" to test!</p>
                        <button
                          onClick={handleQuickAddSample}
                          className="mt-2 px-4 py-2 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold hover:bg-emerald-600/30 transition-all flex items-center space-x-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Add Sample Driver (Ramesh Kumar)</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  drivers.map((d: any) => (
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

        {/* Add Driver Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Add New Driver</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Driver Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Driving License Number</label>
                  <input
                    type="text"
                    placeholder="MH-04-2026-12345"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Monthly Salary (₹)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
                  >
                    Save Driver
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
