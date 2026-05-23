import React, { useState } from "react";
import { 
  Building, 
  Trash2, 
  ShieldAlert, 
  Plus, 
  Percent, 
  Calculator, 
  BadgeHelp, 
  Info, 
  CheckCircle2, 
  ArrowRight,
  TrendingDown 
} from "lucide-react";
import { User, TdsTcsRecord } from "../types";

interface TdsTcsInputProps {
  user: User;
  onUpdateTdsTcs: (records: TdsTcsRecord[]) => void;
  onJumpToDashboard: () => void;
}

export default function TdsTcsInput({
  user,
  onUpdateTdsTcs,
  onJumpToDashboard
}: TdsTcsInputProps) {
  
  // Fields state for adding new entries
  const [payerName, setPayerName] = useState("");
  const [sectionCode, setSectionCode] = useState("192");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"TDS" | "TCS">("TDS");

  // Lookup chart explaining sections
  const sectionDescriptions: Record<string, { desc: string; rate: number; threshold: string }> = {
    "192": { desc: "Salary withholding tax deducted by employers", rate: 10, threshold: "Slab based" },
    "194A": { desc: "Tax on bank/FD interests. Bank deducts if interest exceeds limits", rate: 10, threshold: "₹40,000 (Non-Seniors)" },
    "194J": { desc: "Professional or technical consulting fees with flat withholding", rate: 10, threshold: "₹30,000" },
    "194C": { desc: "Subcontractors and commercial supplier payouts", rate: 2, threshold: "₹30,000" },
    "206C": { desc: "TCS collection on foreign travel remittances or luxury cars", rate: 5, threshold: "₹7,000,000" }
  };

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerName || !amount) return;

    const rateInfo = sectionDescriptions[sectionCode] ? sectionDescriptions[sectionCode].rate : 10;

    const newRecord: TdsTcsRecord = {
      id: "tds-" + Math.random().toString(36).substring(2),
      payerName,
      sectionCode,
      amount: Number(amount),
      rate: rateInfo,
      type,
      date: new Date().toISOString().split("T")[0]
    };

    onUpdateTdsTcs([...user.tdsTcs, newRecord]);
    
    // Reset forms
    setPayerName("");
    setAmount("");
  };

  const handleDeleteRecord = (id: string) => {
    onUpdateTdsTcs(user.tdsTcs.filter(r => r.id !== id));
  };

  const totalTds = user.tdsTcs.filter(r => r.type === "TDS").reduce((c, r) => c + r.amount, 0);
  const totalTcs = user.tdsTcs.filter(r => r.type === "TCS").reduce((c, r) => c + r.amount, 0);

  return (
    <div className="space-y-6 pb-12 bg-[#030e22] text-white">
      
      {/* Header */}
      <div className="text-left border-b border-gold-300/10 pb-4">
        <span className="text-xs text-gold-400 font-mono tracking-widest uppercase font-bold">
          Step III of Tax planning
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight mt-1">
          TDS Credits & TCS Collections
        </h1>
        <p className="text-xs text-gray-400">
          State taxes already deducted on your behalf (e.g. salary TDS, bank deposits, property buying). These subtract directly from your computed slab tax.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Add and List Credits */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Form Create */}
          <form onSubmit={handleCreateRecord} className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/15 space-y-4 text-left">
            <h4 className="font-display font-black text-sm uppercase text-gold-300 tracking-wide mb-2">
              Log Tax Credit Entry
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Payer / Collector Name</label>
                <input
                  type="text"
                  required
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  placeholder="e.g. State Bank of India"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-sans text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Credit Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType("TDS")}
                    className={`py-2 text-xs font-display font-bold rounded-xl border transition-all cursor-pointer ${
                      type === "TDS"
                        ? "bg-gold-500/15 text-gold-300 border-gold-400/50"
                        : "bg-luxe-950 text-gray-500 border-gold-300/5"
                    }`}
                  >
                    TDS (Deducted at Source)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("TCS")}
                    className={`py-2 text-xs font-display font-bold rounded-xl border transition-all cursor-pointer ${
                      type === "TCS"
                        ? "bg-gold-500/15 text-gold-300 border-gold-400/50"
                        : "bg-luxe-950 text-gray-500 border-gold-300/5"
                    }`}
                  >
                    TCS (Collected at Source)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold font-sans">Under Tax Section</label>
                <select
                  value={sectionCode}
                  onChange={(e) => setSectionCode(e.target.value)}
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-sans text-sm outline-none text-white font-medium transition-all"
                >
                  <option value="192">Section 192 (Salary payments withholding)</option>
                  <option value="194A">Section 194A (Bank Deposits / Interest on FDs)</option>
                  <option value="194J">Section 194J (Freelancer Consulting / Professional Fees)</option>
                  <option value="194C">Section 194C (Traders, Subcontracts, Supplies)</option>
                  <option value="206C">Section 206C (TCS on international travel/remittance)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold font-sans">Amount Deducted (INR)</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all animate-none"
                />
              </div>
            </div>

            {/* Live descriptions explanation */}
            {sectionDescriptions[sectionCode] && (
              <div className="bg-[#02050e] p-3 rounded-xl border border-gold-300/10 text-xs text-gray-400 leading-relaxed">
                ℹ️ <strong>Section {sectionCode} Rule:</strong> {sectionDescriptions[sectionCode].desc}. Standard tax withholding rate is <strong>{sectionDescriptions[sectionCode].rate}%</strong> above threshold of <strong>{sectionDescriptions[sectionCode].threshold}</strong>.
              </div>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center space-x-1.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:brightness-110 active:brightness-95 text-luxe-950 font-display font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
            >
              <Plus className="h-4.5 w-4.5 text-luxe-950" />
              <span>Log Credit on portfolio</span>
            </button>
          </form>

          {/* List existing entries */}
          <div className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/10">
            <h4 className="font-display font-black text-sm uppercase text-gray-200 tracking-wide mb-4 text-left">
              Active ledger Credits ({user.tdsTcs.length} entries)
            </h4>

            {user.tdsTcs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[500px] divide-y divide-gold-300/10 font-sans">
                  <thead>
                    <tr className="text-gray-400 font-bold bg-[#02050e]/40">
                      <th className="py-2 px-3">Payer / organization</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Section</th>
                      <th className="py-2 px-3">Withholding rate</th>
                      <th className="py-2 px-3 text-right">Tax Credit Amount</th>
                      <th className="py-2 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-300/5 font-mono text-gray-300">
                    {user.tdsTcs.map((item) => (
                      <tr key={item.id} className="hover:bg-luxe-900/15 transition-colors">
                        <td className="py-3 px-3 font-sans text-white text-[12.5px] font-medium">{item.payerName}</td>
                        <td className="py-3 px-3 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.type === "TDS" ? "bg-amber-500/10 text-amber-400" : "bg-teal-500/10 text-teal-400"
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gold-300">Sec {item.sectionCode}</td>
                        <td className="py-3 px-3">{item.rate}%</td>
                        <td className="py-3 px-3 text-right text-emerald-400 font-bold text-sm">₹{item.amount.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleDeleteRecord(item.id)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 text-xs">
                No active tax credits logged yet. Add your employer TDS details from Form 16 or bank 26AS reports to claim credits!
              </div>
            )}
          </div>

        </div>

        {/* Right Info panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats Panel */}
          <div className="bg-gradient-to-b from-luxe-900 to-luxe-950 p-5 rounded-2xl border border-gold-300/15 text-left">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-gold-300 mb-3">
              Credits summary
            </h4>
            
            <div className="space-y-2 text-xs text-gray-300 font-sans">
              <div className="flex justify-between">
                <span>Total TDS (withheld):</span>
                <span className="font-mono text-amber-400">₹{totalTds.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Total TCS (paid early):</span>
                <span className="font-mono text-teal-400">₹{totalTcs.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-gold-300/10 pt-2 flex justify-between text-white font-bold text-sm">
                <span>Total Tax Credit:</span>
                <span className="font-mono text-emerald-400">₹{(totalTds + totalTcs).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Slabs Fact sheet */}
          <div className="bg-luxe-950/40 p-5 rounded-2xl border border-gold-300/10 text-left space-y-3">
            <div className="flex items-center space-x-2 text-gold-400">
              <BadgeHelp className="h-5 w-5" />
              <h4 className="font-display font-extrabold text-xs tracking-wider uppercase">What is form 26AS / AIS?</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Form 26AS is your official annual tax statement compiled by the Income Tax Department of India showing TDS/TCS credited to your PAN card.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Always ensure the credits entered here match your actual Form 26AS or Annual Information Statement (AIS) to avoid automated tax mismatches and notice queries under Section 143(1).
            </p>
            <button
              onClick={onJumpToDashboard}
              className="w-full flex items-center justify-center space-x-1.5 bg-luxe-900 border border-gold-300/20 text-gold-300 text-xs font-bold py-2 px-4 rounded-xl hover:border-gold-300/50 transition-all font-sans"
            >
              <span>Back to Summary Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
