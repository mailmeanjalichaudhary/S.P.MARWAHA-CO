import React from "react";
import { 
  TrendingUp, 
  ShieldAlert, 
  HelpCircle, 
  Download, 
  FileCheck, 
  Calendar, 
  AlertCircle, 
  Sparkles, 
  Coins, 
  BarChart2, 
  CheckCircle2, 
  Zap, 
  IndianRupee 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { User, TaxCalculationResult, ComparisonResult } from "../types";
import { compareRegimes } from "../utils/taxCalculator";

interface TaxDashboardProps {
  user: User;
  onNavigateToCalculator: () => void;
  onNavigateToDeductions: () => void;
  onNavigateToReports: () => void;
  onNavigateToAi: () => void;
}

export default function TaxDashboard({
  user,
  onNavigateToCalculator,
  onNavigateToDeductions,
  onNavigateToReports,
  onNavigateToAi
}: TaxDashboardProps) {
  
  // Compute comparison
  const comparison: ComparisonResult = compareRegimes(user.income, user.deductions, user.tdsTcs);
  const { oldRegime, newRegime, saveRegime, marginSavings } = comparison;
  
  // Quick overview stats
  const activeRegimeResult = saveRegime === "old" ? oldRegime : newRegime;
  const currentTaxLiability = activeRegimeResult.totalTaxLiability;
  const finalRefundOrPayable = activeRegimeResult.finalPayableOrRefund;
  const totalStandardExemptions = activeRegimeResult.unclaimedExemptions.standardDeduction + activeRegimeResult.unclaimedExemptions.hraExemption;

  // Chart data for comparing Old vs New
  const comparisonChartData = [
    {
      name: "Gross Total",
      OldRegime: oldRegime.grossTotalIncome,
      NewRegime: newRegime.grossTotalIncome,
    },
    {
      name: "Taxable Income",
      OldRegime: oldRegime.taxableIncome,
      NewRegime: newRegime.taxableIncome,
    },
    {
      name: "Net slab Tax",
      OldRegime: oldRegime.taxAfterRebate,
      NewRegime: newRegime.taxAfterRebate,
    },
    {
      name: "Total Tax Liability",
      OldRegime: oldRegime.totalTaxLiability,
      NewRegime: newRegime.totalTaxLiability,
    },
  ];

  // Pie chart data for heads of income share
  const salaryHeadsTotal = Object.values(user.income.salary).reduce((a, b) => a + b, 0);
  const hpInterestHPExempt = user.income.houseProperty.rentalIncome || 0;
  const selfProfitBusiness = user.income.business.grossReceipts || 0;
  const capGains = Object.values(user.income.capitalGains).reduce((a, b) => a + b, 0);
  const otherInvests = Object.values(user.income.otherSources).reduce((a, b) => a + b, 0);

  const pieData = [
    { name: "Salary", value: salaryHeadsTotal ? salaryHeadsTotal : 1, color: "#2559a4" },
    { name: "Business", value: selfProfitBusiness ? selfProfitBusiness : 0, color: "#caa743" },
    { name: "House Rent", value: hpInterestHPExempt ? hpInterestHPExempt : 0, color: "#1a4482" },
    { name: "Cap Gains", value: capGains ? capGains : 0, color: "#baa992" },
    { name: "Other Interest", value: otherInvests ? otherInvests : 0, color: "#3aa2f0" }
  ].filter(p => p.value > 0);

  // Compliance alerts & advisory engine
  const computeAlerts = () => {
    const alertsList: string[] = [];
    
    // Check limit under 80C
    const sum80C = Object.values(user.deductions.sec80C).reduce((a, b) => a + b, 0);
    if (sum80C < 150000 && saveRegime === "old") {
      alertsList.push(`Your Section 80C limit of ₹1,50,000 has a vacancy of ₹${(150000 - sum80C).toLocaleString("en-IN")}. Suggest allocating in ELSS Tax-saver mutual funds or PPF to lower Old Slabs tax liability.`);
    }

    // NPS 80CCD limit
    if (user.deductions.sec80CCD1B === 0 && saveRegime === "old") {
      alertsList.push("You are missing Section 80CCD(1B) pension deduction schemes. Allocating up to ₹50,000 extra in NPS can slash tax liability by up to ₹15,600 immediately under the Old Regime.");
    }

    // 80D Health Insurance
    const healthSum = user.deductions.sec80D.selfFamilyHealth + user.deductions.sec80D.parentsHealth;
    if (healthSum === 0 && saveRegime === "old") {
      alertsList.push("No health premiums loaded under Section 80D. Secure your family health protection while slashing taxes up to ₹75,000 in deductions.");
    }

    // High Tax Pay Alert
    if (currentTaxLiability > 150000) {
      alertsList.push("Your calculated annual tax exceeds ₹1.5 Lakhs. Schedule an automated chat with Luxe AI Tax Advisor to discover missing corporate allowances or LTA exemptions.");
    }

    // Surcharge alert
    if (activeRegimeResult.taxableIncome > 5000000) {
      alertsList.push("Your total net income exceeds ₹50 Lakhs! An Indian surcharge of 10% on tax liability is applicable. Consider immediate structural asset division.");
    }

    return alertsList;
  };

  const dashboardAlerts = computeAlerts();

  // Advance tax notifications
  const advanceTaxDates = [
    { name: "Installment I (15%)", date: "June 15, 2026", status: "Upcoming" },
    { name: "Installment II (45%)", date: "September 15, 2026", status: "Upcoming" },
    { name: "Installment III (75%)", date: "December 15, 2026", status: "Upcoming" },
    { name: "Installment IV (100%)", date: "March 15, 2027", status: "Upcoming" }
  ];

  return (
    <div className="space-y-8 pb-12 bg-[#030e22] text-white">
      
      {/* Premium Dashboard banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold-300/10 pb-5">
        <div>
          <span className="text-xs text-gold-400 font-mono tracking-widest uppercase font-bold">
            Fintech Wealth Suite
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight mt-1 flex items-center gap-2">
            Welcome Back, <span className="text-gold-200">{user.displayName}</span>
            <span className="bg-gold-500/10 text-gold-400 border border-gold-500/20 text-[10px] px-2 py-0.5 rounded-full uppercase font-mono font-bold font-sans">
              {user.occupation}
            </span>
          </h1>
          <p className="text-xs text-gray-400">AY 2025-26 &bull; Tax Optimization & Compliance Monitor</p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onNavigateToReports}
            className="flex items-center space-x-1.5 bg-luxe-900 border border-gold-300/20 hover:border-gold-300/50 text-gold-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Premium Slip PDF</span>
          </button>
          
          <button 
            onClick={onNavigateToAi}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:brightness-110 text-luxe-950 font-display font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            <Sparkles className="h-4 w-4 text-luxe-950" />
            <span>Consult Luxe AI</span>
          </button>
        </div>
      </div>

      {/* 1. CORE FINANCIAL KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Gross Income */}
        <div className="bg-gradient-to-br from-luxe-900 via-luxe-950 to-[#02050f] p-5 rounded-2xl border border-gold-300/10 hover:border-gold-300/25 transition-all shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full blur-xl pointer-events-none group-hover:bg-gold-400/10 transition-all" />
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Gross Total Income</span>
            <Coins className="h-4 w-4 text-gold-400" />
          </div>
          <p className="text-2xl font-mono font-black text-white">
            ₹{activeRegimeResult.grossTotalIncome.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-2 font-sans">
            <span>Includes Salaries, HP, & Profits</span>
          </div>
        </div>

        {/* Deductions Claimed */}
        <div className="bg-gradient-to-br from-luxe-900 via-luxe-950 to-[#02050f] p-5 rounded-2xl border border-gold-300/10 hover:border-gold-300/25 transition-all shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Deductions Saved</span>
            <FileCheck className="h-4 w-4 text-gold-400" />
          </div>
          <p className="text-2xl font-mono font-black text-gold-300">
            ₹{(activeRegimeResult.totalDeductions + totalStandardExemptions).toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400 font-sans">
            <span className="text-emerald-400 font-bold">Standard Exemption (₹75k/50k) Included</span>
          </div>
        </div>

        {/* Net Slabs Tax */}
        <div className="bg-gradient-to-br from-luxe-900 via-luxe-950 to-[#02050f] p-5 rounded-2xl border border-gold-300/10 hover:border-gold-300/25 transition-all shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold-400/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">Annual Tax liability</span>
            <TrendingUp className="h-4 w-4 text-gold-400" />
          </div>
          <p className="text-2xl font-mono font-black text-white">
            ₹{currentTaxLiability.toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2 font-sans">
            <span>Includes Cess 4% & Surcharge</span>
          </div>
        </div>

        {/* Refund or Payable status */}
        <div className={`p-5 rounded-2xl border transition-all shadow-lg relative overflow-hidden group ${
          finalRefundOrPayable <= 0 
           ? "bg-gradient-to-br from-[#021c10] via-[#02050f] to-[#02050f] border-emerald-500/20 hover:border-emerald-500/40"
           : "bg-gradient-to-br from-[#1c0802] via-[#02050f] to-[#02050f] border-red-500/20 hover:border-red-500/40"
        }`}>
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-sans">
              {finalRefundOrPayable <= 0 ? "Tax Refund Due" : "Outstanding Payable"}
            </span>
            <Zap className={`h-4 w-4 ${finalRefundOrPayable <= 0 ? "text-emerald-400" : "text-amber-400"}`} />
          </div>
          <p className={`text-2xl font-mono font-black ${finalRefundOrPayable <= 0 ? "text-emerald-400" : "text-amber-400"}`}>
            ₹{Math.abs(finalRefundOrPayable).toLocaleString("en-IN")}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2 font-sans">
            <span>After TDS/TCS Credit (₹{activeRegimeResult.tdsTcsCredited.toLocaleString("en-IN")})</span>
          </div>
        </div>

      </div>

      {/* 2. CORE SYSTEM RECOMMENDATION BAR */}
      <div className="bg-[#051126] border border-gold-300/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 text-left">
          <div className="h-10 w-10 bg-gold-400/10 rounded-full border border-gold-400/35 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5 text-gold-400" />
          </div>
          <div>
            <h4 className="font-display font-black text-sm uppercase text-gold-300">
              Optimal Choice Recommendation: Selected {saveRegime.toUpperCase()} REGIME
            </h4>
            <p className="text-xs text-gray-400">
              Adopting the {saveRegime === "old" ? "Old Scheme with deep Deductions" : "revised budget New Scheme Slabs"} reduces your tax liability by 
              <strong className="text-emerald-400 font-mono font-extrabold ml-1">₹{marginSavings.toLocaleString("en-IN")}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button 
            onClick={onNavigateToCalculator}
            className="w-full md:w-auto bg-luxe-950 border border-gold-300/20 hover:border-gold-300/50 text-gold-200 text-xs font-semibold font-sans px-4 py-2.5 rounded-lg transition-all"
          >
            Change Slabs
          </button>
          
          <button 
            onClick={onNavigateToDeductions}
            className="w-full md:w-auto bg-gold-500 hover:brightness-110 text-luxe-950 text-xs font-black font-display px-4 py-2.5 rounded-lg shadow-md transition-all whitespace-nowrap"
          >
            Claim Extra Deductions
          </button>
        </div>
      </div>

      {/* 3. CHARTS COMPARISON & HEADS BREAKDOWN (Double Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Old vs New Regime Bar Chart */}
        <div className="bg-luxe-950/60 lg:col-span-8 p-5 rounded-2xl border border-gold-300/10 scroll-m-2">
          <div className="mb-4">
            <h3 className="font-display font-extrabold text-base text-white">Regime Slabs Analysis</h3>
            <p className="text-[11px] text-gray-400">Comparison of taxes and totals for AY 2025-26 Slabs</p>
          </div>

          <div className="h-80 w-full font-serif text-slate-300 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonChartData}
                margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#123366/30" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 10 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: 10 }} tickFormatter={(val) => `₹${(val / 1000).toLocaleString("en-IN")}k`} />
                <Tooltip 
                  formatter={(value: any) => [`₹${(value).toLocaleString("en-IN")}`, ""]}
                  contentStyle={{ backgroundColor: "#071530", borderColor: "#baa743", color: "#fff" }}
                />
                <Legend style={{ fontSize: 10 }} />
                <Bar dataKey="OldRegime" name="Old Regime" fill="#2559a4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="NewRegime" name="New Regime" fill="#caa743" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heads of Income Breakdown Pie */}
        <div className="bg-luxe-950/60 lg:col-span-4 p-5 rounded-2xl border border-gold-300/10">
          <div className="mb-2">
            <h3 className="font-display font-extrabold text-base text-white">Heads of Wealth Share</h3>
            <p className="text-[11px] text-gray-400">Proportion of gross total receipts</p>
          </div>

          {pieData.length > 0 ? (
            <div className="flex flex-col items-center">
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="51%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${value.toLocaleString("en-IN")}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legends list */}
              <div className="w-full text-xs space-y-1.5 px-2">
                {pieData.map((item, idx) => {
                  const percent = activeRegimeResult.grossTotalIncome > 0 
                    ? ((item.value / activeRegimeResult.grossTotalIncome) * 100).toFixed(1) 
                    : "0";
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-300">{item.name}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-gold-300">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-gray-500 text-xs text-center p-4">
              <AlertCircle className="h-8 w-8 text-gold-400/40 mb-2 animate-bounce" />
              <span>No income components detected. Head over to the Slabs input to draft your records.</span>
            </div>
          )}
        </div>

      </div>

      {/* 4. COMPLIANCE AUDITOR & ALERTS + ADVANCE TAX ALERTS (Double block) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Compliance Alerts Panel */}
        <div className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/10">
          <div className="flex items-center justify-between border-b border-gold-300/10 pb-3 mb-4">
            <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-gold-400" />
              <span>Smart Compliance & Optimization Alerts</span>
            </h3>
            <span className="bg-gold-500/10 text-gold-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
              {dashboardAlerts.length} Warnings
            </span>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {dashboardAlerts.length > 0 ? (
              dashboardAlerts.map((alert, index) => (
                <div 
                  key={index} 
                  className="bg-[#0c1424] p-3 rounded-xl border border-gold-300/10 text-xs sm:text-sm text-gray-300 leading-relaxed text-left flex items-start space-x-2.5"
                >
                  <AlertCircle className="h-4.5 w-4.5 text-gold-500 shrink-0 mt-0.5" />
                  <p>{alert}</p>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-gray-500 text-xs">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                Your profiles are 100% compliant. No slab optimization gap detected!
              </div>
            )}
          </div>
        </div>

        {/* Advance Tax / Slabs Calendar Reminder */}
        <div className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/10">
          <div className="flex items-center justify-between border-b border-gold-300/10 pb-3 mb-4">
            <h3 className="font-display font-extrabold text-base text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold-400" />
              <span>Indian Advance Tax Compliance Calendar</span>
            </h3>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
              FY 2026-27 Active
            </span>
          </div>

          <div className="space-y-3 font-sans">
            {advanceTaxDates.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-[#050f24] hover:bg-luxe-900/40 p-3 rounded-xl border border-gold-300/5 flex items-center justify-between transition-colors"
              >
                <div className="text-left font-sans">
                  <h5 className="text-xs font-bold text-white tracking-wide">{item.name}</h5>
                  <p className="text-[10px] text-gray-400">{item.date}</p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gold-300 bg-gold-400/5 py-1 px-2 rounded-md border border-gold-400/10">
                  {item.status}
                </span>
              </div>
            ))}
            <div className="text-[10.5px] text-slate-500 leading-relaxed text-center block pt-1">
              ⚠️ If tax payable (after subtracting TDS) is over <strong>₹10,000</strong> annually, you must settle Advance Tax according to these quarterly periods to avoid Sec 234B/234C interest penalties.
            </div>
          </div>
        </div>

      </div>

      {/* 5. DRAFT TABLE OF COMPARISON VALUES */}
      <div className="bg-luxe-950/60 p-5 rounded-2xl border border-gold-300/10">
        <div className="mb-4 text-left">
          <h3 className="font-display font-extrabold text-base text-white">Full Double Schema Comparison</h3>
          <p className="text-[11px] text-gray-400">Head-to-head comparison detailing deduction outcomes and cess</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[500px] divide-y divide-gold-300/10 font-sans">
            <thead>
              <tr className="text-gray-400 font-bold bg-luxe-900/40">
                <th className="py-3 px-4">Financial parameters</th>
                <th className="py-3 px-4 text-right">Old Regime Slabs</th>
                <th className="py-3 px-4 text-right">New Regime Slabs (Revised)</th>
                <th className="py-3 px-4 text-right">Selected Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-300/5 font-mono text-gray-300">
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-gray-300">Gross Total Income (GTI)</td>
                <td className="py-3 px-4 text-right">₹{oldRegime.grossTotalIncome.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right">₹{newRegime.grossTotalIncome.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-sans">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-gray-300">Standard & HRA Exemptions</td>
                <td className="py-3 px-4 text-right text-[#2559a4]">
                  ₹{(oldRegime.unclaimedExemptions.standardDeduction + oldRegime.unclaimedExemptions.hraExemption).toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-4 text-right text-gold-400">
                  ₹{newRegime.unclaimedExemptions.standardDeduction.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-4 text-right text-emerald-400 font-sans font-bold">
                  {saveRegime === "old" ? "Old Scheme" : "New Scheme"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-gray-300">Chapter VI-A Investments Claimed</td>
                <td className="py-3 px-4 text-right text-gold-400">₹{oldRegime.totalDeductions.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right text-gray-500">₹0 (Disallowed)</td>
                <td className="py-3 px-4 text-right font-sans">-</td>
              </tr>
              <tr className="bg-luxe-900/10">
                <td className="py-3 px-4 font-sans font-semibold text-white">Net Taxable Income</td>
                <td className="py-3 px-4 text-right font-bold text-gray-200">₹{oldRegime.taxableIncome.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-bold text-gray-200">₹{newRegime.taxableIncome.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-bold font-sans text-emerald-400">
                  {oldRegime.taxableIncome < newRegime.taxableIncome ? "Old" : "New"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-gray-300">Basic Calculated Slabs Tax</td>
                <td className="py-3 px-4 text-right">₹{oldRegime.slabTax.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right">₹{newRegime.slabTax.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-sans">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-gray-300">Section 87A rebate applied</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-bold">₹{oldRegime.rebate87A.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right text-emerald-400 font-bold">₹{newRegime.rebate87A.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-sans">-</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-sans font-medium text-gray-300">Health & Education Cess (4%)</td>
                <td className="py-3 px-4 text-right">₹{oldRegime.cess.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right">₹{newRegime.cess.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-sans">-</td>
              </tr>
              <tr className="bg-amber-400/5">
                <td className="py-3 px-4 font-sans font-bold text-gold-300">Total Slabs Tax Liability</td>
                <td className="py-3 px-4 text-right font-bold text-gray-200">₹{oldRegime.totalTaxLiability.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-bold text-gray-200">₹{newRegime.totalTaxLiability.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right font-black font-sans text-emerald-400">
                  Save ₹{marginSavings.toLocaleString("en-IN")} {saveRegime === "old" ? "(Old)" : "(New)"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
