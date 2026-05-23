import React from "react";
import { Coins, User, LogIn, LogOut, Menu, X, Sparkles, Receipt } from "lucide-react";
import { User as UserType } from "../types";

interface NavbarProps {
  currentUser: UserType | null;
  activeTab: string;
  onNavigate: (tab: any) => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export default function Navbar({
  currentUser,
  activeTab,
  onNavigate,
  onLoginClick,
  onLogoutClick,
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", protected: true },
    { id: "income", label: "Tax Income", protected: false },
    { id: "deductions", label: "Deductions Plan", protected: false },
    { id: "chat", label: "AI Tax Expert", protected: false },
    { id: "reports", label: "Compliance & Reports", protected: true },
  ];

  const handleNavClick = (tabId: string, isProtected: boolean) => {
    onNavigate(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#071530] border-b border-gold-300/20 shadow-xl backdrop-blur-md bg-opacity-95 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate("home")}>
            <div className="bg-gradient-to-br from-gold-300 via-gold-500 to-gold-600 p-2.5 rounded-xl shadow-md shadow-gold-500/20 flex items-center justify-center">
              <Coins className="h-6 w-6 text-luxe-950 font-semibold" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-display text-lg sm:text-xl font-extrabold tracking-wide text-white">
                  FINANCE <span className="text-gold-400">LUXE</span>
                </span>
                <span className="bg-gold-500/10 text-gold-400 border border-gold-400/20 text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 rounded ml-1">
                  TAX
                </span>
              </div>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase font-sans">
                Indian Wealth & Compliance
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.protected)}
                  className={`relative px-4 py-2 rounded-lg font-sans text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-gold-300 bg-luxe-800/40 border border-gold-400/30 font-semibold shadow-inner"
                      : "text-gray-300 hover:text-white hover:bg-luxe-800/25"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.id === "chat" && <Sparkles className="h-3 w-3 text-gold-400 animate-pulse" />}
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-gold-400 to-gold-500 rounded" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Auth Button */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-3 bg-luxe-950/60 py-1.5 px-3 rounded-full border border-gold-300/10 hover:border-gold-300/30 transition-all duration-300">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-gold-200">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    {currentUser.email.length > 22 ? currentUser.email.substring(0, 20) + "..." : currentUser.email}
                  </span>
                </div>
                <div className="bg-luxe-800 border border-gold-500/40 text-gold-300 h-9 w-9 rounded-full flex items-center justify-center font-display font-bold text-sm shadow-md">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogoutClick}
                  title="Logout"
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:brightness-110 active:brightness-95 text-luxe-950 font-display font-bold text-sm py-2.5 px-5 rounded-xl shadow-lg shadow-gold-500/15 cursor-pointer transition-all duration-300 border border-gold-300/20"
              >
                <LogIn className="h-4 w-4" />
                <span>Client Suite</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            {currentUser && (
              <div className="h-8 w-8 rounded-full bg-gold-500 text-luxe-950 flex items-center justify-center font-bold text-xs border border-white/20">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-luxe-800/40 focus:outline-none transition-colors border border-transparent hover:border-gold-300/10 cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#051026] border-t border-gold-300/10 px-2 pt-2 pb-6 space-y-1 block">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.protected)}
              className={`w-full text-left px-4 py-3 rounded-xl font-sans text-sm font-medium tracking-wide flex items-center justify-between cursor-pointer ${
                activeTab === item.id
                  ? "bg-luxe-800/70 text-gold-300 border-l-4 border-gold-500 font-semibold pl-3"
                  : "text-gray-300 hover:bg-luxe-800/30 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {item.id === "chat" && <Sparkles className="h-3 w-3 text-gold-400" />}
            </button>
          ))}
          <div className="pt-4 border-t border-gold-300/10 px-4">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-1">
                  <div className="bg-gold-500/10 border border-gold-400/30 text-gold-400 h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left font-sans">
                    <h4 className="text-xs font-bold text-white">{currentUser.displayName}</h4>
                    <p className="text-[10px] text-gray-400">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogoutClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-luxe-800/60 hover:bg-red-950/20 text-gray-300 hover:text-red-400 border border-gold-300/10 hover:border-red-500/20 font-sans text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout Workspace</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-luxe-950 font-display font-black text-xs py-3 px-6 rounded-xl shadow-lg shadow-gold-500/15 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Client Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
