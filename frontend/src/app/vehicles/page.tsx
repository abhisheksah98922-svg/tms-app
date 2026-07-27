"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/navigation/sidebar";
import { Truck, Plus, ShieldAlert, Calendar, CheckCircle2, X } from "lucide-react";

export default function VehiclesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [regNo, setRegNo] = useState("");
  const [vehicleType, setVehicleType] = useState("Container 32ft MX");
  const [capacityTons, setCapacityTons] = useState("15.0");

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehiclesList"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/vehicles`);
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return res.json();
    },
  });

  const createVehicleMutation = useMutation({
    mutationFn: async (newVehicle: any) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle),
      });
      if (!res.ok) throw new Error("Failed to create vehicle");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehiclesList"] });
      setIsModalOpen(false);
      setRegNo("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVehicleMutation.mutate({
      reg_no: regNo,
      vehicle_type: vehicleType,
      capacity_tons: parseFloat(capacityTons),
      status: "AVAILABLE",
      fitness_expiry: "2027-03-31",
      insurance_expiry: "2027-03-31",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Fleet Vehicle Roster</h1>
            <p className="text-slate-400 text-sm mt-1">Vehicle status tracking, payload capacities, and document compliance</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>

        {/* Vehicles Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Reg No</th>
                  <th className="py-3 px-4">Vehicle Type</th>
                  <th className="py-3 px-4">Payload Capacity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Fitness Expiry</th>
                  <th className="py-3 px-4">Insurance Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">Loading fleet vehicles...</td>
                  </tr>
                ) : (
                  vehicles?.map((v: any) => (
                    <tr key={v.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{v.reg_no}</td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">{v.vehicle_type}</td>
                      <td className="py-3.5 px-4 text-slate-300">{v.capacity_tons} Tons</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          v.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          v.status === "IN_TRANSIT" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                          "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{v.fitness_expiry || "2027-03-31"}</td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{v.insurance_expiry || "2027-03-31"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Register New Vehicle</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Number</label>
                  <input
                    type="text"
                    placeholder="MH-04-AB-1234"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Type</label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Container 32ft MX">Container 32ft MX</option>
                    <option value="10 Wheeler Open Body">10 Wheeler Open Body</option>
                    <option value="Trailer 40ft Multi-Axle">Trailer 40ft Multi-Axle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payload Capacity (Tons)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={capacityTons}
                    onChange={(e) => setCapacityTons(e.target.value)}
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
                    Save Vehicle
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
