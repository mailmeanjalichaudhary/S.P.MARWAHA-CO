import React, { useRef } from "react";
import { 
  Download, 
  Printer, 
  FileCheck, 
  Award, 
  IndianRupee, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  TrendingUp 
} from "lucide-react";
import { User, TaxCalculationResult, ComparisonResult } from "../types";
import { compareRegimes } from "../utils/taxCalculator";

interface ReportsPanelProps {
  user: User;
}

export default function ReportsPanel({ user }: ReportsPanelProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const comparison: ComparisonResult = compareRegimes(user.income, user.deductions, user.tdsTcs);
  const { oldRegime, newRegime, saveRegime, marginSavings } = comparison;
  const activeRegimeResult = saveRegime === "old" ? oldRegime : newRegime;

  const handlePrint = () => {
    // Elegant browser native print mechanism
    window.print();
  };

  const currentFormattedDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="space-y-8 pb-12 bg-[#030e22] text-white">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gold-300/10 pb-5 gap-3 text-left">
        <div>
          <span className="text-xs text-gold-400 font-mono tracking-widest uppercase font-bold">
            Step IV of Compliance
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight mt-1">
            Tax Audit & Planning certificate
          </h1>
          <p className="text-xs text-gray-400">Generate, print, or download compliant statements for AY 2025-26.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-gold-500 to-gold-600 font-display font-extrabold text-luxe-950 text-xs px-5 py-2.5 rounded-xl hover:brightness-110 cursor-pointer shadow-md active:scale-95 transition-all print:hidden"
          >
            <Printer className="h-4.5 w-4.5 text-luxe-950" />
            <span>Print Compliance Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Printable Document Sheet */}
        <div className="lg:col-span-8 bg-white text-luxe-950 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden border border-gold-300/30 font-sans" id="printable-area">
          
          {/* Watermark/Luxury badge in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none">
            <Award className="h-[400px] w-[400px] text-gold-500" />
          </div>

          {/* Letterhead */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold-300/20 pb-6 gap-4">
            <div className="text-left font-display">
              <span className="text-[10px] text-gold-600 font-mono tracking-widest uppercase font-bold">Official Document</span>
              <h2 className="text-xl font-black text-luxe-900 tracking-tight flex items-center gap-1">
                FINANCE LUXE TAX PLANNER
              </h2>
              <p className="text-[10px] text-gray-400">AY 2025-26 &bull; Certified Simulation Record</p>
            </div>
            
            <div className="text-left sm:text-right font-sans shrink-0">
              <span className="bg-luxe-950 text-gold-300 text-[10px] px-3 py-1 rounded-sm uppercase tracking-wide font-bold font-mono">
                SECURE DRAFT CODE: LUXE-{Math.floor(1000 + Math.random() * 9000)}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">Generated: {currentFormattedDate}</p>
            </div>
          </div>

          {/* User Details Block */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Taxfiler Name</span>
              <p className="text-xs font-bold text-luxe-900">{user.displayName}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">PAN Reference</span>
              <p className="text-xs font-mono font-bold text-luxe-900">APXPC****L (Simulated)</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Profile / Class</span>
              <p className="text-xs font-semibold text-luxe-900 capitalize">{user.occupation}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400">Optimum Slabs</span>
              <p className="text-xs font-bold text-emerald-600 uppercase">
                {saveRegime === "old" ? "Old Scheme" : "New Scheme (Revised)"}
              </p>
            </div>
          </div>

          {/* Core financial outcomes table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-luxe-900 text-left border-b border-gold-300/10 pb-1 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-gold-500" />
              <span>Full Double Schema Income Tax calculation Sheet</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[450px] divide-y divide-gray-200">
                <thead>
                  <tr className="bg-slate-50 text-gray-500 font-bold">
                    <th className="py-2.5 px-3">Financial Head Column</th>
                    <th className="py-2.5 px-3 text-right">Old Regime</th>
                    <th className="py-2.5 px-3 text-right">New Regime (Revised)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono text-slate-700">
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Gross total income (Section 14)</td>
                    <td className="py-2 px-3 text-right">₹{oldRegime.grossTotalIncome.toLocaleString("en-IN")}</td>
                    <td className="py-2 px-3 text-right">₹{newRegime.grossTotalIncome.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Standard Allowances & HRA Exemption</td>
                    <td className="py-2 px-3 text-right text-[#2559a4] font-bold">
                      ₹{(oldRegime.unclaimedExemptions.standardDeduction + oldRegime.unclaimedExemptions.hraExemption).toLocaleString("en-IN")}
                    </td>
                    <td className="py-2 px-3 text-right text-gold-600 font-bold">
                      ₹{newRegime.unclaimedExemptions.standardDeduction.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Chapter VI-A ClaimsClaimed</td>
                    <td className="py-2 px-3 text-right text-gray-600 font-bold">₹{oldRegime.totalDeductions.toLocaleString("en-IN")}</td>
                    <td className="py-2 px-3 text-right text-gray-500">₹0 (Disallowed)</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-800">Net Taxable income (Section 2(24))</td>
                    <td className="py-2.5 px-3 text-right font-bold">₹{oldRegime.taxableIncome.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3 text-right font-bold">₹{newRegime.taxableIncome.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Section 87A Marginal Rebate</td>
                    <td className="py-2 px-3 text-right text-emerald-600 font-semibold">₹{oldRegime.rebate87A.toLocaleString("en-IN")}</td>
                    <td className="py-2 px-3 text-right text-emerald-600 font-semibold">₹{newRegime.rebate87A.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-800">Health & Education Cess (4%)</td>
                    <td className="py-2 px-3 text-right">₹{oldRegime.cess.toLocaleString("en-IN")}</td>
                    <td className="py-2 px-3 text-right">₹{newRegime.cess.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="bg-luxe-950/5 border-t-2 border-gold-400">
                    <td className="py-2.5 px-3 font-sans font-bold text-luxe-900 text-sm">Net Tax Liability Surcharges Out</td>
                    <td className="py-2.5 px-3 text-right font-bold text-sm">₹{oldRegime.totalTaxLiability.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-sm">₹{newRegime.totalTaxLiability.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="bg-amber-500/5">
                    <td className="py-2.5 px-3 font-sans font-bold text-gold-700">TDS / TCS credits (Form 26AS)</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">₹{oldRegime.tdsTcsCredited.toLocaleString("en-IN")}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">₹{newRegime.tdsTcsCredited.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr className="bg-emerald-500/5 border-t border-emerald-400">
                    <td className="py-3 px-3 font-sans font-black text-luxe-950 text-base">
                      {activeRegimeResult.finalPayableOrRefund <= 0 ? "Refund Due" : "Settlement Payable"}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-base" colSpan={2}>
                      <span className={activeRegimeResult.finalPayableOrRefund <= 0 ? "text-emerald-700" : "text-amber-700"}>
                        ₹{Math.abs(activeRegimeResult.finalPayableOrRefund).toLocaleString("en-IN")}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Optimization Certificate seal branding */}
          <div className="border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-left bg-slate-50">
            <div className="h-12 w-12 bg-gold-400/10 border border-gold-400/30 rounded-full flex items-center justify-center shrink-0">
              <Award className="h-6 w-6 text-gold-600" />
            </div>

            <div>
              <h5 className="text-xs font-black text-luxe-900 uppercase">LUXE OPTIMIZATION REPORT APPROVED</h5>
              <p className="text-[10.5px] text-gray-500 leading-relaxed font-sans">
                This filing sheet advises using the <strong>{saveRegime.toUpperCase()} REGIME</strong> for filing income returns, saving standard taxable assets worth <strong>₹{marginSavings.toLocaleString("en-IN")}</strong> on final cess schedules.
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end border-t border-gold-300/10 pt-6">
            <div className="text-left">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest font-mono">Digital Signature Hash</span>
              <p className="text-[10px] font-mono text-gray-600">sha256-46087df3-5930-4da8-8d37-d369b3373b1e</p>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-black text-[13px] text-luxe-900 border-b border-luxe-900/10 pb-0.5">
                luxe tax engine
              </div>
              <span className="text-[9px] text-gray-500 font-sans">Automated AI Auditor and Planner</span>
            </div>
          </div>

        </div>

        {/* Right Help Column */}
        <div className="lg:col-span-4 space-y-6 print:hidden">
          
          <div className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/10 text-left space-y-4">
            <div className="flex items-center space-x-2 text-gold-400">
              <ShieldCheck className="h-5 w-5" />
              <h4 className="font-display font-extrabold text-xs tracking-wider uppercase">Compliance Verification</h4>
            </div>

            <ul className="space-y-2 text-xs text-gray-400 leading-relaxed font-sans">
              <li className="flex items-start gap-2 text-left">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Standard Deduction (₹75k for FY 24-25 New Regime, and ₹50k for Old Regime) successfully factored.</span>
              </li>
              <li className="flex items-start gap-2 text-left">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rebate under Section 87A factored up to ₹7 Lakhs for New Tax Slabs.</span>
              </li>
              <li className="flex items-start gap-2 text-left">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>All chapter VI-A caps successfully audited against current laws.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-b from-luxe-900 to-luxe-950 p-5 rounded-2xl border border-gold-300/15 text-left space-y-3">
            <h4 className="font-display font-bold text-xs uppercase text-gold-300">Disclaimer of Liability</h4>
            <p className="text-[10.5px] text-gray-400 leading-relaxed font-sans">
              This tax report is simulated using default computational scripts based on tax slab rules in India. While we strive to maintain top compliance accuracy, tax slabs vary based on custom provisions. 
            </p>
            <p className="text-[10.5px] text-gray-400 leading-relaxed font-sans font-semibold">
              Final tax states must be verified with a qualified Chartered Accountant before completing returns on the government ITR e-filing portal.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
