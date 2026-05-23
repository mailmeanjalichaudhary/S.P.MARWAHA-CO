import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import TaxDashboard from "./components/TaxDashboard";
import IncomeInput from "./components/IncomeInput";
import DeductionsInput from "./components/DeductionsInput";
import TdsTcsInput from "./components/TdsTcsInput";
import ChatBot from "./components/ChatBot";
import ReportsPanel from "./components/ReportsPanel";

import { User, IncomeInput as IncomeType, DeductionsInput as DeductionsType, TdsTcsRecord } from "./types";
import { getDefaultIncome, getDefaultDeductions } from "./utils/taxCalculator";

type NavTab = "home" | "dashboard" | "income" | "deductions" | "tds" | "chat" | "reports";

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load state or fallback to compliant templates
  const [income, setIncome] = useState<IncomeType>(getDefaultIncome());
  const [deductions, setDeductions] = useState<DeductionsType>(getDefaultDeductions());
  const [tdsTcs, setTdsTcs] = useState<TdsTcsRecord[]>([
    {
      id: "tds-mock-1",
      payerName: "Luxe Software Solutions Private Limited (Employer)",
      sectionCode: "192",
      amount: 45000,
      rate: 10,
      type: "TDS",
      date: "2026-04-15"
    },
    {
      id: "tds-mock-2",
      payerName: "State Bank of India (FD)",
      sectionCode: "194A",
      amount: 2400,
      rate: 10,
      type: "TDS",
      date: "2026-05-10"
    }
  ]);

  // Read mock login state on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("luxe_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as User;
        setCurrentUser(parsed);
        // Default to dashboard if logged in
        setCurrentTab("dashboard");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update user profile wrapper
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("luxe_user", JSON.stringify(user));
    setShowAuthModal(false);
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("luxe_user");
    setCurrentTab("home");
  };

  const handleUpdateIncome = (newIncome: IncomeType) => {
    setIncome(newIncome);
    // If we have an active user, persist in local memory too
    if (currentUser) {
      const updatedUser = { ...currentUser, income: newIncome };
      setCurrentUser(updatedUser);
      localStorage.setItem("luxe_user", JSON.stringify(updatedUser));
    }
  };

  const handleUpdateDeductions = (newDeductions: DeductionsType) => {
    setDeductions(newDeductions);
    if (currentUser) {
      const updatedUser = { ...currentUser, deductions: newDeductions };
      setCurrentUser(updatedUser);
      localStorage.setItem("luxe_user", JSON.stringify(updatedUser));
    }
  };

  const handleUpdateTdsTcs = (newTdsTcs: TdsTcsRecord[]) => {
    setTdsTcs(newTdsTcs);
    if (currentUser) {
      const updatedUser = { ...currentUser, tdsTcs: newTdsTcs };
      setCurrentUser(updatedUser);
      localStorage.setItem("luxe_user", JSON.stringify(updatedUser));
    }
  };

  // Sync user values if user logins later
  useEffect(() => {
    if (currentUser) {
      setIncome(currentUser.income || getDefaultIncome());
      setDeductions(currentUser.deductions || getDefaultDeductions());
      setTdsTcs(currentUser.tdsTcs || []);
    }
  }, [currentUser]);

  // Construct active virtual user for widgets
  const virtualUser: User = currentUser || {
    id: "guest-user",
    email: "guest@financeluxe.com",
    displayName: "Luxe Guest",
    occupation: "salaried",
    income,
    deductions,
    tdsTcs
  };

  // Guard for protected sections
  const navigateToTabPrudently = (tab: NavTab) => {
    if (tab !== "home" && !currentUser) {
      setShowAuthModal(true);
    } else {
      setCurrentTab(tab);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030e22] text-white selection:bg-gold-500 selection:text-luxe-950">
      
      {/* Sticky Premium Header Navbar */}
      <Navbar
        currentUser={currentUser}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
        activeTab={currentTab}
        onNavigate={navigateToTabPrudently}
      />

      {/* Primary content area panel */}
      <main className="flex-grow pt-20">
        
        {/* LANDING PAGE SCREEN */}
        {currentTab === "home" && (
          <LandingPage
            onJoinSuite={() => navigateToTabPrudently("dashboard")}
            onQuickCalculatorJump={() => navigateToTabPrudently("income")}
          />
        )}

        {/* CONTAINER FOR PORTFOLIO SECTIONS */}
        {currentTab !== "home" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* 1. DASHBOARD OVERVIEW */}
            {currentTab === "dashboard" && (
              <TaxDashboard
                user={virtualUser}
                onNavigateToCalculator={() => setCurrentTab("income")}
                onNavigateToDeductions={() => setCurrentTab("deductions")}
                onNavigateToReports={() => setCurrentTab("reports")}
                onNavigateToAi={() => setCurrentTab("chat")}
              />
            )}

            {/* 2. FIVE HEADS INCOME SCREEN */}
            {currentTab === "income" && (
              <IncomeInput
                user={virtualUser}
                onUpdateIncome={handleUpdateIncome}
                onJumpToDeductions={() => setCurrentTab("deductions")}
              />
            )}

            {/* 3. DEDUCTIONS & EXEMPTIONS LIMIT MANAGER */}
            {currentTab === "deductions" && (
              <DeductionsInput
                user={virtualUser}
                onUpdateDeductions={handleUpdateDeductions}
                onJumpToTds={() => setCurrentTab("tds")}
              />
            )}

            {/* 4. TDS / TCS WITHHOLDING RECORDS LEDGER */}
            {currentTab === "tds" && (
              <TdsTcsInput
                user={virtualUser}
                onUpdateTdsTcs={handleUpdateTdsTcs}
                onJumpToDashboard={() => setCurrentTab("dashboard")}
              />
            )}

            {/* 5. LUXE AI ASSISTANT CHAT TERMINAL */}
            {currentTab === "chat" && (
              <ChatBot
                user={virtualUser}
              />
            )}

            {/* 6. REPORTS EXPORTS & REGIME SLIPS SECTION */}
            {currentTab === "reports" && (
              <ReportsPanel
                user={virtualUser}
              />
            )}

          </div>
        )}

      </main>

      {/* Sticky Footer */}
      <Footer />

      {/* Interactive Authorization Form Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLogin}
        />
      )}

    </div>
  );
}
