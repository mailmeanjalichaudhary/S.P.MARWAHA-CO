import React, { useState } from "react";
import { X, Mail, Lock, ShieldCheck, ArrowRight, UserPlus, LogIn, Compass, Landmark } from "lucide-react";
import { User, IncomeInput, DeductionsInput } from "../types";
import { getDefaultIncome, getDefaultDeductions } from "../utils/taxCalculator";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("mailmeanjalichaudhary@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Anjali Chaudhary");
  const [occupation, setOccupation] = useState("Senior UX Architect");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all security fields.");
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      const mockCreatedUser: User = {
        uid: "mock-uid-" + Math.random().toString(36).substring(2),
        email: email,
        displayName: isLogin ? (email === "mailmeanjalichaudhary@gmail.com" ? "Anjali Chaudhary" : email.split("@")[0]) : name,
        occupation: isLogin ? "Senior Software Architect & Executive" : occupation,
        income: getDefaultIncome(),
        deductions: getDefaultDeductions(),
        tdsTcs: [
          {
            id: "tds-1",
            payerName: "Luxe Wealth Solutions Corp",
            sectionCode: "192",
            amount: 85000,
            rate: 10,
            type: "TDS",
            date: "2026-04-15"
          },
          {
            id: "tds-2",
            payerName: "State Bank of India",
            sectionCode: "194A",
            amount: 3400,
            rate: 10,
            type: "TDS",
            date: "2026-05-10"
          }
        ]
      };
      
      // Save to localStorage for persistent state across refreshes
      localStorage.setItem("finance_luxe_user", JSON.stringify(mockCreatedUser));
      onLoginSuccess(mockCreatedUser);
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  const signInWithGoogleMock = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const mockCreatedUser: User = {
        uid: "google-uid-10293",
        email: "mailmeanjalichaudhary@gmail.com",
        displayName: "Anjali Chaudhary",
        occupation: "Lead FinTech Specialist",
        income: getDefaultIncome(),
        deductions: getDefaultDeductions(),
        tdsTcs: [
          {
            id: "tds-1",
            payerName: "Luxe Wealth Solutions Corp",
            sectionCode: "192",
            amount: 85000,
            rate: 10,
            type: "TDS",
            date: "2026-04-15"
          },
          {
            id: "tds-2",
            payerName: "State Bank of India",
            sectionCode: "194A",
            amount: 3400,
            rate: 10,
            type: "TDS",
            date: "2026-05-10"
          }
        ]
      };
      localStorage.setItem("finance_luxe_user", JSON.stringify(mockCreatedUser));
      onLoginSuccess(mockCreatedUser);
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-luxe-950/80 backdrop-blur-md">
      {/* Container card */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0c234b] via-[#071530] to-[#030e22] text-white rounded-3xl p-6 sm:p-8 border border-gold-300/30 shadow-2xl shadow-gold-500/10 max-h-[95vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gold-400 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Branding header */}
        <div className="flex flex-col items-center mb-8 text-center pt-2">
          <div className="bg-luxe-950/60 p-3.5 rounded-2xl border border-gold-300/20 mb-3 flex items-center justify-center shadow-lg">
            <Landmark className="h-8 w-8 text-gold-400" />
          </div>
          <h2 className="font-display font-extrabold text-2xl tracking-tight text-white">
            {isLogin ? "Sign In to Luxe Suite" : "Create Luxe Workspace"}
          </h2>
          <p className="font-sans text-xs text-gray-400 mt-1 max-w-xs">
            Authenticate using certified encryption. Manage your tax optimization portfolio securely.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-gold-400 font-bold font-sans">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anjali Chaudhary"
                required
                className="w-full bg-luxe-950/50 border border-gold-300/20 focus:border-gold-400/60 rounded-xl px-4 py-3 text-sans text-sm outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-gold-400 font-bold font-sans">
                Occupation
              </label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Freelance Consultant"
                required
                className="w-full bg-luxe-950/50 border border-gold-300/20 focus:border-gold-400/60 rounded-xl px-4 py-3 text-sans text-sm outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-gold-400 font-bold font-sans flex items-center justify-between">
              <span>Email Address</span>
              {isLogin && email === "mailmeanjalichaudhary@gmail.com" && (
                <span className="text-[9px] text-emerald-400 font-normal lowercase bg-emerald-500/10 border border-emerald-500/20 px-1 rounded">
                  preset client
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@firm.com"
                required
                className="w-full bg-luxe-950/50 border border-gold-300/20 focus:border-gold-400/60 rounded-xl pl-11 pr-4 py-3 text-sans text-sm outline-none transition-all placeholder:text-gray-600"
              />
              <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-gold-400 font-bold font-sans">
              Access Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-luxe-950/50 border border-gold-300/20 focus:border-gold-400/60 rounded-xl pl-11 pr-4 py-3 text-sans text-sm outline-none transition-all placeholder:text-gray-600"
              />
              <Lock className="absolute left-4 top-3.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center font-sans font-medium">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-luxe-950 hover:brightness-110 active:brightness-95 font-display font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 border border-gold-300/20"
          >
            {isSubmitting ? (
              <span className="animate-spin h-5 w-5 border-2 border-luxe-950 border-t-transparent rounded-full" />
            ) : isLogin ? (
              <>
                <LogIn className="h-4.5 w-4.5" />
                <span>Enter Workspace</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4.5 w-4.5" />
                <span>Establish Workspace</span>
              </>
            )}
          </button>
        </form>

        {/* Custom authentication separation */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gold-300/10"></div>
          </div>
          <span className="relative bg-luxe-900 px-3 text-[10px] text-gray-500 uppercase tracking-widest font-sans font-semibold">
            or connect with
          </span>
        </div>

        {/* Google Authentication Button */}
        <button
          onClick={signInWithGoogleMock}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-3 bg-luxe-950/60 hover:bg-luxe-950/90 text-gray-200 border border-gold-300/20 hover:border-gold-400/50 font-sans text-xs py-3 rounded-xl transition-all cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.7 0 3.23.58 4.43 1.73l3.32-3.32C17.75 1.57 15.06 1 12 1 7.35 1 3.37 3.66 1.45 7.54l3.86 3.02C6.23 7.56 8.92 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.52 12.27c0-.81-.07-1.6-.2-2.36H12v4.48h6.46c-.28 1.47-1.11 2.72-2.36 3.56l3.66 2.84c2.14-1.98 3.38-4.89 3.38-8.52z"
            />
            <path
              fill="#FBBC05"
              d="M5.31 14.56c-.24-.72-.37-1.49-.37-2.28 0-.79.13-1.56.37-2.28L1.45 6.98C.52 8.84 0 10.92 0 13c0 2.08.52 4.16 1.45 6.02l3.86-3.02z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.96-1.08 7.95-2.92l-3.66-2.84c-1.02.68-2.32 1.09-3.9 1.09-3.08 0-5.77-2.52-6.69-5.52l-3.86 3.02C3.37 20.34 7.35 23 12 23z"
            />
          </svg>
          <span className="font-semibold text-white">Continue with Google Account</span>
        </button>

        {/* Toggle auth mode */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {isLogin ? "Discovered our services recently? " : "Already established secure credentials? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold-400 hover:text-gold-300 font-bold underline focus:outline-none bg-transparent border-none cursor-pointer"
            >
              {isLogin ? "Open an Account" : "Access Console"}
            </button>
          </p>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center space-x-1.5 mt-6 text-slate-500 text-[10px] font-sans">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-500/50" />
          <span>ISO 27001 Cryptographic Assurance & 256-Bit SSL protection.</span>
        </div>

      </div>
    </div>
  );
}
