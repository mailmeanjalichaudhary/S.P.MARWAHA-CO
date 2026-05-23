import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, ShieldAlert, ArrowRight, CornerDownLeft, Info, HelpCircle } from "lucide-react";
import { User, ChatMessage } from "../types";

interface ChatBotProps {
  user: User;
}

export default function ChatBot({ user }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: `Hello ${user.displayName}! I am your private **Finance Luxe Tax Expert** powered by Gemini AI.\n\nI am trained extensively on Indian Income Tax laws, revised budget slabs, HRA computations, Section 80C, 80D, capital gains indexations, and compliance rules.\n\nHow can I help you optimize your wealth portfolio today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    { q: "Which regime is better for my salary?", label: "Compare Regimes" },
    { q: "Can I claim HRA and a home loan at the same time?", label: "HRA & Home Loan" },
    { q: "What tax-saving deductions am I missing?", label: "Missing Deductions" },
    { q: "How can I lower tax on client consulting income?", label: "Freelancer Taxes" }
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Connect to server api
      const response = await fetch("/api/tax-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg]
        })
      });

      if (!response.ok) {
        throw new Error("Tax Chat Service is currently unresponsive.");
      }

      const data = await response.json();
      
      const modelMsg: ChatMessage = {
        role: "model",
        text: data.text || "I apologize, could you rephrase your tax query?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      const errMsg: ChatMessage = {
        role: "model",
        text: "🚨 **Service Notice**: Failed to connect with our core AI module. Please verify your GEMINI_API_KEY environment credentials in the Secrets panel, or retry shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Safe Mini-Markdown Line Formatter (No external markdown package conflicts)
  const formatText = (text: string) => {
    return text.split("\n").map((line, idx) => {
      let trimmed = line.trim();
      
      // Check for bullet lists
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const rest = trimmed.substring(2);
        return (
          <li key={idx} className="list-disc ml-5 mt-1 text-gray-300 font-sans leading-relaxed text-xs sm:text-sm">
            {formatInlineBold(rest)}
          </li>
        );
      }

      // Check for numbered lists
      if (/^\d+\.\s/.test(trimmed)) {
        const dotIndex = trimmed.indexOf(".");
        const rest = trimmed.substring(dotIndex + 1).trim();
        return (
          <li key={idx} className="list-decimal ml-5 mt-1 text-gray-300 font-sans leading-relaxed text-xs sm:text-sm">
            {formatInlineBold(rest)}
          </li>
        );
      }

      // Large headers
      if (trimmed.startsWith("### ")) {
        return (
          <h5 key={idx} className="text-sm font-display font-black text-gold-300 mt-4 mb-2 uppercase tracking-wide">
            {trimmed.substring(4)}
          </h5>
        );
      }

      if (trimmed.startsWith("## ")) {
        return (
          <h4 key={idx} className="text-base font-display font-black text-gold-400 mt-5 mb-2.5 uppercase tracking-wider border-b border-gold-300/10 pb-1">
            {trimmed.substring(3)}
          </h4>
        );
      }

      // Regular lines
      return (
        <p key={idx} className="mt-1.5 font-sans leading-relaxed text-xs sm:text-sm text-gray-200">
          {formatInlineBold(trimmed)}
        </p>
      );
    });
  };

  const formatInlineBold = (text: string) => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-extrabold text-gold-200 uppercase tracking-tight text-[11.5px] bg-gold-400/5 border border-gold-400/10 px-1 py-0.5 rounded">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="bg-[#030e22] text-white h-[80vh] flex flex-col border border-gold-300/15 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Top Messenger Branding header */}
      <div className="bg-[#071530] border-b border-gold-300/15 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-left">
          <div className="p-2.5 bg-gradient-to-r from-gold-500/15 to-gold-600/15 border border-gold-500/30 rounded-xl">
            <Sparkles className="h-5 w-5 text-gold-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm uppercase text-white tracking-widest flex items-center gap-1.5">
              <span>Luxe AI Tax Advisor</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold font-sans">
                Active core
              </span>
            </h3>
            <p className="text-[10px] text-gray-400 font-sans">Indian Income Tax Code Consulting</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500 font-sans">
          <ShieldAlert className="h-4 w-4 text-gold-500/50" />
          <span>Chartered Expert Grade</span>
        </div>
      </div>

      {/* Suggestion tags container */}
      <div className="bg-luxe-950/40 border-b border-gold-300/10 px-4 py-3 flex gap-2 overflow-x-auto scrollbar-thin">
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.q)}
            disabled={isTyping}
            className="bg-luxe-950 border border-gold-300/10 hover:border-gold-300/40 text-[10.5px] tracking-wide font-sans text-gray-300 font-medium py-1.5 px-3 rounded-full cursor-pointer transition-all whitespace-nowrap active:scale-95 disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-[#020712]/50 text-left">
        {messages.map((msg, idx) => {
          const isModel = msg.role === "model";
          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 ${isModel ? "justify-start" : "justify-end"}`}
            >
              {isModel && (
                <div className="h-8.5 w-8.5 rounded-full bg-luxe-900 border border-gold-500/40 flex items-center justify-center font-display font-bold text-xs text-gold-300 shrink-0">
                  AI
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-left ${
                isModel
                  ? "bg-luxe-900/60 border border-gold-300/10 text-gray-200"
                  : "bg-gradient-to-r from-gold-500 to-gold-600 border border-gold-400/20 text-luxe-950 font-medium"
              }`}>
                {isModel ? (
                  <div className="space-y-1">{formatText(msg.text)}</div>
                ) : (
                  <p className="text-xs sm:text-sm font-sans leading-relaxed">{msg.text}</p>
                )}
                <span className={`text-[9px] block text-right mt-1.5 ${isModel ? "text-slate-500" : "text-luxe-950/60"}`}>
                  {msg.timestamp}
                </span>
              </div>

              {!isModel && (
                <div className="h-8.5 w-8.5 rounded-full bg-gold-500 text-luxe-950 font-display font-bold text-xs flex items-center justify-center shrink-0">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-3.5 justify-start">
            <div className="h-8.5 w-8.5 rounded-full bg-luxe-900 border border-gold-500/40 flex items-center justify-center font-bold text-xs text-gold-300 animate-pulse">
              AI
            </div>
            <div className="bg-luxe-900/50 border border-gold-300/10 rounded-2xl px-4 py-3.5 text-left flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input console */}
      <div className="bg-[#071530] border-t border-gold-300/15 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex items-center space-x-2 bg-luxe-950/80 border border-gold-300/15 rounded-xl px-3 py-1 focus-within:border-gold-400/60"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Query about Section 10(13A), Old vs New advantages, or 80D parents seniors..."
            className="flex-1 bg-transparent border-none py-3 px-2 outline-none text-xs sm:text-sm font-sans placeholder:text-gray-600 text-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:brightness-110 active:scale-95 text-luxe-950 rounded-lg cursor-pointer transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <Send className="h-4 w-4 text-luxe-950" />
          </button>
        </form>
        <div className="text-center pt-2 text-[9.5px] text-slate-500 font-sans">
          🛡️ AI predictions validated under current Income Tax schedules. Verify complex matters with a CA.
        </div>
      </div>

    </div>
  );
}
