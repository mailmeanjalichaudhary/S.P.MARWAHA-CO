import React, { useState } from "react";
import { 
  DollarSign, 
  Briefcase, 
  Home, 
  Bitcoin, 
  HelpCircle, 
  Info, 
  Coins, 
  CheckCircle2, 
  ChevronRight, 
  TrendingUp, 
  CircleAlert, 
  Receipt 
} from "lucide-react";
import { User, IncomeInput as IncomeInputFields } from "../types";

interface IncomeInputProps {
  user: User;
  onUpdateIncome: (income: IncomeInputFields) => void;
  onJumpToDeductions: () => void;
}

type ActiveTabs = "salary" | "business" | "house" | "capital" | "others";

export default function IncomeInput({ user, onUpdateIncome, onJumpToDeductions }: IncomeInputProps) {
  const [activeTab, setActiveTab] = useState<ActiveTabs>("salary");

  const localIncome = { ...user.income };

  const salaryHeadsTotal = Object.values(localIncome.salary).reduce((a, b) => a + b, 0);
  const hpInterestHPExempt = localIncome.houseProperty.rentalIncome || 0;
  const selfProfitBusiness = localIncome.business.grossReceipts || 0;
  const capGains = Object.values(localIncome.capitalGains).reduce((a, b) => a + b, 0);
  const otherInvests = Object.values(localIncome.otherSources).reduce((a, b) => a + b, 0);

  const handleFieldChange = (
    category: keyof IncomeInputFields,
    field: string,
    value: number | boolean | string
  ) => {
    const updatedCategory = { ...localIncome[category] } as any;
    updatedCategory[field] = value;
    
    // Auto presumptive toggles if business is presumptive
    if (category === "business" && field === "optForPresumptive" && value === true) {
      if (updatedCategory.presumptiveType === "none") {
        updatedCategory.presumptiveType = "44ADA"; // Default to professional presumptive
      }
    } else if (category === "business" && field === "optForPresumptive" && value === false) {
      updatedCategory.presumptiveType = "none";
    }

    const newIncome: IncomeInputFields = {
      ...localIncome,
      [category]: updatedCategory,
    };
    onUpdateIncome(newIncome);
  };

  const tabs = [
    { id: "salary", label: "Salary Slabs", icon: Briefcase },
    { id: "business", label: "Business Profits", icon: Coins },
    { id: "house", label: "House Property", icon: Home },
    { id: "capital", label: "Capital Gains", icon: TrendingUp },
    { id: "others", label: "Other Sources", icon: Receipt },
  ];

  return (
    <div className="space-y-6 pb-10 bg-[#030e22] text-white">
      
      {/* Header */}
      <div className="text-left border-b border-gold-300/10 pb-4">
        <span className="text-xs text-gold-400 font-mono tracking-widest uppercase font-bold">
          Step I of Tax planning
        </span>
        <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight mt-1">
          Draft Five Heads of Sourced Income
        </h1>
        <p className="text-xs text-gray-400">
          State your global annual incomes. Under Indian Income Tax, wealth is classified into these five modular sections.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gold-300/10 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTabs)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wide transition-all border shrink-0 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-gold-500/15 via-gold-500/10 to-gold-600/15 text-gold-300 border-gold-400/50 shadow-md"
                  : "bg-luxe-950/40 text-gray-400 border-gold-300/5 hover:border-gold-300/20 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-gold-400" : "text-gray-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TABS VIEW CONTROLLER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Form Side */}
        <div className="lg:col-span-8 bg-luxe-950/60 p-5 sm:p-6 rounded-2xl border border-gold-300/10 space-y-6 text-left">
          
          {/* TAB 1: SALARY */}
          {activeTab === "salary" && (
            <div className="space-y-4 font-sans animate-fade-in">
              <div className="mb-4">
                <h4 className="font-display font-bold text-base text-gold-300 flex items-center gap-1.5">
                  💼 Annual Salary Allowances Breakdown
                </h4>
                <p className="text-xs text-gray-400">State your annualized salary items as outlined on Form 16 Part B.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Basic Income</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Fully taxable base salary. Typically forms 40-50% of your total pay." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.salary.basic || ""}
                    onChange={(e) => handleFieldChange("salary", "basic", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">HRA (House Rent Allowance)</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Allowance received for rental quarters. Exempt based on rent receipts in Old regime." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.salary.hra || ""}
                    onChange={(e) => handleFieldChange("salary", "hra", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Dearness Allowance (DA)</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Cost of living adjustment payment. Adds to Basic for standard HRA calculations." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.salary.da || ""}
                    onChange={(e) => handleFieldChange("salary", "da", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">LTA (Leave Travel Allowance)</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Exempt up to twice in a block of four calendar years for domestic journeys." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.salary.lta || ""}
                    onChange={(e) => handleFieldChange("salary", "lta", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Special Allowance</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Fully taxable cash allowances paid for specific tasks and perks." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.salary.specialAllowance || ""}
                    onChange={(e) => handleFieldChange("salary", "specialAllowance", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Other taxable perks</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Monetary equivalent of perks like cars, driver, club memberships." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.salary.otherPerks || ""}
                    onChange={(e) => handleFieldChange("salary", "otherPerks", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: BUSINESS/PROFESSION */}
          {activeTab === "business" && (
            <div className="space-y-5 font-sans animate-fade-in">
              <div className="mb-4">
                <h4 className="font-display font-bold text-base text-gold-300 flex items-center gap-1.5">
                  🪙 Profits and Gains of Business or Profession (PGBP)
                </h4>
                <p className="text-xs text-gray-400">Declare freelancer receipts, legal or medical fees, or business retail profits.</p>
              </div>

              <div className="p-4 bg-luxe-900/60 rounded-xl border border-gold-300/15 space-y-3">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="presumptive-toggle"
                    checked={localIncome.business.optForPresumptive}
                    onChange={(e) => handleFieldChange("business", "optForPresumptive", e.target.checked)}
                    className="h-4 w-4 bg-[#02050e] border-gold-300/25 text-gold-500 rounded focus:ring-gold-400 mt-1 cursor-pointer"
                  />
                  <div className="text-left font-sans">
                    <label htmlFor="presumptive-toggle" className="text-xs font-bold text-gold-200 cursor-pointer">
                      Opt for Presumptive Taxation Scheme (Sec 44AD / 44ADA)
                    </label>
                    <p className="text-[10.5px] text-gray-400 mt-0.5 leading-relaxed">
                      Saves paper maintenance! Declare flat profits at 50% of receipts for specified professionals (44ADA), or 6% to 8% for micro businesses (44AD) without declaring ledger expense charts.
                    </p>
                  </div>
                </div>

                {localIncome.business.optForPresumptive && (
                  <div className="space-y-1.5 pt-2 animate-fade-in text-left">
                    <label className="text-[10px] uppercase tracking-wider text-gold-300 font-bold">Presumptive Categories</label>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="radio"
                          name="presumptivetype"
                          value="44ADA"
                          checked={localIncome.business.presumptiveType === "44ADA"}
                          onChange={() => handleFieldChange("business", "presumptiveType", "44ADA")}
                          className="accent-gold-400"
                        />
                        <span>Sec 44ADA Professional (Freelancers, Developers, CAs, Doctors, Designers - 50% profit)</span>
                      </label>
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="radio"
                          name="presumptivetype"
                          value="44AD"
                          checked={localIncome.business.presumptiveType === "44AD"}
                          onChange={() => handleFieldChange("business", "presumptiveType", "44AD")}
                          className="accent-gold-400"
                        />
                        <span>Sec 44AD Retail Business (Micro Traders - 6% profit)</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Gross Annual Receipts & turnover</label>
                  <input
                    type="number"
                    value={localIncome.business.grossReceipts || ""}
                    onChange={(e) => handleFieldChange("business", "grossReceipts", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                {!localIncome.business.optForPresumptive && (
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Allowed Business Expenses</label>
                    <input
                      type="number"
                      value={localIncome.business.expenses || ""}
                      onChange={(e) => handleFieldChange("business", "expenses", Number(e.target.value))}
                      placeholder="INR"
                      className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HOUSE PROPERTY */}
          {activeTab === "house" && (
            <div className="space-y-4 font-sans animate-fade-in">
              <div className="mb-4">
                <h4 className="font-display font-bold text-base text-gold-300 flex items-center gap-1.5">
                  🏠 Income or Loss from House Property (HP)
                </h4>
                <p className="text-xs text-gray-400">Claims for rented property NAV standard deductions or self-occupied interest limits.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Property Type</label>
                  <select
                    value={localIncome.houseProperty.propertyType}
                    onChange={(e) => handleFieldChange("houseProperty", "propertyType", e.target.value)}
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 text-sans text-sm outline-none font-medium text-white transition-all"
                  >
                    <option value="self_occupied">Self Occupied (No rent income, capped loan interest)</option>
                    <option value="let_out">Let Out Property (Leased on monthly rent)</option>
                  </select>
                </div>

                {localIncome.houseProperty.propertyType === "let_out" && (
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Gross Rent Received Annually</label>
                    <input
                      type="number"
                      value={localIncome.houseProperty.rentalIncome || ""}
                      onChange={(e) => handleFieldChange("houseProperty", "rentalIncome", Number(e.target.value))}
                      placeholder="INR"
                      className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                    />
                  </div>
                )}

                {localIncome.houseProperty.propertyType === "let_out" && (
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Municipal taxes Paid to Local Corp</label>
                    <input
                      type="number"
                      value={localIncome.houseProperty.municipalTaxes || ""}
                      onChange={(e) => handleFieldChange("houseProperty", "municipalTaxes", Number(e.target.value))}
                      placeholder="INR"
                      className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Home Loan Interest Paid (Sec 24b)</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Deductible up to ₹2,00,000 for self-occupied homes under the Old Regime. No upper limit for Let Out properties!" />
                  </div>
                  <input
                    type="number"
                    value={localIncome.houseProperty.homeLoanInterest || ""}
                    onChange={(e) => handleFieldChange("houseProperty", "homeLoanInterest", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAPITAL GAINS */}
          {activeTab === "capital" && (
            <div className="space-y-4 font-sans animate-fade-in">
              <div className="mb-4">
                <h4 className="font-display font-bold text-base text-gold-300 flex items-center gap-1.5">
                  📈 Capital Gains Profits
                </h4>
                <p className="text-xs text-gray-400">Declare asset sales including stocks indexation, equity trading, or property sales.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">STCG Equity (Sec 111A — 20%)</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Short term gains on listed equity shares and mutual funds under Section 111A. Rate is now 20% post budget 2024 edits." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.capitalGains.stcgShortTerm || ""}
                    onChange={(e) => handleFieldChange("capitalGains", "stcgShortTerm", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">LTCG Equity (Sec 112A — 12.5%)</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Long term gains on listed shares. Limit of ₹1.25 Lakhs is exempt from tax post budget 2024. Rest taxed at 12.5%." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.capitalGains.ltcgLongTerm || ""}
                    onChange={(e) => handleFieldChange("capitalGains", "ltcgLongTerm", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">STCG Debt / Cash Slabs (Regular rate)</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Gains on debt mutual funds or cash assets. Added to slab incomes in calculations." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.capitalGains.stcgDebt || ""}
                    onChange={(e) => handleFieldChange("capitalGains", "stcgDebt", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">LTCG Property / Gold (Sec 112 — 12.5% / 20%)</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Long-term gains on properties/gold assets. Rate is 12.5% without indexation or 20% with historical indexation." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.capitalGains.ltcgProperty || ""}
                    onChange={(e) => handleFieldChange("capitalGains", "ltcgProperty", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OTHER SOURCES */}
          {activeTab === "others" && (
            <div className="space-y-4 font-sans animate-fade-in">
              <div className="mb-4">
                <h4 className="font-display font-bold text-base text-gold-300 flex items-center gap-1.5">
                  📋 Income from Other Sources (IFOS)
                </h4>
                <p className="text-xs text-gray-400">Track passive savings interests, FD plans, and stock dividend payouts.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Savings Bank Interest</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Under Sec 80TTA, interest up to ₹10,000 on savings interest is deductible in Old Regime." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.otherSources.savingsBankInterest || ""}
                    onChange={(e) => handleFieldChange("otherSources", "savingsBankInterest", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">fixed Deposit (FD) Interest</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="FD interest is fully taxable under slab rates. Seniors can claim up to ₹50,000 under Section 80TTB." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.otherSources.fdInterest || ""}
                    onChange={(e) => handleFieldChange("otherSources", "fdInterest", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Dividend Income</label>
                    <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" title="Dividends paid on listed stocks. Fully taxable at your regular slab rates." />
                  </div>
                  <input
                    type="number"
                    value={localIncome.otherSources.dividendIncome || ""}
                    onChange={(e) => handleFieldChange("otherSources", "dividendIncome", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase tracking-wider text-gray-400 font-bold">Other Miscellaneous Income</label>
                  <input
                    type="number"
                    value={localIncome.otherSources.otherMisc || ""}
                    onChange={(e) => handleFieldChange("otherSources", "otherMisc", Number(e.target.value))}
                    placeholder="INR"
                    className="w-full bg-[#02050e] border border-gold-300/15 focus:border-gold-400 rounded-xl px-4 py-2.5 font-mono text-sm outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between pt-6 border-t border-gold-300/10">
            <span className="text-[10px] text-gray-500 font-sans italic self-center">
              * Sensitive values are securely validated local draft states only.
            </span>
            <button
              onClick={onJumpToDeductions}
              className="flex items-center space-x-1 border border-gold-300/30 bg-gold-500/10 hover:bg-gold-500/20 text-gold-300 font-display font-bold text-xs sm:text-sm py-2 px-5 rounded-xl cursor-pointer transition-all"
            >
              <span>Deductions Planner</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>

        {/* Right Advice / Informational Helper Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick breakdown panel */}
          <div className="bg-gradient-to-b from-luxe-900 to-luxe-950 p-5 rounded-2xl border border-gold-300/15 text-left">
            <h4 className="font-display font-bold text-sm tracking-wide text-white uppercase text-gold-400 mb-3">
              Draft Summary Meter
            </h4>

            <div className="space-y-2.5 text-xs text-gray-300 font-sans">
              <div className="flex justify-between">
                <span>Salary Incomes:</span>
                <span className="font-mono font-semibold">₹{salaryHeadsTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Business Profit:</span>
                <span className="font-mono font-semibold">₹{selfProfitBusiness.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>HP Rental:</span>
                <span className="font-mono font-semibold">₹{hpInterestHPExempt.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Capital Gains:</span>
                <span className="font-mono font-semibold">₹{capGains.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Passive Interests:</span>
                <span className="font-mono font-semibold">₹{otherInvests.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-gold-300/10 pt-2 flex justify-between text-white font-bold">
                <span>Gross Income draft:</span>
                <span className="font-mono text-gold-300">
                  ₹{(salaryHeadsTotal + selfProfitBusiness + hpInterestHPExempt + capGains + otherInvests).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Compliance Info Card */}
          <div className="bg-luxe-950/40 p-5 rounded-2xl border border-gold-300/10 text-left space-y-3">
            <div className="flex items-center space-x-2 text-gold-400">
              <CircleAlert className="h-5 w-5" />
              <h4 className="font-display font-extrabold text-sm tracking-wider uppercase">Slabs Fact sheets</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Under Section 44ADA (Freelancers), you are exempt from maintaining heavy ledgers if gross receipts are below ₹75 Lakhs and you declare cash/online net profit margin as at least 50%.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed font-sans pt-1">
              For House Properties, standard deduction under <strong>Section 24(a)</strong> is a flat 30% reduction of rental income to absorb maintenance, paint, and plumber invoices.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
