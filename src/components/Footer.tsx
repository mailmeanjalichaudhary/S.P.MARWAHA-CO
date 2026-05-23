import React from "react";
import { ShieldCheck, HelpCircle, FileText, ChevronRight, Scale, Info } from "lucide-react";

interface FooterProps {
  onLearnMore?: () => void;
  onOpenPrivacy?: () => void;
}

export default function Footer({ onLearnMore, onOpenPrivacy }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-luxe-950 border-t border-gold-300/10 text-gray-400 py-12 relative overflow-hidden">
      {/* Light glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-luxe-500/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-display text-white text-lg font-bold tracking-wider">
                FINANCE <span className="text-gold-400">LUXE</span>
              </span>
              <span className="bg-gold-500/15 text-gold-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-gold-400/20">
                PRO
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              An elite, high-fidelity wealth protection & tax computing suite meticulously engineered for Indian salaried executives, high net-worth professionals, and business leaders.
            </p>
            <div className="flex items-center space-x-2 text-xs text-gold-300/75 bg-luxe-900/60 py-2 px-3 rounded-lg border border-gold-500/10 max-w-sm">
              <ShieldCheck className="h-4 w-4 text-gold-400 shrink-0" />
              <span>Full compliance, offline privacy protection, & high-precision slab engines.</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest font-display text-gold-400">
              Tax Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://www.incometax.gov.in" target="_blank" rel="noreferrer" className="hover:text-gold-300 flex items-center space-x-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-gold-400/50" />
                  <span>IT Portal (incometax.gov.in)</span>
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-gold-300 flex items-center space-x-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-gold-400/50" />
                  <span>Interactive Slabs (FY 2024-25)</span>
                </a>
              </li>
              <li>
                <a href="#deductions" className="hover:text-gold-300 flex items-center space-x-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-gold-400/50" />
                  <span>Section 80C, 80D Tax Guides</span>
                </a>
              </li>
              <li>
                <a href="#ai-assistant" className="hover:text-gold-300 flex items-center space-x-1.5 transition-colors">
                  <ChevronRight className="h-3 w-3 text-gold-400/50" />
                  <span>AI Tax Assistant Chat Offline</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Slabs Info Column */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-widest font-display text-gold-400">
              Future Ready Blueprint
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Our enterprise structure supports immediate modular scales for GST filing, Form 16 document parsing, AIS/TIS direct uploads, and premium Chartered Accountant (CA) visual dashboards.
            </p>
          </div>
        </div>

        {/* Legal Disclaimer Row (CRITICAL REQUIREMENT #13) */}
        <div className="bg-luxe-900/40 p-4 sm:p-5 rounded-xl border border-gold-400/10 mb-8 max-w-7xl mx-auto">
          <div className="flex items-start space-x-3 text-xs text-gray-400 leading-relaxed">
            <Scale className="h-5 w-5 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white tracking-wide uppercase text-[10px] bg-gold-400/10 text-gold-400 px-1.5 py-0.5 rounded mr-1.5">
                LEGAL DISCLAIMER
              </span>
              This platform is for educational and tax assistance purposes only. Calculations are subject to interpretation, and final tax liability should always be verified with a Chartered Accountant or certified Tax Practitioner prior to actual e-filing with the Income Tax Department of India. This application is not affiliated with any government entities.
            </div>
          </div>
        </div>

        {/* Separator & Copyright */}
        <div className="border-t border-gold-300/10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] space-y-4 sm:space-y-0">
          <div>
            &copy; {currentYear} Finance Luxe Private Limited. Meticulously handcrafted for precision.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-gold-300 cursor-pointer">Security Standards</span>
            <span className="hover:text-gold-300 cursor-pointer">Privacy Policies</span>
            <span className="hover:text-gold-300 cursor-pointer flex items-center gap-1">
              <Info className="h-3 w-3 text-gold-400" /> Terms of Wealth Suite
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
