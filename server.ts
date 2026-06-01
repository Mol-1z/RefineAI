import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON bodies
  app.use(express.json());

  // AI Optimization API Route
  app.post("/api/optimize", async (req, res): Promise<any> => {
    try {
      const { originalEmail, recipient, tone, context } = req.body;

      if (!originalEmail || !tone) {
        return res.status(400).json({ error: "Original email content and tone selection are required." });
      }

      // Check for user-supplied custom API key first, or fall back to server-side process.env.GEMINI_API_KEY
      const clientApiKey = req.headers["x-gemini-api-key"] || req.headers["X-Gemini-Api-Key"];
      const apiKey = (clientApiKey as string) || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(401).json({ 
          error: "Gemini API key is missing. Please open the Settings modal (gear icon) and paste your Gemini API Key." 
        });
      }

      // Initialize Google GenAI with appropriate token headers & context
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Construct system prompt and instructions
      const systemInstruction = 
        "You are an elite, high-performance executive email communication copywriter and productivity expert. " +
        "Your task is to optimize the user's draft email. Maintain the fundamental core facts, names, and metrics " +
        "included in the input, but dramatically elevate the grammar, style, structure, formatting, and clarity. " +
        "Ensure the resulting email matches the target tone perfectly. " +
        "Always provide a professional, specific subject line. " +
        "Do not include any preachy commentary, introductions like 'Here is your optimized email:', or boilerplate text in the final email.";

      const prompt = `Please rewrite and optimize the following email with the provided parameters:
- Target Tone: ${tone}
- Recipient / Context constraints: ${recipient || "General Audience"}
- Intent or Goal / Context details: ${context || "Not specified"}

Original Email (before optimization):
"""
${originalEmail}
"""`;

      // Define structured Response Schema to get clean JSON directly from Gemini
      const generateParams = (modelName: string) => ({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subjectLine: {
                type: Type.STRING,
                description: "A highly polished, engaging subject line tailored to the selected tone and recipient.",
              },
              optimizedEmail: {
                type: Type.STRING,
                description: "The complete, optimized email body. Provide paragraphs, clear greetings and sign-offs, and clean alignment. Use clean line breaks, but keep it as a raw string without any markdown code block wrappers (do not include backticks).",
              },
              changeSummary: {
                type: Type.STRING,
                description: "A concise bulleted list summary explaining the key revisions and why they make the email better. Focus on grammar, tone adjustment, pacing, or formatting changes.",
              },
            },
            required: ["subjectLine", "optimizedEmail", "changeSummary"],
          },
        },
      });

      let response;
      try {
        console.log("Attempting email optimization with primary model: gemini-3.5-flash");
        response = await ai.models.generateContent(generateParams("gemini-3.5-flash"));
      } catch (primaryError: any) {
        const errStr = primaryError?.message || "";
        const is503 = errStr.includes("503") || errStr.toLowerCase().includes("demand") || errStr.toLowerCase().includes("unavailable");
        
        if (is503) {
          console.warn("Primary model gemini-3.5-flash is experiencing high demand (503). Activating robust fallback model: gemini-3.1-flash-lite");
          try {
            response = await ai.models.generateContent(generateParams("gemini-3.1-flash-lite"));
          } catch (fallbackError: any) {
            console.error("Fallback model gemini-3.1-flash-lite also failed:", fallbackError);
            throw fallbackError;
          }
        } else {
          throw primaryError;
        }
      }

      const jsonText = response.text;
      if (!jsonText) {
        throw new Error("Empty response received from the Gemini AI engine.");
      }

      const parsedOutput = JSON.parse(jsonText.trim());
      return res.json(parsedOutput);

    } catch (error: any) {
      console.error("Gemini Optimization Error:", error);
      const errMessage = error?.message || "An unexpected error occurred during email generation.";
      return res.status(500).json({ error: errMessage });
    }
  });

  // Hot Module Replacement (HMR) and serving configs via Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Email Optimizer server is booting on http://localhost:${PORT}`);
  });
}

startServer();
