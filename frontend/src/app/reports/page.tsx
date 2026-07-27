"use client";

import React from "react";
import { Sidebar } from "@/components/navigation/sidebar";
import { Download, FileSpreadsheet, FileText, PieChart } from "lucide-react";

export default function ReportsPage() {
  const handleExportTripsCSV = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
    window.open(`${baseUrl}/api/v1/reports/export/trips`, "_blank");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Reports & Financial Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">Export full trip ledgers, P&L statements, and GST tax reports</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trip P&L CSV Export */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Trip P&L CSV Report</h3>
                <p className="text-xs text-slate-400">Complete itemized freight rates, trip expenses, and net profit</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Export all trip dispatches including origin/destination, freight revenue, fuel, toll, labour, and allocated driver salary in standard CSV format.
            </p>

            <button
              onClick={handleExportTripsCSV}
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20"
            >
              <Download className="h-4 w-4" />
              <span>Download Trips CSV</span>
            </button>
          </div>

          {/* GST Tax Summary Report */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">GST Filing Tax Report</h3>
                <p className="text-xs text-slate-400">HSN 996511 CGST / SGST / IGST tax liability</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Generate a breakdown of taxable values and calculated tax splits (CGST 6% + SGST 6% vs IGST 12%) for GSTR-1 and GSTR-3B filings.
            </p>

            <button
              onClick={handleExportTripsCSV}
              className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
            >
              <Download className="h-4 w-4" />
              <span>Export Tax Summary</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
