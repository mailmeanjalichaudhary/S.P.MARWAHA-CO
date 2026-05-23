import React, { useState } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  Receipt, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  FileSpreadsheet, 
  TrendingUp, 
  Layers, 
  Clock, 
  HelpCircle, 
  FileText,
  Star,
  Users
} from "lucide-react";

interface LandingPageProps {
  onJoinSuite: () => void;
  onQuickCalculatorJump: () => void;
}

export default function LandingPage({ onJoinSuite, onQuickCalculatorJump }: LandingPageProps) {
  // Quick Calculator State inside Hero Section
  const [quickIncome, setQuickIncome] = useState<number>(1200000);
  const [quickInvestments, setQuickInvestments] = useState<number>(150000);

  // Simplified Quick computation to engage users on first render
  const computeQuickTax = () => {
    // Standard deduction
    const oldIncome = Math.max(0, quickIncome - 50000 - Math.min(150000, quickInvestments));
    const newIncome = Math.max(0, quickIncome - 75000);

    // Old tax computation
    let oldTax = 0;
    if (oldIncome > 1000000) {
      oldTax += (oldIncome - 1000000) * 0.30 + 112500;
    } else if (oldIncome > 500000) {
      oldTax += (oldIncome - 500000) * 0.20 + 12500;
    } else if (oldIncome > 250000) {
      oldTax += (oldIncome - 250000) * 0.05;
    }
    if (oldIncome <= 500000) oldTax = 0; // 87A rebate
    const oldTotal = Math.round(oldTax * 1.04);

    // New tax computation
    let newTax = 0;
    if (newIncome > 1500000) {
      newTax += (newIncome - 1500000) * 0.30 + 140000;
    } else if (newIncome > 1200000) {
      newTax += (newIncome - 1200000) * 0.20 + 80000;
    } else if (newIncome > 1000000) {
      newTax += (newIncome - 1000000) * 0.15 + 50000;
    } else if (newIncome > 700000) {
      newTax += (newIncome - 700000) * 0.10 + 20000;
    } else if (newIncome > 300000) {
      newTax += (newIncome - 300000) * 0.05;
    }
    if (newIncome <= 700000) newTax = 0; // 87A rebate new regime
    const newTotal = Math.round(newTax * 1.04);

    const diff = Math.abs(oldTotal - newTotal);
    const recommended = oldTotal < newTotal ? "Old Regime" : "New Regime";
    const recommendedTax = Math.min(oldTotal, newTotal);

    return { oldTotal, newTotal, diff, recommended, recommendedTax };
  };

  const { oldTotal, newTotal, diff, recommended, recommendedTax } = computeQuickTax();

  // FAQs Accordion states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Can I claim both HRA and home loan interest together?",
      a: "Absolutely! If you reside in a rented property in one city (e.g., due to job placement or office requirements) and own a self-occupied or leased home in another city (secured with a home loan), you can legally claim both HRA exemptions under Section 10(13A) and home loan interest deductions under Section 24(b)."
    },
    {
      q: "Which regime is usually better: Old or New?",
      a: "As a general rule, the New Tax Regime is superior for individuals who don't have major investments or rent exemptions, as the slab tax rates are significantly lower, and the standard deduction is increased to ₹75,000. However, if your eligible deductions (80C, 80D, HRA, Section 24b) exceed ₹3.75 Lakhs, the Old Regime usually yields a lower tax liability."
    },
    {
      q: "How does the Section 87A Rebate work in the New Regime?",
      a: "Under the New Tax Regime, if your Net Taxable Income (after standard deduction) does not exceed ₹7,00,000, you are entitled to a rebate under Section 87A. This covers 100% of your computed tax liability, resulting in a ₹0 net taxable liability."
    },
    {
      q: "Are TDS and TCS deductions calculated directly to reduce my final tax liability?",
      a: "Yes. TDS (Tax Deducted at Source) and TCS (Tax Collected at Source) are already paid on your behalf to the government. This platform subtracts them directly from your computed gross slab tax. Any excess payment is automatically computed as a State Refund of tax due back to you!"
    },
    {
      q: "Does the AI assistant provide personalized tax consulting?",
      a: "Yes. The premium Gemini AI engine acts as a trained concierge, translating dense Indian income tax rules into highly readable, visual guidelines, explaining limitations, and advising on investment strategies dynamically synced to your income variables!"
    }
  ];

  return (
    <div className="bg-[#030e22] text-white min-h-screen font-sans">
      
      {/* 1. HERO SECTION (Dynamic Luxury Visualization) */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gold-300/10 overflow-hidden">
        {/* Abstract luxury grids & background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-luxe-800/40 via-luxe-950 to-luxe-950" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-[160px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Pitch */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gold-500/10 to-gold-400/20 border border-gold-400/30 px-3.5 py-1.5 rounded-full text-gold-300 text-xs font-semibold tracking-wider uppercase animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              <span>Smarter Slabs for FY 2024-25 & FY 2025-26</span>
            </div>
            
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight text-white">
              Sovereign Tax Planning. <br />
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                Meticulously Calculated.
              </span>
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Demystify Indian income tax laws using our beautiful premium simulation dashboard. Explore high-accuracy deductions optimization, compare Old vs New tax regimes in real-time under revised laws, and consult our Gemini-tuned AI tax guide instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={onJoinSuite}
                className="flex items-center justify-center space-x-2.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 active:brightness-95 text-luxe-950 font-display font-black text-sm py-4 px-8 rounded-xl shadow-xl shadow-gold-500/20 cursor-pointer border border-gold-300/20 group transition-all"
              >
                <span>Enterprise Portal Access</span>
                <ArrowRight className="h-4 w-4 text-luxe-950 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onQuickCalculatorJump}
                className="flex items-center justify-center space-x-2.5 bg-luxe-900/60 hover:bg-luxe-800/80 text-white border border-gold-300/25 font-display font-bold text-sm py-4 px-8 rounded-xl transition-all"
              >
                <Calculator className="h-4.5 w-4.5 text-gold-400" />
                <span>Optimize Slabs Now</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gold-300/10 max-w-md">
              <div>
                <p className="font-display text-2xl font-black text-gold-300">₹0 Tax</p>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider font-semibold">Under 7L Slabs</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-gold-300">100%</p>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider font-semibold">Offline Privacy</p>
              </div>
              <div>
                <p className="font-display text-2xl font-black text-gold-400">Gemini</p>
                <p className="text-[10px] uppercase text-gray-400 tracking-wider font-semibold">AI Tax Advisor</p>
              </div>
            </div>
          </div>

          {/* Interactive Fast Calculator Card Widget */}
          <div className="lg:col-span-5 bg-gradient-to-b from-luxe-900 via-luxe-950 to-[#020712] p-5 sm:p-6 rounded-3xl border border-gold-300/30 shadow-2xl relative">
            <div className="absolute top-3 right-3 bg-gold-400/10 border border-gold-400/25 text-[9px] uppercase tracking-wider font-mono text-gold-300 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping" />
              <span>Simulated Engine</span>
            </div>

            <div className="mb-4">
              <h3 className="font-display font-extrabold text-white text-base">Quick Regime Estimator</h3>
              <p className="text-[10px] text-gray-400">Draft simple comparisons inside the hero panel</p>
            </div>

            <div className="space-y-4 font-sans">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300">Annual Gross Income (INR)</span>
                  <span className="text-gold-300 text-sm font-mono font-bold">₹{quickIncome.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={400000}
                  max={2500000}
                  step={50000}
                  value={quickIncome}
                  onChange={(e) => setQuickIncome(Number(e.target.value))}
                  className="w-full accent-gold-400 cursor-pointer h-1.5 bg-luxe-800 rounded-lg overflow-hidden appearance-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300">Chapter VI-A Deductions</span>
                  <span className="text-gold-300 text-sm font-mono font-bold">₹{quickInvestments.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300000}
                  step={10000}
                  value={quickInvestments}
                  onChange={(e) => setQuickInvestments(Number(e.target.value))}
                  className="w-full accent-gold-400 cursor-pointer h-1.5 bg-luxe-800 rounded-lg overflow-hidden appearance-none"
                />
                <p className="text-[9px] text-gray-500">Includes PPF, ELSS, 80D, etc. (relevant for Old Regime only)</p>
              </div>

              {/* Dynamic Output Comparison */}
              <div className="bg-[#02050e] p-4 rounded-2xl border border-gold-300/15 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center border-b border-gold-300/10 pb-2">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Old Slabs Tax</span>
                    <p className="text-xs font-mono font-bold text-gray-200 mt-0.5">₹{oldTotal.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="border-l border-gold-300/10">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">New Slabs Tax</span>
                    <p className="text-xs font-mono font-bold text-gray-200 mt-0.5">₹{newTotal.toLocaleString("en-IN")}</p>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-gray-400">Tax Optimization recommendation:</span>
                  <div className="flex items-center justify-center space-x-1.5 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-gold-400" />
                    <span className="font-display font-black text-sm text-gold-300 uppercase">
                      Select {recommended}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-emerald-400 mt-0.5">
                    Saves you <strong className="font-mono font-extrabold font-lg text-emerald-300">₹{diff.toLocaleString("en-IN")}</strong> in tax liability!
                  </p>
                </div>
              </div>

              {/* Legal Note inside Widget */}
              <div className="text-center pt-1 text-[9px] text-slate-500">
                Calculations based on FY 2024-25 Budget rates & standard cess.
              </div>

            </div>
          </div>
          
        </div>
      </section>

      {/* 2. CORE FEATURES (FINTECH-SaaS Bento Grid Layout) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-luxe-950 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              An Elevated Tax Command Suite
            </h2>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              Meticulously engineered from the ground up to automate complex compliance guidelines and reveal elite tax-saving opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-gradient-to-b from-luxe-900 to-[#051126] p-6 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300 text-left group">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center border border-gold-400/20 mb-5 group-hover:scale-105 transition-transform">
                <Calculator className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Dual Regime Slab Engine</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Calculate precise taxes under Old Laws and the revised budget New Regime (including the augmented standard deduction and newly staggered percentage brackets).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-b from-luxe-900 to-[#051126] p-6 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300 text-left group">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center border border-gold-400/20 mb-5 group-hover:scale-105 transition-transform">
                <Layers className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Maximum limit validation</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Input section 80C, 80D, 80CCD, or home loans. Our compliance layer automatically validates limits, computes HRA rules, and highlights under-utilized thresholds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-b from-luxe-900 to-[#051126] p-6 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300 text-left group">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center border border-gold-400/20 mb-5 group-hover:scale-105 transition-transform">
                <Sparkles className="h-6 w-6 text-gold-400 animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Gemini AI Tax Advisory</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Consult a private virtual CA. Ask about complex rules, claiming concurrent exemptions, capital gains thresholds, and optimal corporate tax-saving loops.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-b from-luxe-900 to-[#051126] p-6 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300 text-left group">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center border border-gold-400/20 mb-5 group-hover:scale-105 transition-transform">
                <Receipt className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">TDS/TCS Credit Matrix</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Track withholding tax entries under relevant sections (e.g. 192, 194J) to compute final tax payments or high-precision state refund estimates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-b from-luxe-900 to-[#051126] p-6 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300 text-left group">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center border border-gold-400/20 mb-5 group-hover:scale-105 transition-transform">
                <FileText className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">Downloadable Reports</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Generate sleek PDF tax plans, dynamic print layouts, or comprehensive text sheets of your calculated heads of income and optimization parameters.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-b from-luxe-900 to-[#051126] p-6 rounded-2xl border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300 text-left group">
              <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center justify-center border border-gold-400/20 mb-5 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">ISO Secure Sandbox</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                We respect financial secrecy. Your sensitive salary figures, deductions inputs, and business accounts are securely validated with high privacy compliance standards.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. REVIEWS & TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gold-300/10 bg-[#030c1d]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Sovereign Praise.
            </h2>
            <p className="text-xs uppercase tracking-widest text-gold-400 font-bold">
              Trusted by Senior Executives and Business Owners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-luxe-900/60 p-6 rounded-2xl border border-gold-300/5 text-left relative">
              <div className="flex text-gold-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-gold-400" />)}
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                "Finance Luxe was crucial for comparing my tech RSUs and HRA claims. The calculator is incredibly precise, and the standard deduction tweaks were up to date."
              </p>
              <div>
                <h4 className="text-sm font-bold text-white">Deepak Sharma</h4>
                <p className="text-[10px] text-gold-400 font-mono">VP Operations, NeoFintech India</p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-luxe-900/60 p-6 rounded-2xl border border-gold-300/5 text-left relative">
              <div className="flex text-gold-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-gold-400" />)}
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                "As a lawyer filing under Section 44ADA presumptive limits, identifying compliant deductions used to take hours. The UI is exceptionally clean and the AI assistant answers complex queries reliably."
              </p>
              <div>
                <h4 className="text-sm font-bold text-white">Meera Nair</h4>
                <p className="text-[10px] text-gold-400 font-mono">Senior Legal Counsel</p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-luxe-900/60 p-6 rounded-2xl border border-gold-300/5 text-left relative">
              <div className="flex text-gold-400 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-gold-400" />)}
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                "The AI advisor is like having an elite CA in your pocket. Explaining HRA concurrent claiming in standard Indian English gave me absolute clarity."
              </p>
              <div>
                <h4 className="text-sm font-bold text-white">Aniket Roy</h4>
                <p className="text-[10px] text-gold-400 font-mono">Freelance Digital Consultant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REVISED TAX SLABS INFOGRAPHIC TABULAR GUIDE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gold-300/10 bg-luxe-950">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Slab Structure Sells
            </h2>
            <p className="text-xs text-gold-400 font-mono tracking-widest uppercase font-bold">
              Applicable for Assessment Year 2025-26 & 2026-27 (Latest Revised Laws)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* New Regime Table */}
            <div className="bg-[#040e22] rounded-2xl border border-gold-300/20 overflow-hidden">
              <div className="bg-gradient-to-r from-gold-500/15 to-gold-600/15 text-gold-300 p-4 font-display font-bold text-sm border-b border-gold-300/20 text-center">
                📊 New Regime (Sec 115BAC) — Recommended
              </div>
              <div className="p-4">
                <table className="w-full text-xs text-left font-sans">
                  <thead>
                    <tr className="border-b border-gold-300/10 text-gray-400">
                      <th className="py-2">Income Slab (INR)</th>
                      <th className="py-2 text-right">Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-300/5 text-gray-300 font-mono">
                    <tr>
                      <td className="py-2.5">Up to ₹3,00,000</td>
                      <td className="py-2.5 text-right font-bold text-emerald-400">NIL</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">₹3,00,001 to ₹7,00,000</td>
                      <td className="py-2.5 text-right font-bold">5%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">₹7,00,001 to ₹10,00,000</td>
                      <td className="py-2.5 text-right font-bold">10%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">₹10,00,001 to ₹12,00,000</td>
                      <td className="py-2.5 text-right font-bold">15%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">₹12,00,001 to ₹15,00,000</td>
                      <td className="py-2.5 text-right font-bold">20%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Above ₹15,00,000</td>
                      <td className="py-2.5 text-right font-bold text-gold-300">30%</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 bg-gold-400/5 text-gray-400 p-3 rounded-lg border border-gold-400/10 text-[10.5px] leading-relaxed">
                  💡 <strong>Benefits:</strong> Higher standard deduction (₹75,000). Zero tax liability under Section 87A rebate for net taxable income up to <strong>₹7,00,000</strong>.
                </div>
              </div>
            </div>

            {/* Old Regime Table */}
            <div className="bg-[#040e22] rounded-2xl border border-gold-300/20 overflow-hidden">
              <div className="bg-luxe-900 text-gray-300 p-4 font-display font-semibold text-sm border-b border-gold-300/20 text-center">
                📋 Old Tax Regime (With Deductions)
              </div>
              <div className="p-4">
                <table className="w-full text-xs text-left font-sans">
                  <thead>
                    <tr className="border-b border-gold-300/10 text-gray-400">
                      <th className="py-2">Income Slab (INR)</th>
                      <th className="py-2 text-right">Tax Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-300/5 text-gray-300 font-mono">
                    <tr>
                      <td className="py-2.5">Up to ₹2,50,000</td>
                      <td className="py-2.5 text-right font-bold text-emerald-400">NIL</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">₹2,50,001 to ₹5,00,000</td>
                      <td className="py-2.5 text-right font-bold">5%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">₹5,00,001 to ₹10,00,000</td>
                      <td className="py-2.5 text-right font-bold">20%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5">Above ₹10,00,000</td>
                      <td className="py-2.5 text-right font-bold text-gold-300">30%</td>
                    </tr>
                  </tbody>
                </table>
                <div className="mt-4 bg-luxe-950 text-gray-400 p-3 rounded-lg border border-white/5 text-[10.5px] leading-relaxed">
                  💡 <strong>Benefits:</strong> Supports standard deduction (₹50,000). Claim 80C, 80D, HRA, Section 24b. Zero tax under rebate up to <strong>₹5,00,000</strong>.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. COLLAPSIBLE FAQs SECTION (Interactive Accordion) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-gold-300/10 bg-[#030c1d]">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Demystified Solutions
            </h2>
            <p className="text-xs uppercase text-gold-400 tracking-widest font-mono font-bold">
              Frequently Asked Compliance Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-luxe-900/40 rounded-xl border border-gold-300/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left py-4 px-5 flex items-center justify-between text-white font-display font-bold text-sm sm:text-base hover:text-gold-300 focus:outline-none transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-gold-400 font-bold text-lg select-none ml-2">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed font-sans border-t border-gold-300/5 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (CTA) SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-luxe-950 via-luxe-900 to-luxe-950 relative overflow-hidden border-t border-gold-300/10">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-gold-500/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Secure Your Sovereign Compliance Portal
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
            Authenticate to access dynamic, multi-profile reports, save custom tax-saving investments, write with the premium Gemini AI interface, and secure your financial peace.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={onJoinSuite}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 active:brightness-95 text-luxe-950 font-display font-extrabold text-sm rounded-xl shadow-xl shadow-gold-500/20 cursor-pointer border border-gold-300/20 transition-all"
            >
              Sign Up For Luxe Suite
            </button>
            <button
              onClick={onQuickCalculatorJump}
              className="px-8 py-4 bg-luxe-900/60 hover:bg-luxe-850 text-white border border-gold-300/20 rounded-xl font-display font-bold text-sm transition-all"
            >
              Examine Slabs Immediately
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-slate-500 text-xs pt-8">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Free Demonstration</span>
            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-gold-400" /> Executive Class Service</span>
          </div>
        </div>
      </section>

    </div>
  );
}
