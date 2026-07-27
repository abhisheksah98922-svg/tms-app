"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/navigation/sidebar";
import { numberToWordsIndian } from "@/lib/numberToWords";
import { 
  Receipt, 
  Calculator, 
  Printer, 
  Save, 
  Plus, 
  Trash2, 
  Truck, 
  Scale, 
  Building2, 
  FileText, 
  Sparkles, 
  Sliders, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Palette, 
  Zap, 
  Copy, 
  ExternalLink 
} from "lucide-react";

export default function UltraStunningBillingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Mode & Color Palette
  const [renderMode, setRenderMode] = useState<"physical" | "modern">("physical");
  const [accentColor, setAccentColor] = useState<"slate" | "navy" | "emerald" | "violet">("slate");

  // 100% Fully Customizable Upper Header Section Controls
  const [invocationText, setInvocationText] = useState("|| श्री गणेशाय नम: ||");
  const [contractorName, setContractorName] = useState("BINOD KUMAR MANDAL");
  const [tagline, setTagline] = useState("FLEET OWNER & TRANSPORT CONTRACTORS");
  const [contractorAddress, setContractorAddress] = useState("Bhalchandra Patil, Pendgar Goan, Taloja Majkur, Raigarh, Maharashtra - 410208");
  const [mobileNos, setMobileNos] = useState("6201566735 / 8450918965");
  const [logoBadgeText, setLogoBadgeText] = useState("BKM TRANSPORT");
  const [panNo, setPanNo] = useState("FFWPM3650A");

  // Client & Invoice Metadata Header
  const [clientName, setClientName] = useState("FORTRAN STEEL PVT LTD");
  const [clientAddress, setClientAddress] = useState("TALOJA");
  const [billNo, setBillNo] = useState("1146");
  const [billDate, setBillDate] = useState("12/7/26");
  const [ewayBillNo, setEwayBillNo] = useState("EWB-9876543210");

  // Bank Details
  const [bankName, setBankName] = useState("HDFC Bank");
  const [branchName, setBranchName] = useState("TALOJA");
  const [accountNo, setAccountNo] = useState("50100654792964");
  const [ifscCode, setIfscCode] = useState("HDFC0004376");
  const [upiId, setUpiId] = useState("50100654792964@hdfcbank");

  // Work Entries
  const [workEntries, setWorkEntries] = useState([
    {
      id: 1,
      date_of_work: "26/6/26",
      truck_no: "MH46CL3384",
      description: "Taloja to Rasayanik",
      weight_kgs: 10450,
      rate_per_ton: "400",
      wt_charge: 0,
      amount: 4160,
    },
    {
      id: 2,
      date_of_work: "28/6/26",
      truck_no: "MH46CL3384",
      description: "Taloja to Murbar",
      weight_kgs: 15950,
      rate_per_ton: "700",
      wt_charge: 400,
      amount: 11565,
    },
    {
      id: 3,
      date_of_work: "30/6/26",
      truck_no: "MH46CL3384",
      description: "Pune Narhe to Taloja",
      weight_kgs: 495,
      rate_per_ton: "FIX",
      wt_charge: 0,
      amount: 4000,
    },
    {
      id: 4,
      date_of_work: "2/7/26",
      truck_no: "MH46CL3384",
      description: "Rasayanik to Taloja",
      weight_kgs: 10260,
      rate_per_ton: "400",
      wt_charge: 0,
      amount: 4104,
    },
    {
      id: 5,
      date_of_work: "7/7/26",
      truck_no: "MH46CL3384",
      description: "Khapoli to Taloja",
      weight_kgs: 9760,
      rate_per_ton: "FIX",
      wt_charge: 0,
      amount: 6000,
    },
    {
      id: 6,
      date_of_work: "8/7/26",
      truck_no: "MH46CL3384",
      description: "Khapoli to Taloja",
      weight_kgs: 11960,
      rate_per_ton: "550",
      wt_charge: 0,
      amount: 6578,
    },
  ]);

  // Extra charges
  const [unloadingCharges, setUnloadingCharges] = useState("0");
  const [extraWeightCharges, setExtraWeightCharges] = useState("0");
  const [detentionCharges, setDetentionCharges] = useState("0");
  const [lessAdvance, setLessAdvance] = useState("0");

  // Presets
  const applyPresetBinodMandal = () => {
    setInvocationText("|| श्री गणेशाय नम: ||");
    setContractorName("BINOD KUMAR MANDAL");
    setTagline("FLEET OWNER & TRANSPORT CONTRACTORS");
    setContractorAddress("Bhalchandra Patil, Pendgar Goan, Taloja Majkur, Raigarh, Maharashtra - 410208");
    setMobileNos("6201566735 / 8450918965");
    setLogoBadgeText("BKM TRANSPORT");
    setPanNo("FFWPM3650A");
    setBankName("HDFC Bank");
    setBranchName("TALOJA");
    setAccountNo("50100654792964");
    setIfscCode("HDFC0004376");
    setUpiId("50100654792964@hdfcbank");
  };

  const applyPresetApexLogistics = () => {
    setInvocationText("|| ॐ श्री गणेशाय नम: ||");
    setContractorName("APEX LOGISTICS INDIA PVT LTD");
    setTagline("EXPRESS FREIGHT & CARGO CARRIERS");
    setContractorAddress("Bhiwandi Logistics Hub, Building #4, Thane, Maharashtra - 421302");
    setMobileNos("+91 98765 43210 / 022-67890000");
    setLogoBadgeText("APEX CARGO");
    setPanNo("AAACA1234A");
    setBankName("ICICI Bank");
    setBranchName("BHIWANDI");
    setAccountNo("001105001234");
    setIfscCode("ICIC0000011");
    setUpiId("apexlogistics@icici");
  };

  // Row Manipulation
  const addRow = () => {
    const newId = Date.now();
    setWorkEntries([
      ...workEntries,
      {
        id: newId,
        date_of_work: "08-09-25",
        truck_no: "MH46CL3384",
        description: "TALOJA TO PUNE",
        weight_kgs: 16900,
        rate_per_ton: "900",
        wt_charge: 0,
        amount: 15210,
      },
    ]);
  };

  const removeRow = (id: number) => {
    if (workEntries.length === 1) return;
    setWorkEntries(workEntries.filter((row) => row.id !== id));
  };

  const updateRowField = (id: number, field: string, value: any) => {
    setWorkEntries(
      workEntries.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: value };
        if (field === "weight_kgs" || field === "rate_per_ton" || field === "wt_charge") {
          const wKgs = parseFloat(field === "weight_kgs" ? value : updated.weight_kgs) || 0;
          const rTon = parseFloat(field === "rate_per_ton" ? value : updated.rate_per_ton);
          const wtCh = parseFloat(field === "wt_charge" ? value : updated.wt_charge) || 0;

          if (!isNaN(rTon)) {
            updated.amount = Math.round((wKgs / 1000) * rTon + wtCh);
          }
        }
        return updated;
      })
    );
  };

  // Computations
  const totalKgs = workEntries.reduce((acc, row) => acc + (parseFloat(row.weight_kgs as any) || 0), 0);
  const totalTons = (totalKgs / 1000).toFixed(2);
  const subtotalWorkEntries = workEntries.reduce((acc, row) => acc + (parseFloat(row.amount as any) || 0), 0);
  const totalUnloading = parseFloat(unloadingCharges) || 0;
  const totalExtraWt = parseFloat(extraWeightCharges) || 0;
  const totalDetention = parseFloat(detentionCharges) || 0;
  const grossTotal = subtotalWorkEntries + totalUnloading + totalExtraWt + totalDetention;
  const advance = parseFloat(lessAdvance) || 0;
  const netTotal = grossTotal - advance;

  const totalInWords = numberToWordsIndian(netTotal);

  // Save Mutation
  const saveCustomInvoiceMutation = useMutation({
    mutationFn: async (payload: any) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/api/v1/invoices/custom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save invoice");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoicesList"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      router.push("/invoices");
    },
  });

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedTrips = workEntries.map((row) => ({
      dispatch_time_date: row.date_of_work,
      vehicle_reg_no: row.truck_no,
      origin: row.description.split(" to ")[0] || row.description,
      destination: row.description.split(" to ")[1] || "Destination",
      weight_tons: row.weight_kgs / 1000,
      rate_per_ton: parseFloat(row.rate_per_ton) || 0,
      freight_amount: row.amount,
    }));

    saveCustomInvoiceMutation.mutate({
      customer_name: clientName,
      customer_gstin: "27AAACR5432A1Z9",
      customer_state_code: "27",
      vehicle_trips: formattedTrips,
      freight_taxable_value: grossTotal,
      demurrage_charges: totalDetention,
      handling_charges: totalUnloading,
      gst_scheme: "RCM",
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <div className="print:hidden">
        <Sidebar />
      </div>

      <main className="flex-1 p-4 md:p-8 space-y-8 overflow-y-auto print:p-0 print:m-0 print:overflow-visible">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:hidden">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400 mr-1 inline" />
                <span>ULTRA-PRO BILLING STUDIO 3.0</span>
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-3 mt-1">
              <FileText className="h-7 w-7 text-indigo-400" />
              <span>State-of-the-Art Transport Invoice Studio</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Dual-mode billing generator with physical paper slip mode & ultra-modern glassmorphic fleet invoice mode</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>Print Bill</span>
            </button>
            <button
              onClick={handleSaveInvoice}
              disabled={saveCustomInvoiceMutation.isPending}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saveCustomInvoiceMutation.isPending ? "Saving..." : "Save to Ledger"}</span>
            </button>
          </div>
        </div>

        {/* Dual Mode Switcher & Palette Selector Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300">Bill Rendering Mode:</span>
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setRenderMode("physical")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  renderMode === "physical"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Physical Slip (Paper Book)
              </button>
              <button
                type="button"
                onClick={() => setRenderMode("modern")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  renderMode === "modern"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Ultra-Modern Corporate Fleet
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-300">Color Accent:</span>
            <div className="flex space-x-1.5">
              <button onClick={() => setAccentColor("slate")} className={`w-6 h-6 rounded-full bg-slate-700 border-2 ${accentColor === "slate" ? "border-white scale-110" : "border-transparent"}`} />
              <button onClick={() => setAccentColor("navy")} className={`w-6 h-6 rounded-full bg-sky-600 border-2 ${accentColor === "navy" ? "border-white scale-110" : "border-transparent"}`} />
              <button onClick={() => setAccentColor("emerald")} className={`w-6 h-6 rounded-full bg-emerald-600 border-2 ${accentColor === "emerald" ? "border-white scale-110" : "border-transparent"}`} />
              <button onClick={() => setAccentColor("violet")} className={`w-6 h-6 rounded-full bg-violet-600 border-2 ${accentColor === "violet" ? "border-white scale-110" : "border-transparent"}`} />
            </div>
          </div>
        </div>

        {/* Real-time Metric Cards Bar (Hidden on Print) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-semibold">Total Vehicles / Trips</span>
              <span className="text-xl font-extrabold text-white font-mono">{workEntries.length} Trips</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-semibold">Total Cargo Payload</span>
              <span className="text-xl font-extrabold text-white font-mono">{totalTons} Tons</span>
              <span className="text-[11px] text-slate-500 block font-mono">({totalKgs.toLocaleString()} KGS)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-semibold">Gross Freight Amount</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">₹{grossTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <Receipt className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block uppercase font-semibold">Net Payable Total</span>
              <span className="text-xl font-extrabold text-white font-mono">₹{netTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Studio Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (Left, Hidden on Print) */}
          <div className="lg:col-span-6 space-y-6 print:hidden">

            {/* 100% Customizable Header Controls Section */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-extrabold text-indigo-400 uppercase tracking-wider flex items-center space-x-2">
                  <Sliders className="h-4 w-4 text-indigo-400" />
                  <span>Customize Top Header (Heading Details)</span>
                </h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={applyPresetBinodMandal}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold hover:bg-indigo-600/30"
                  >
                    Binod Mandal
                  </button>
                  <button
                    type="button"
                    onClick={applyPresetApexLogistics}
                    className="px-2.5 py-1 rounded-lg bg-sky-600/20 text-sky-300 border border-sky-500/30 text-[11px] font-semibold hover:bg-sky-600/30"
                  >
                    Apex Logistics
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Invocation Line (Mantra)</label>
                  <input
                    type="text"
                    value={invocationText}
                    onChange={(e) => setInvocationText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Contact / Mobile Numbers</label>
                  <input
                    type="text"
                    value={mobileNos}
                    onChange={(e) => setMobileNos(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Transport / Fleet Owner Name</label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-extrabold text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tagline / Business Sub-heading</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Logo Badge Text</label>
                  <input
                    type="text"
                    value={logoBadgeText}
                    onChange={(e) => setLogoBadgeText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Contractor Address</label>
                <input
                  type="text"
                  value={contractorAddress}
                  onChange={(e) => setContractorAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              {/* Client & Bill Metadata Controls */}
              <h2 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider pt-2 border-t border-slate-800">
                Client & Bill Details Box
              </h2>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client / Company Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Client Address / Location</label>
                  <input
                    type="text"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bill No.</label>
                  <input
                    type="text"
                    value={billNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Bill Date</label>
                  <input
                    type="text"
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PAN Number</label>
                  <input
                    type="text"
                    value={panNo}
                    onChange={(e) => setPanNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Work Entries Table Controls */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-white font-bold text-sm">
                  <Truck className="h-4 w-4 text-emerald-400" />
                  <span>Work & Vehicle Entries ({workEntries.length} Items)</span>
                </div>
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>+ Add Row</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {workEntries.map((row, index) => (
                  <div key={row.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-400 font-mono">
                      <span className="font-bold text-indigo-400">Entry #{index + 1}</span>
                      {workEntries.length > 1 && (
                        <button type="button" onClick={() => removeRow(row.id)} className="text-rose-400 hover:text-rose-300">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-3">
                        <label className="block text-slate-400 mb-0.5">Date</label>
                        <input type="text" value={row.date_of_work} onChange={(e) => updateRowField(row.id, "date_of_work", e.target.value)} className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono" />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-emerald-400 font-semibold mb-0.5">Truck No</label>
                        <input type="text" value={row.truck_no} onChange={(e) => updateRowField(row.id, "truck_no", e.target.value)} className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono font-bold" />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-slate-400 mb-0.5">Description (Route)</label>
                        <input type="text" value={row.description} onChange={(e) => updateRowField(row.id, "description", e.target.value)} className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 pt-1">
                      <div className="col-span-3">
                        <label className="block text-slate-400 mb-0.5">Weight (KGS)</label>
                        <input type="number" value={row.weight_kgs} onChange={(e) => updateRowField(row.id, "weight_kgs", e.target.value)} className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono" />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-slate-400 mb-0.5">Rate M/T (or FIX)</label>
                        <input type="text" value={row.rate_per_ton} onChange={(e) => updateRowField(row.id, "rate_per_ton", e.target.value)} className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold" />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-slate-400 mb-0.5">WT. CH. (Kata)</label>
                        <input type="number" value={row.wt_charge} onChange={(e) => updateRowField(row.id, "wt_charge", e.target.value)} className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono" />
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="block text-slate-400 mb-0.5">Amount (₹)</span>
                        <input type="number" value={row.amount} onChange={(e) => updateRowField(row.id, "amount", parseFloat(e.target.value) || 0)} className="w-full px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold font-mono text-right" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Details & UPI QR Config */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
              <h2 className="font-bold text-slate-400 uppercase tracking-wider">Bank Account & UPI Payment Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Bank Name</label>
                  <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Account Number</label>
                  <input type="text" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">IFSC Code</label>
                  <input type="text" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">UPI VPA Address</label>
                  <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Real-Time Bill Preview Card */}
          <div className="lg:col-span-6 space-y-4 print:col-span-12 print:w-full">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl sticky top-6 print:p-0 print:border-none print:shadow-none print:bg-white">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:hidden">
                <span className="text-indigo-400 font-bold text-sm flex items-center space-x-2">
                  <Receipt className="h-4 w-4" />
                  <span>{renderMode === "physical" ? "Physical Slip Mode (100% Paper Book Match)" : "Ultra-Modern Corporate Fleet Invoice"}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                  LIVE RENDER
                </span>
              </div>

              {/* RENDER MODE 1: PHYSICAL CARBON SLIP BILL MODE */}
              {renderMode === "physical" && (
                <div className="bg-white text-slate-900 p-6 rounded-lg font-sans border-4 border-slate-950 shadow-2xl text-xs space-y-3 printable-bill">
                  {/* Top Invocation */}
                  <div className="text-center font-bold text-slate-800 text-[11px]">
                    {invocationText}
                  </div>

                  {/* Main Header Box */}
                  <div className="border-2 border-slate-900 p-3 relative bg-slate-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-2 bg-slate-950 text-white rounded font-mono font-extrabold text-[10px]">
                          {logoBadgeText || "BKM"}
                        </div>
                      </div>
                      <div className="text-center flex-1 px-2">
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-950 uppercase">{contractorName}</h2>
                        <p className="text-[11px] font-bold text-slate-800 tracking-wide uppercase">{tagline}</p>
                        <p className="text-[10px] text-slate-700 mt-0.5">{contractorAddress}</p>
                      </div>
                      <div className="text-right text-[10px] font-mono font-bold">
                        <span>Mob.: {mobileNos}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client Name, Address, Bill No & Date Grid */}
                  <div className="border-2 border-slate-900 grid grid-cols-12 text-xs divide-x-2 divide-slate-900 bg-white">
                    <div className="col-span-8 p-2.5 space-y-1">
                      <div className="flex items-center">
                        <span className="font-bold w-20">Name :</span>
                        <span className="font-extrabold uppercase border-b border-slate-400 flex-1">{clientName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold w-20">Address :</span>
                        <span className="uppercase border-b border-slate-400 flex-1">{clientAddress}</span>
                      </div>
                    </div>
                    <div className="col-span-4 p-2.5 space-y-2 font-mono">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Bill No. :</span>
                        <span className="font-extrabold text-rose-700 text-base">{billNo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Date :</span>
                        <span className="font-bold">{billDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Work Entries Table */}
                  <div className="border-2 border-slate-900 overflow-hidden">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-slate-100 border-b-2 border-slate-900 font-bold uppercase text-[10px] text-center divide-x-2 divide-slate-900">
                        <tr>
                          <th className="py-2 px-1 w-[12%]">Date of Work</th>
                          <th className="py-2 px-1 w-[18%]">Truck No.</th>
                          <th className="py-2 px-2 text-left">DESCRIPTION</th>
                          <th className="py-2 px-1 w-[14%]">WEIGHT KGS.</th>
                          <th className="py-2 px-1 w-[12%]">RATE M/T</th>
                          <th className="py-2 px-1 w-[10%]">WT. CH.</th>
                          <th className="py-2 px-2 text-right w-[16%]">Amount Rs.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300 font-mono divide-x-2 divide-slate-900">
                        {workEntries.map((row) => (
                          <tr key={row.id} className="align-top">
                            <td className="py-2 px-1 text-center font-bold text-slate-800">{row.date_of_work}</td>
                            <td className="py-2 px-1 text-center font-bold text-slate-950">{row.truck_no}</td>
                            <td className="py-2 px-2 font-sans font-semibold text-slate-900">{row.description}</td>
                            <td className="py-2 px-1 text-center font-bold">{row.weight_kgs.toLocaleString("en-IN")}</td>
                            <td className="py-2 px-1 text-center font-bold">{row.rate_per_ton}</td>
                            <td className="py-2 px-1 text-center">{row.wt_charge > 0 ? row.wt_charge : "-"}</td>
                            <td className="py-2 px-2 text-right font-extrabold text-slate-950">
                              {row.amount.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="p-1 text-right text-[9px] font-mono text-slate-500 border-t border-slate-300">
                      E.& O.E
                    </div>

                    <div className="border-t-2 border-slate-900 grid grid-cols-12 divide-x-2 divide-slate-900 font-mono bg-slate-100 font-bold text-xs">
                      <div className="col-span-8 p-2 text-right uppercase font-sans">
                        TOTAL AMOUNT :
                      </div>
                      <div className="col-span-4 p-2 text-right font-extrabold text-base text-slate-950">
                        ₹{netTotal.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-slate-900 p-2.5 text-xs bg-slate-50 flex items-start space-x-2">
                    <span className="font-bold whitespace-nowrap">Rupees :</span>
                    <span className="font-bold italic underline text-slate-950 flex-1">{totalInWords}</span>
                  </div>

                  <div className="border-2 border-slate-900 grid grid-cols-12 divide-x-2 divide-slate-900 text-[10px]">
                    <div className="col-span-7 p-2.5 space-y-1">
                      <div className="font-bold text-slate-900">
                        <span>PAN NO. </span>
                        <span className="font-mono text-indigo-950 font-extrabold">{panNo}</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-300">
                        <span className="font-bold text-slate-900 underline block mb-0.5">Bank Details :</span>
                        <div className="font-mono space-y-0.5 text-slate-800">
                          <p>Bank Name : <strong>{bankName}</strong></p>
                          <p>Branch : {branchName}</p>
                          <p>A/c No. : <strong>{accountNo}</strong></p>
                          <p>RTGS/NEFT/IFSC : <strong>{ifscCode}</strong></p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-5 p-2.5 flex flex-col justify-between text-center font-bold">
                      <div className="pt-8 border-b border-slate-300 pb-1">
                        <span className="text-slate-500 font-normal">Receiver's Signature</span>
                      </div>
                      <div className="pt-4 space-y-1">
                        <p className="text-[10px]">For <strong>{contractorName}</strong></p>
                        <div className="font-serif italic text-blue-800 text-sm font-extrabold underline py-1">
                          {contractorName.split(" ")[0]}
                        </div>
                        <p className="text-slate-600 font-semibold text-[9px]">Prop. / Manager</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RENDER MODE 2: ULTRA-MODERN CORPORATE FLEET INVOICE MODE */}
              {renderMode === "modern" && (
                <div className="bg-slate-950 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-6 shadow-2xl text-xs printable-bill">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-widest block">{invocationText}</span>
                      <h2 className="text-2xl font-extrabold text-white tracking-tight">{contractorName}</h2>
                      <p className="text-xs text-slate-400 font-semibold">{tagline}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{contractorAddress}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold block">
                        INV NO: {billNo}
                      </span>
                      <span className="text-xs font-mono text-slate-400 block">Date: {billDate}</span>
                      <span className="text-[11px] font-mono text-emerald-400 block">PAN: {panNo}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To Shipper:</span>
                      <p className="text-sm font-extrabold text-white mt-1">{clientName}</p>
                      <p className="text-xs text-slate-400">{clientAddress}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Logistics Payload:</span>
                      <p className="text-sm font-extrabold text-sky-400 font-mono mt-1">{totalTons} Tons Payload</p>
                      <p className="text-xs text-slate-400 font-mono">({totalKgs.toLocaleString()} KGS across {workEntries.length} trips)</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
                        <tr>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Truck Reg</th>
                          <th className="py-2 px-3">Route Description</th>
                          <th className="py-2 px-3 text-right">Weight (KGS)</th>
                          <th className="py-2 px-3 text-right">Rate / Ton</th>
                          <th className="py-2 px-3 text-right">Kata Chg</th>
                          <th className="py-2 px-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 font-mono">
                        {workEntries.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-900/50">
                            <td className="py-2 px-3 text-slate-300">{row.date_of_work}</td>
                            <td className="py-2 px-3 font-bold text-emerald-400">{row.truck_no}</td>
                            <td className="py-2 px-3 font-sans text-slate-200">{row.description}</td>
                            <td className="py-2 px-3 text-right text-slate-300">{row.weight_kgs.toLocaleString("en-IN")}</td>
                            <td className="py-2 px-3 text-right text-slate-300">{row.rate_per_ton}</td>
                            <td className="py-2 px-3 text-right text-slate-400">{row.wt_charge > 0 ? `₹${row.wt_charge}` : "-"}</td>
                            <td className="py-2 px-3 text-right font-extrabold text-white">₹{row.amount.toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
                    <span className="text-slate-400 font-sans text-xs">Amount in Words: <strong className="text-white italic underline">{totalInWords}</strong></span>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-sans">Net Receivable Total</span>
                      <span className="text-xl font-extrabold text-indigo-400">₹{netTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px]">
                      <span className="font-bold text-indigo-400 font-sans block text-xs">Bank Transfer Details</span>
                      <p className="text-slate-300">Bank: <strong className="text-white">{bankName}</strong> ({branchName})</p>
                      <p className="text-slate-300">A/c No: <strong className="text-white">{accountNo}</strong></p>
                      <p className="text-slate-300">IFSC: <strong className="text-white">{ifscCode}</strong></p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-400 block">UPI Instant Payment</span>
                        <span className="text-[11px] font-mono text-slate-400 block">{upiId}</span>
                        <span className="text-[10px] text-slate-500 block mt-1">Scan QR Code to pay</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg">
                        <QrCode className="h-10 w-10 text-slate-950" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
