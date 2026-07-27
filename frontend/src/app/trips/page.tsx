"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/navigation/sidebar";
import { MapPin, Plus, TrendingUp, DollarSign, Calculator, CheckCircle, ArrowRight, X, Truck, User, Calendar, Scale } from "lucide-react";

export default function TripsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [tripNo, setTripNo] = useState(`TRIP-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [vehicleId, setVehicleId] = useState("1");
  const [driverId, setDriverId] = useState("1");
  const [customerId, setCustomerId] = useState("1");
  const [origin, setOrigin] = useState("Bhiwandi, MH");
  const [destination, setDestination] = useState("Pune, MH");
  const [weightTons, setWeightTons] = useState("14.5");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [freightRate, setFreightRate] = useState("50000");
  const [fuelCost, setFuelCost] = useState("15000");
  const [tollCost, setTollCost] = useState("2500");
  const [policeCost, setPoliceCost] = useState("500");
  const [loadingCost, setLoadingCost] = useState("1500");
  const [unloadingCost, setUnloadingCost] = useState("1500");
  const [labourCost, setLabourCost] = useState("1000");
  const [otherCost, setOtherCost] = useState("500");
  const [driverSalaryAlloc, setDriverSalaryAlloc] = useState("4000");

  const freight = parseFloat(freightRate) || 0;
  const totalExp = (
    (parseFloat(fuelCost) || 0) + (parseFloat(tollCost) || 0) + (parseFloat(policeCost) || 0) +
    (parseFloat(loadingCost) || 0) + (parseFloat(unloadingCost) || 0) + (parseFloat(labourCost) || 0) +
    (parseFloat(otherCost) || 0) + (parseFloat(driverSalaryAlloc) || 0)
  );
  const netProfit = freight - totalExp;

  const { data: vehicles } = useQuery({
    queryKey: ["vehiclesList"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/vehicles`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: drivers } = useQuery({
    queryKey: ["driversList"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/drivers`);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const { data: trips, isLoading } = useQuery({
    queryKey: ["tripsList"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/trips`);
      if (!res.ok) throw new Error("Failed to fetch trips");
      return res.json();
    },
  });

  const createTripMutation = useMutation({
    mutationFn: async (newTrip: any) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTrip),
      });
      if (!res.ok) throw new Error("Failed to create trip");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripsList"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      setIsModalOpen(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ tripId, status }: { tripId: number, status: string }) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/trips/${tripId}/status?new_status=${status}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripsList"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTripMutation.mutate({
      trip_no: tripNo,
      vehicle_id: parseInt(vehicleId),
      driver_id: parseInt(driverId),
      customer_id: parseInt(customerId),
      origin,
      destination,
      goods_description: "General Commercial Freight",
      weight_tons: parseFloat(weightTons) || 12.5,
      start_date: startDate,
      freight_rate: freight,
      fuel_cost: parseFloat(fuelCost) || 0,
      toll_cost: parseFloat(tollCost) || 0,
      police_cost: parseFloat(policeCost) || 0,
      loading_cost: parseFloat(loadingCost) || 0,
      unloading_cost: parseFloat(unloadingCost) || 0,
      labour_cost: parseFloat(labourCost) || 0,
      other_cost: parseFloat(otherCost) || 0,
      driver_salary_alloc: parseFloat(driverSalaryAlloc) || 0,
      status: "DISPATCHED",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Trip Dispatch & P&L Tracker</h1>
            <p className="text-slate-400 text-sm mt-1">Live vehicle registration tracking, payload cargo weight (Tons), dispatch loading dates, and net profit ledger</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25"
          >
            <Plus className="h-4 w-4" />
            <span>Dispatch New Trip</span>
          </button>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center py-8 text-slate-400">Loading trips...</p>
          ) : (
            trips?.map((t: any) => (
              <div key={t.id} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="font-mono font-extrabold text-indigo-400 text-lg">{t.trip_no}</span>
                        
                        {/* Vehicle Number Badge */}
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 font-mono font-bold text-xs flex items-center space-x-1">
                          <Truck className="h-3 w-3 text-emerald-400 mr-1 inline" />
                          <span>{t.vehicle_reg_no || "MH-04-JK-9821"}</span>
                        </span>

                        {/* Weight in Tons Badge */}
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-600/10 text-indigo-300 border border-indigo-500/20 font-mono font-semibold text-xs flex items-center space-x-1">
                          <Scale className="h-3 w-3 text-indigo-400 mr-1 inline" />
                          <span>{t.weight_tons || 12.5} Tons</span>
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          t.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          t.status === "IN_TRANSIT" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                          "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {t.status}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-white mt-1.5 flex items-center space-x-3">
                        <span>{t.origin} → {t.destination}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs text-slate-400 font-normal flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-sky-400 inline mr-1" />
                          <span>Date: <strong className="text-slate-200 font-mono">{t.start_date}</strong></span>
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs text-slate-400 font-normal">Driver: <strong className="text-slate-200">{t.driver_name || "Ramesh Kumar"}</strong></span>
                      </p>
                    </div>
                  </div>

                  {/* Financial P&L Summary */}
                  <div className="flex items-center space-x-6 text-right">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">Freight Rate</span>
                      <span className="text-lg font-bold text-white">₹{t.freight_rate.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">Expenses</span>
                      <span className="text-lg font-bold text-slate-400">₹{t.total_expenses.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">Net Profit</span>
                      <span className={`text-xl font-extrabold ${t.net_profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        ₹{t.net_profit.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Workflow Buttons */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Goods: {t.goods_description} ({t.weight_tons || 12.5} Tons Payload)</span>
                  <div className="flex items-center space-x-2">
                    {t.status === "DISPATCHED" && (
                      <button
                        onClick={() => statusMutation.mutate({ tripId: t.id, status: "IN_TRANSIT" })}
                        className="px-3 py-1.5 rounded-lg bg-sky-600/20 text-sky-300 border border-sky-500/30 hover:bg-sky-600/30 font-semibold"
                      >
                        Mark In-Transit
                      </button>
                    )}
                    {t.status === "IN_TRANSIT" && (
                      <button
                        onClick={() => statusMutation.mutate({ tripId: t.id, status: "COMPLETED" })}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 font-semibold"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Create Trip + Vehicle Selection + Weight & Loading Date */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl p-6 rounded-2xl space-y-6 my-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Calculator className="h-5 w-5 text-indigo-400" />
                  <span>Dispatch Trip, Cargo Weight & Dispatch Date</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Trip Number</label>
                    <input
                      type="text"
                      value={tripNo}
                      onChange={(e) => setTripNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-indigo-400 mb-1">Assigned Vehicle Number</label>
                    <select
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      {vehicles?.map((v: any) => (
                        <option key={v.id} value={v.id}>
                          {v.reg_no} ({v.vehicle_type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Driver</label>
                    <select
                      value={driverId}
                      onChange={(e) => setDriverId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                    >
                      {drivers?.map((d: any) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.phone})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 mb-1">Cargo Weight (Tons)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={weightTons}
                      onChange={(e) => setWeightTons(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold font-mono text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-sky-400 mb-1">Dispatch / Loading Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Origin City</label>
                    <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Destination City</label>
                    <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm" required />
                  </div>
                </div>

                {/* Freight Rate */}
                <div className="p-4 rounded-xl bg-indigo-600/10 border border-indigo-500/20">
                  <label className="block text-xs font-semibold text-indigo-300 mb-1">Agreed Freight Revenue (₹)</label>
                  <input
                    type="number"
                    value={freightRate}
                    onChange={(e) => setFreightRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-lg"
                    required
                  />
                </div>

                {/* Expense Breakdown Inputs */}
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Trip Expense Itemization</span>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Fuel (₹)</label>
                    <input type="number" value={fuelCost} onChange={(e) => setFuelCost(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Toll (₹)</label>
                    <input type="number" value={tollCost} onChange={(e) => setTollCost(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Police/Misc (₹)</label>
                    <input type="number" value={policeCost} onChange={(e) => setPoliceCost(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Loading (₹)</label>
                    <input type="number" value={loadingCost} onChange={(e) => setLoadingCost(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                  </div>
                </div>

                {/* Real-time Computed Profit Badge */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Itemized Expenses</span>
                    <span className="text-sm font-bold text-slate-300">₹{totalExp.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Calculated Net Profit</span>
                    <span className={`text-xl font-extrabold ${netProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      ₹{netProfit.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
