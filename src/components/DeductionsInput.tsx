import React, { useState } from "react";
import { 
  DollarSign, 
  HelpCircle, 
  Calculator, 
  FolderPlus, 
  Info, 
  CircleAlert, 
  CheckCircle2, 
  Compass, 
  Sparkles, 
  ArrowRight,
  ShieldCheck 
} from "lucide-react";
import { User, DeductionsInput as DeductionsType } from "../types";
import { calculateHraExemption } from "../utils/taxCalculator";

interface DeductionsInputProps {
  user: User;
  onUpdateDeductions: (deductions: DeductionsType) => void;
  onJumpToTds: () => void;
}

export default function DeductionsInput({
  user,
  onUpdateDeductions,
  onJumpToTds
}: DeductionsInputProps) {
  
  // HRA Wizard Internal State to feed back into standard deductions
  const [useHraWizard, setUseHraWizard] = useState(true);
  const basicSalary = user.income.salary.basic;
  const hraAllowance = user.income.salary.hra;
  const daSalary = user.income.salary.da;

  const localDeductions = { ...user.deductions };

  const handleFieldChange = (
    category: keyof DeductionsType,
    field: string,
    value: number | boolean
  ) => {
    const origVal = localDeductions[category];
    let updatedCategory: any;

    if (origVal && typeof origVal === "object") {
      updatedCategory = { ...origVal } as any;
      updatedCategory[field] = value;
    } else {
      updatedCategory = value;
    }

    const newDeductions: DeductionsType = {
      ...localDeductions,
      [category]: updatedCategory
    };
    onUpdateDeductions(newDeductions);
  };

  // 1. Calculate Real-Time 80C Sum
  const sum80C =
    localDeductions.sec80C.providentFund +
    localDeductions.sec80C.publicProvidentFund +
    localDeductions.sec80C.elss +
    localDeductions.sec80C.lifeInsurance +
    localDeductions.sec80C.stampDuty +
    localDeductions.sec80C.tuitionFees +
    localDeductions.sec80C.principalHomeLoan;

  const allowed80C = Math.min(150000, sum80C);
  const overflow80C = Math.max(0, sum80C - 150000);

  // 2. Calculate Real-Time 80D Sum
  const selfHealthLimit = 25000;
  const allowedSelfHealth = Math.min(selfHealthLimit, localDeductions.sec80D.selfFamilyHealth + localDeductions.sec80D.preventiveHealthCheckup);
  
  const parentsLimit = localDeductions.sec80D.parentsSenior ? 50000 : 25000;
  const allowedParentsHealth = Math.min(parentsLimit, localDeductions.sec80D.parentsHealth);
  
  const sum80D = allowedSelfHealth + allowedParentsHealth;

  // 3. Compute HRA Exemption Outcomes
  const computedHraExemption = calculateHraExemption(
    basicSalary,
    daSalary,
    hraAllowance,
    localDeductions.customHRA.rentPaid,
    localDeductions.customHRA.metroCity
  );

  return (
    <div className="space-y-6 pb-12 bg-[#030e22] text-white">
      
      {/* Header */}
      <div className="text-left border-b border-gold-300/10 pb-4">
        <span className="text-xs text-gold-400 font-mono tracking-widest uppercase font-bold">
          Step II of Tax planning
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight mt-1">
          Deductions & Section Limits Planner
        </h1>
        <p className="text-xs text-gray-400">
          Maximize your claims under Indian Chapter VI-A. Slabs are validated dynamically. Note: Deductions are only relevant for the Old Regime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main form scrolling block */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Section 1: HRA Wizard (DYNAMIC CALCULATOR EXCLUSION) */}
          <div className="bg-gradient-to-b from-[#0c234b]/60 to-[#071530]/80 p-5 rounded-2xl border border-gold-300/20 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-300/10 pb-3">
              <div className="text-left">
                <h3 className="font-display font-bold text-sm sm:text-base text-gold-300 flex items-center gap-1.5">
                  <Calculator className="h-4.5 w-4.5 text-gold-400" />
                  <span>Real-Time House Rent (HRA) Exemption Wizard</span>
                </h3>
                <p className="text-[11px] text-gray-400">Calculate Section 10(13A) limits on salary base</p>
              </div>
              <span className="bg-gold-500/10 text-gold-400 text-[10px] px-2 py-0.5 rounded uppercase font-mono font-bold">
                Sec 10(13A)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Rent Paid Annually</label>
                <input
                  type="number"
                  value={localDeductions.customHRA.rentPaid || ""}
                  onChange={(e) => handleFieldChange("customHRA", "rentPaid", Number(e.target.value))}
                  placeholder="e.g. 180000"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-xs sm:text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold font-sans">Metropolitan Residence</label>
                <select
                  value={localDeductions.customHRA.metroCity ? "true" : "false"}
                  onChange={(e) => handleFieldChange("customHRA", "metroCity", e.target.value === "true")}
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-sans text-xs sm:text-sm outline-white text-white font-medium transition-all"
                >
                  <option value="true">Metro Cities (Delhi, Mumbai, Kolkata, Chennai — 50% base)</option>
                  <option value="false">Non-Metro Cities (Bangalore, Pune, etc — 40% base)</option>
                </select>
              </div>
            </div>

            {/* Real-time details layout */}
            <div className="bg-[#02050e]/60 p-4 rounded-xl border border-gold-300/10">
              <h5 className="text-xs font-bold text-white mb-2">Detailed Rule-Based Exemption Factors:</h5>
              <div className="space-y-1.5 text-xs text-gray-300 font-sans">
                <div className="flex justify-between">
                  <span>1. Actual HRA received from firm:</span>
                  <span className="font-mono text-gray-400">₹{hraAllowance.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Rent paid excess of 10% (Basic + DA) base:</span>
                  <span className="font-mono text-gray-400">
                    ₹{Math.max(0, localDeductions.customHRA.rentPaid - 0.1 * (basicSalary + daSalary)).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>3. {localDeductions.customHRA.metroCity ? "50%" : "40%"} of Salary Basic + DA:</span>
                  <span className="font-mono text-gray-400">
                    ₹{((basicSalary + daSalary) * (localDeductions.customHRA.metroCity ? 0.5 : 0.4)).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="border-t border-gold-300/15 pt-2 flex justify-between font-bold text-white">
                  <span className="text-gold-200">Claimable HRA exemption (Minimum):</span>
                  <span className="font-mono text-emerald-400">₹{computedHraExemption.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: SECTION 80C PROGRESS BAR & FIELDS */}
          <div className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/10 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold-300/10 pb-3 gap-2">
              <div className="text-left font-display">
                <h3 className="font-bold text-sm sm:text-base text-gold-300 flex items-center gap-1.5">
                  <FolderPlus className="h-4.5 w-4.5 text-gold-400" />
                  <span>Section 80C Deductions (Maximum ₹1,50,000)</span>
                </h3>
                <p className="text-[11px] text-gray-400">EPF, PPF, School Fees, LIC Slabs</p>
              </div>
              <span className="bg-gold-500/10 text-gold-400 text-[10px] px-2.5 py-0.5 rounded font-mono font-bold">
                Max ₹1.5L Limit
              </span>
            </div>

            {/* Visual Progress tracker */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Current allocation: <strong>₹{sum80C.toLocaleString("en-IN")}</strong></span>
                <span className="font-bold text-gold-300">{((allowed80C / 150000) * 100).toFixed(0)}% Utilized</span>
              </div>
              <div className="w-full bg-luxe-900 rounded-full h-2.5 overflow-hidden border border-gold-300/5">
                <div 
                  className="bg-gradient-to-r from-gold-500 to-gold-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (sum80C / 150000) * 100)}%` }}
                />
              </div>
              {overflow80C > 0 && (
                <div className="text-[10px] text-amber-400 flex items-center gap-1 font-sans">
                  <CircleAlert className="h-3 w-3 shrink-0" />
                  <span>Surplus of ₹{overflow80C.toLocaleString("en-IN")} is discarded since 80C caps at ₹1.5 Lakhs. Choose Sec 80CCD NPS instead.</span>
                </div>
              )}
            </div>

            {/* Grid of 80C parts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">Employee Provident Fund (EPF)</label>
                <input
                  type="number"
                  value={localDeductions.sec80C.providentFund || ""}
                  onChange={(e) => handleFieldChange("sec80C", "providentFund", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-lg px-3 py-2 font-mono text-xs outline-none"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">Public Provident Fund (PPF)</label>
                <input
                  type="number"
                  value={localDeductions.sec80C.publicProvidentFund || ""}
                  onChange={(e) => handleFieldChange("sec80C", "publicProvidentFund", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-lg px-3 py-2 font-mono text-xs outline-none"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">ELSS Mutual Funds</label>
                <input
                  type="number"
                  value={localDeductions.sec80C.elss || ""}
                  onChange={(e) => handleFieldChange("sec80C", "elss", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-lg px-3 py-2 font-mono text-xs outline-none"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">LIC premium & Insurance</label>
                <input
                  type="number"
                  value={localDeductions.sec80C.lifeInsurance || ""}
                  onChange={(e) => handleFieldChange("sec80C", "lifeInsurance", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-lg px-3 py-2 font-mono text-xs outline-none"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">Stamp Duty on Real Estate</label>
                <input
                  type="number"
                  value={localDeductions.sec80C.stampDuty || ""}
                  onChange={(e) => handleFieldChange("sec80C", "stampDuty", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-lg px-3 py-2 font-mono text-xs outline-none"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">Kid's School Tuition Fees</label>
                <input
                  type="number"
                  value={localDeductions.sec80C.tuitionFees || ""}
                  onChange={(e) => handleFieldChange("sec80C", "tuitionFees", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-lg px-3 py-2 font-mono text-xs outline-none"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">Home Loan Principal repaid</label>
                <input
                  type="number"
                  value={localDeductions.sec80C.principalHomeLoan || ""}
                  onChange={(e) => handleFieldChange("sec80C", "principalHomeLoan", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-lg px-3 py-2 font-mono text-xs outline-none"
                />
              </div>

            </div>
          </div>

          {/* Section 3: SECTION 80D HEALTH INSURANCE */}
          <div className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/10 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gold-300/10 pb-3 gap-2">
              <div className="text-left">
                <h3 className="font-display font-bold text-sm sm:text-base text-gold-300 flex items-center gap-1.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-gold-400" />
                  <span>Section 80D Health Insurance premiums</span>
                </h3>
                <p className="text-[11px] text-gray-400">Medicare claims for self-family & senior parents</p>
              </div>
              <span className="bg-emerald-500/15 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                Max ₹75k Deductible
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Self, Spouse & Kids (Max ₹25,000)</label>
                  <span className="text-[9px] text-gray-500">Includes checkup up to ₹5k</span>
                </div>
                <input
                  type="number"
                  value={localDeductions.sec80D.selfFamilyHealth || ""}
                  onChange={(e) => handleFieldChange("sec80D", "selfFamilyHealth", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2 text-mono text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Parents medical cover premium</label>
                  <label className="flex items-center space-x-1 cursor-pointer text-[10px] text-gold-300 font-sans select-none">
                    <input
                      type="checkbox"
                      checked={localDeductions.sec80D.parentsSenior}
                      onChange={(e) => handleFieldChange("sec80D", "parentsSenior", e.target.checked)}
                      className="rounded text-gold-500 bg-[#02050e] border-gold-300/15 h-3.5 w-3.5 focus:ring-0 cursor-pointer"
                    />
                    <span>Senior Parents (&bull; limits increase to ₹50k)</span>
                  </label>
                </div>
                <input
                  type="number"
                  value={localDeductions.sec80D.parentsHealth || ""}
                  onChange={(e) => handleFieldChange("sec80D", "parentsHealth", Number(e.target.value))}
                  placeholder="INR"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2 text-mono text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: NPS, EDUCATION & 80G COMPLIANCE */}
          <div className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/10 space-y-4">
            <h4 className="font-display font-bold text-sm text-gold-300 mb-2 border-b border-gold-300/10 pb-2">
              🎓 NPS, Education Interest & Charities (80G)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-gray-400">NPS Sec 80CCD(1B)</label>
                  <span className="text-[9px] text-amber-400">Capped ₹50k</span>
                </div>
                <input
                  type="number"
                  value={localDeductions.sec80CCD1B || ""}
                  onChange={(e) => handleFieldChange("sec80CCD1B", "", Number(e.target.value))}
                  placeholder="Max 50000"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2 font-mono text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Education Loan interest (80E)</label>
                  <span className="text-[9px] text-gray-500">No Cap &bull; 8yrs</span>
                </div>
                <input
                  type="number"
                  value={localDeductions.sec80E || ""}
                  onChange={(e) => handleFieldChange("sec80E", "", Number(e.target.value))}
                  placeholder="Unlimited interest"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2 font-mono text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Section 80G Donations</label>
                  <span className="text-[9px] text-gray-500">Exempt based on trust</span>
                </div>
                <input
                  type="number"
                  value={localDeductions.sec80G.hundredPercentDonation || ""}
                  onChange={(e) => handleFieldChange("sec80G", "hundredPercentDonation", Number(e.target.value))}
                  placeholder="National funds"
                  className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2 font-mono text-xs sm:text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Navigation link footer */}
          <div className="flex justify-between pt-4">
            <span className="text-[10px] text-slate-500 italic self-center">
              * Limits validated based on latest income tax rule directives.
            </span>
            <button
              onClick={onJumpToTds}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-luxe-950 font-display font-extrabold text-xs sm:text-sm py-2.5 px-6 rounded-xl cursor-pointer shadow-lg active:scale-95"
            >
              <span>Verify TDS Deducted</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Right Info panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick analysis output */}
          <div className="bg-gradient-to-b from-luxe-900 to-luxe-950 p-5 rounded-2xl border border-gold-300/15 text-left space-y-3.5">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-gold-300">
              Claim Metrics Dashboard
            </h4>

            <div className="space-y-3.5 text-xs text-gray-300 font-sans">
              <div>
                <div className="flex justify-between mb-1">
                  <span>80C Clamped claim:</span>
                  <span className="font-mono font-bold text-white">₹{allowed80C.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full bg-luxe-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gold-500 h-1.5" style={{ width: `${(allowed80C / 150000) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>80D Health claim:</span>
                  <span className="font-mono font-bold text-white">₹{sum80D.toLocaleString("en-IN")}</span>
                </div>
                <div className="w-full bg-luxe-950 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#2559a4] h-1.5" style={{ width: `${(sum80D / 75000) * 100}%` }} />
                </div>
              </div>

              <div className="flex justify-between border-t border-gold-300/10 pt-2 text-white font-bold text-sm">
                <span>Sum Deductions:</span>
                <span className="font-mono text-gold-400">
                  ₹{(allowed80C + sum80D + Math.min(50000, localDeductions.sec80CCD1B) + localDeductions.sec80E + localDeductions.sec80G.hundredPercentDonation + computedHraExemption).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Compliance Insights Box */}
          <div className="bg-luxe-950/40 p-5 rounded-2xl border border-gold-300/10 text-left space-y-3">
            <div className="flex items-center space-x-2 text-gold-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <h4 className="font-display font-extrabold text-xs tracking-wider uppercase">Luxe optimization advisory</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              HRA exemption was successfully capped using the <strong>Minimum-of-Three</strong> rule under Section 10(13A). Standard Metro rates (50%) are applied dynamically.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              To maximize benefits under the Old Regime, ensure that health insurance premiums are paid via online modes (UPI, cards, banking). Cash payments of medical premiums are strictly disqualified except for preventive checks up to ₹5,000.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
