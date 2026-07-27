"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/navigation/sidebar";
import { Wrench, Fuel, Plus, ShieldCheck, Sparkles } from "lucide-react";

export default function OpsPage() {
  const { data: fuelEntries } = useQuery({
    queryKey: ["fuelEntries"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/ops/fuel`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: maintenance } = useQuery({
    queryKey: ["maintenanceRecords"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/ops/maintenance`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Operations & Fleet Maintenance</h1>
            <p className="text-slate-400 text-sm mt-1">Fuel consumption logs, odometer tracking, and vehicle service logs</p>
          </div>
        </div>

        {/* Fuel Entries Grid */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <Fuel className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Fuel Consumption Logs</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Driver</th>
                  <th className="py-3 px-4">Liters</th>
                  <th className="py-3 px-4">Rate / Liter</th>
                  <th className="py-3 px-4">Total Cost</th>
                  <th className="py-3 px-4">Odometer (km)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {!fuelEntries || fuelEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                      No fuel consumption logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  fuelEntries.map((f: any) => (
                    <tr key={f.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 text-slate-400">{f.entry_date}</td>
                      <td className="py-3 px-4 font-bold text-white font-sans">{f.vehicle_reg_no}</td>
                      <td className="py-3 px-4 font-sans text-slate-300">{f.driver_name}</td>
                      <td className="py-3 px-4 text-sky-400">{f.liters} L</td>
                      <td className="py-3 px-4 text-slate-300">₹{f.rate_per_liter}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">₹{f.total_cost.toLocaleString("en-IN")}</td>
                      <td className="py-3 px-4 text-slate-400">{f.odometer_km.toLocaleString()} km</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance Records */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <Wrench className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Maintenance & Repairs Ledger</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Service Date</th>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-4">Maintenance Description</th>
                  <th className="py-3 px-4 text-right">Service Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {!maintenance || maintenance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-sans">
                      No vehicle maintenance records logged yet.
                    </td>
                  </tr>
                ) : (
                  maintenance.map((m: any) => (
                    <tr key={m.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-mono text-slate-400">{m.maintenance_date}</td>
                      <td className="py-3 px-4 font-bold text-white font-mono">{m.vehicle_reg_no}</td>
                      <td className="py-3 px-4 text-slate-300">{m.description}</td>
                      <td className="py-3 px-4 text-right font-bold text-amber-400">₹{m.cost.toLocaleString("en-IN")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
