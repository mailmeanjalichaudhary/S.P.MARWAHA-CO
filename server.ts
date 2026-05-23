import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended server-side settings
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn("GEMINI_API_KEY is not defined in the environment. Chatbot capabilities will run in demonstration mode.");
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Chatbot Endpoint (Indian Tax Planning expert role prompt)
app.post("/api/tax-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    if (!ai) {
      // Demonstration fallback responses in case user hasn't configured a secret key yet
      const lastMsg = messages[messages.length - 1]?.text?.toLowerCase() || "";
      let reply = "Hello! I am your Finance Luxe Tax Assistant. Please set your GEMINI_API_KEY in the Secrets panel (Settings > Secrets) to enable me to dynamically answer complex Indian tax questions with specialized reasoning.\n\nHere is a quick answer: ";
      
      if (lastMsg.includes("regime") || lastMsg.includes("better")) {
        reply += "Generally, the New Tax Regime is premium and recommended if you have fewer deductions (below ₹3,75,000 in total deductions). However, if you reside in a rented property in a metro, have a high home loan, and make deep Section 80C, 80D, and NPS contributions, the Old Regime could save you thousands. Log your detailed salary in the calculator on our left dashboard to compare exact tax savings!";
      } else if (lastMsg.includes("hra") || lastMsg.includes("home loan")) {
        reply += "Yes, you can absolutely claim HRA under Section 10(13A) and Home Loan Interest under Section 24(b) simultaneously! To satisfy the tax authorities, you should actually reside in the rented property, have genuine rental receipts, and the home loan should be for a owned property situated in a different city or not yet occupied due to professional reasons.";
      } else {
        reply += "Indian Income Tax rules like Section 80C allow deductions of up to ₹1.5 Lakhs for investments in PPF, ELSS, EPF, and tax-saver FDs. Section 80D offers extra medical insurance benefits. Let me know what specific query you have, and configure your API key for tailored real-time advisory.";
      }
      return res.json({ text: reply });
    }

    // Prepare history structure for Gemini chats
    // The @google/genai SDK chats model has an easy interface. We can either use ai.chats or single turn with rich history context.
    // Let's use a single turn generateContent with history embedded or a standard chat format.
    // System instruction details
    const systemInstruction = `
You are safe, extremely knowledgeable, and professional "Finance Luxe Tax Assistant" - a premium AI bot specialized in Indian Income Tax planning, laws, compliance, and optimization.
    
Target Audience: Salaried individuals, freelancers, professionals, and small business owners in India.
Tone: Premium, warm, reassuring, highly professional, polite, and intermediate-to-beginner friendly. Avoid dry legalese, but be 100% accurate regarding Indian income tax sections (e.g. 80C, 80D, 80CCD(1B), Section 24(b), Section 112A, 10(13A) for HRA).
Language style: Professional Indian English, polite and helpful analogies, with practical steps. E.g., Use "Lakhs" (L) and "Crores" (Cr) instead of millions/billions. Use Rupees (₹) for currency.
    
Specific Directives:
1. Old vs New Regime comparison: Clarify that the standard deduction has been updated to ₹75,000 for the New Regime under FY 2024-25, and is ₹50,000 for the Old Regime. Remind individuals that New Regime offers lower tax rates but bars Chapter VI-A deductions.
2. HRA and Home loan together: Yes, you can claim both if they reside in rented accommodation due to work, while owning a home in another location (or if own home is rented out).
3. Clearly define the Section limits: 80C is capped strictly at ₹1,50,000. NPS 80CCD(1B) is capped at ₹50,000 (extra). Health Insurance 80D is 25,000 for self/family, and 25,000/50,000 for parents.
4. Add a friendly warning: "Please note that while I offer robust computational and structural tax guidance, always double-check with a tax-filing professional or Chartered Accountant for your final ITR submission."

Explain concepts systematically, using neat bullet points or tables where appropriate.
`;

    // Convert message list for generateContent inputs
    // The message format of gemini generateContent uses parts.
    // We can join previous exchanges as context
    let formattedContents = messages.map(msg => {
      const role = msg.role === "user" ? "user" : "model";
      return {
        role: role,
        parts: [{ text: msg.text }]
      };
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I apologize, but I could not formulate a diagnostic answer at this moment. Let's retry in a brief moment.";
    return res.json({ text: replyText });

  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    return res.status(500).json({ 
      error: "Failed to communicate with our AI Tax Assistant core.", 
      details: error.message 
    });
  }
});

// Configure Vite or Static Asset delivery
async function bootstrapServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development server with Vite integration
    console.log("Starting in DEVELOPMENT mode, hooking Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production mode
    console.log("Starting in PRODUCTION mode, serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Finance Luxe server listening peacefully on http://localhost:${PORT}`);
  });
}

bootstrapServer();
