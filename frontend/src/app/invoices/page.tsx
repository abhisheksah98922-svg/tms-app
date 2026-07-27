"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/navigation/sidebar";
import { Receipt, Plus, DollarSign, Printer, CheckCircle2, X, Building2, Truck, Scale, Calendar, Sparkles } from "lucide-react";

export default function InvoicesPage() {
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentModalInv, setPaymentModalInv] = useState<any>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("BANK_TRANSFER");
  const [payRef, setPayRef] = useState("");

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoicesList"],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/invoices`);
      if (!res.ok) throw new Error("Failed to fetch invoices");
      return res.json();
    },
  });

  const recordPaymentMutation = useMutation({
    mutationFn: async (payload: any) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/invoices/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to record payment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoicesList"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      setPaymentModalInv(null);
      setPayAmount("");
      setPayRef("");
    },
  });

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInv) return;
    recordPaymentMutation.mutate({
      invoice_id: paymentModalInv.id,
      amount: parseFloat(payAmount),
      method: payMethod,
      reference_no: payRef,
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">GST Invoices & Payment Ledger</h1>
            <p className="text-slate-400 text-sm mt-1">FY-sequential GST compliant billing (HSN 996511), vehicle registration link, cargo weight (Tons), loading date, and state tax splits</p>
          </div>
          <Link
            href="/billing"
            className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25"
          >
            <Plus className="h-4 w-4" />
            <span>Create Custom Bill</span>
          </Link>
        </div>

        {/* Invoices Table */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Vehicle Number</th>
                  <th className="py-3 px-4">Cargo Weight</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Taxable Value</th>
                  <th className="py-3 px-4">GST Tax Split</th>
                  <th className="py-3 px-4 text-right">Total Amount</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-400">Loading invoices...</td>
                  </tr>
                ) : !invoices || invoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Receipt className="h-10 w-10 text-slate-600" />
                        <p className="text-slate-300 font-semibold text-base">No GST Invoices issued yet</p>
                        <p className="text-slate-500 text-xs max-w-sm">Use the Custom Billing Studio to generate physical transport slips or GST invoices!</p>
                        <Link
                          href="/billing"
                          className="mt-2 px-4 py-2 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold hover:bg-indigo-600/30 transition-all flex items-center space-x-2"
                        >
                          <Sparkles className="h-4 w-4 text-indigo-400" />
                          <span>Open Custom Billing Studio</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">{inv.invoice_no}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-xs">
                        <span className="flex items-center space-x-1">
                          <Truck className="h-3.5 w-3.5" />
                          <span>{inv.vehicle_reg_no || "MH-04-JK-9821"}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-sky-400 text-xs">
                        <span className="flex items-center space-x-1">
                          <Scale className="h-3.5 w-3.5" />
                          <span>{inv.weight_tons || 12.5} Tons</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">{inv.customer_name || "Commercial Client"}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-200">₹{inv.taxable_value.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                        {inv.igst_amount > 0 ? (
                          <span className="text-amber-400 font-semibold">IGST 12%: ₹{inv.igst_amount.toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">CGST 6% + SGST 6%: ₹{(inv.cgst_amount + inv.sgst_amount).toLocaleString("en-IN")}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">₹{inv.total_amount.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-400">₹{inv.balance_due.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                          inv.status === "PARTIAL" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center space-x-2">
                        {inv.balance_due > 0 && (
                          <button
                            onClick={() => {
                              setPaymentModalInv(inv);
                              setPayAmount(inv.balance_due.toString());
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30"
                          >
                            Collect Payment
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30"
                        >
                          Print PDF
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable PDF Invoice View Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl p-8 rounded-2xl space-y-6 text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <Receipt className="h-6 w-6 text-indigo-400" />
                  <h3 className="text-xl font-bold text-white">Tax Invoice — {selectedInvoice.invoice_no}</h3>
                </div>
                <button onClick={() => setSelectedInvoice(null)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Invoice Layout */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-6 text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h4 className="font-extrabold text-white text-base">Apex Logistics India Pvt Ltd</h4>
                    <p className="text-xs text-slate-400">Bhiwandi Logistics Park, Thane, MH</p>
                    <p className="text-xs font-mono text-indigo-400 mt-1">GSTIN: 27AAACA1234A1Z5</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400">Invoice Date: {selectedInvoice.invoice_date}</span>
                    <p className="text-xs font-mono text-slate-400 mt-1">HSN/SAC: {selectedInvoice.hsn_sac}</p>
                    <p className="text-xs font-mono text-emerald-400 mt-1 font-bold">Vehicle Reg: {selectedInvoice.vehicle_reg_no || "MH-04-JK-9821"}</p>
                    <p className="text-xs font-mono text-sky-400 mt-1 font-bold">Billed Weight: {selectedInvoice.weight_tons || 12.5} Tons</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase">Billed To Customer:</span>
                    <p className="font-semibold text-white mt-1">{selectedInvoice.customer_name || "Commercial Client"}</p>
                    <p className="text-slate-400">GSTIN Verified</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-400 uppercase">Status:</span>
                    <p className="font-bold text-emerald-400 text-sm mt-1">{selectedInvoice.status}</p>
                  </div>
                </div>

                {/* Tax Breakdown Table */}
                <table className="w-full text-xs text-left border-t border-slate-800 pt-2">
                  <thead className="text-slate-400">
                    <tr>
                      <th className="py-2">Description</th>
                      <th className="py-2 text-right">Taxable</th>
                      <th className="py-2 text-right">CGST</th>
                      <th className="py-2 text-right">SGST</th>
                      <th className="py-2 text-right">IGST</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono divide-y divide-slate-800">
                    <tr>
                      <td className="py-2 font-sans">Freight Transportation ({selectedInvoice.vehicle_reg_no || "MH-04-JK-9821"} — {selectedInvoice.weight_tons || 12.5} Tons Payload)</td>
                      <td className="py-2 text-right">₹{selectedInvoice.taxable_value.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right">₹{selectedInvoice.cgst_amount.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right">₹{selectedInvoice.sgst_amount.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right">₹{selectedInvoice.igst_amount.toLocaleString("en-IN")}</td>
                      <td className="py-2 text-right font-bold text-white">₹{selectedInvoice.total_amount.toLocaleString("en-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Tax Invoice</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Collect Payment Modal */}
        {paymentModalInv && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Record Payment Collection</h3>
                <button onClick={() => setPaymentModalInv(null)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Invoice Number</label>
                  <input type="text" value={paymentModalInv.invoice_no} disabled className="w-full px-3 py-2 rounded-xl bg-slate-950 text-slate-400 font-mono text-sm border border-slate-800" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Amount (₹)</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Mode</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">UPI Payment</option>
                    <option value="CHEQUE">Cheque</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Reference / UTR Number</label>
                  <input
                    type="text"
                    placeholder="NEFT-HDFC123456"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-3">
                  <button type="button" onClick={() => setPaymentModalInv(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium">Save Receipt</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
