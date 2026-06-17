import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized GoogleGenAI client helper
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint: AI Geotechnical Hazard & Telemetry Analyzer
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { sector, seismic, rainfall, displacement, alarms, alertHistory } = req.body;
    
    // Fallback if API key is not configured yet
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        statusLevel: "EVALUATE",
        hazardIndex: 45,
        analysis: "Simulated analysis: AI agent is running in fallback model mode due to unconfigured GEMINI_API_KEY. Displacement rates are elevated at " + (displacement || "15") + " mm/hr in " + (sector || "West Wall") + ".",
        remediation: [
          "Deploy remote scanner to check fracture expansion.",
          "Restrict heavy haul truck traffic on primary ramp.",
          "Prepare siren trigger sequence for sector."
        ],
        evacuationZones: [sector || "West Wall"],
        safetyMessage: "CRITICAL PRECAUTION: Monitor seismic activity on standard frequencies."
      });
    }

    const ai = getAIClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Perform a professional open-pit mine geotechnical hazard analysis based on the following real-time telemetry:
Sector: ${sector || "Unknown"}
Seismic Tremor Peak: ${seismic || "0"} Gs
Rainfall Precipitation: ${rainfall || "0"} mm/hr
Slope Displacement rate: ${displacement || "0"} mm/hr
Active Alarms Status: ${JSON.stringify(alarms || {})}
Recent Event Log: ${JSON.stringify(alertHistory || [])}
Provide your output as a validated safety report for the command center.`,
      config: {
        systemInstruction: "You are the advanced Geotechnical Risk Processor AI for the Rockfall Command Center. Evaluate open-pit mine wall stability, displacement rate and tremor peak, and generate safety guidelines. Always provide a structured, practical hazard analysis tailored for mine safety supervisors.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            statusLevel: {
              type: Type.STRING,
              description: "Status level of the sector: 'OPTIMAL' | 'EVALUATE' | 'CRITICAL_ALERT'",
            },
            hazardIndex: {
              type: Type.INTEGER,
              description: "Risk score from 0 (very safe) to 100 (catastrophic hazard)",
            },
            analysis: {
              type: Type.STRING,
              description: "Deep geotechnical summary of current threat vectors, movement, and rock mass profiles.",
            },
            remediation: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable engineering countermeasures, control keys, and mitigation operations.",
            },
            evacuationZones: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Sectors, ramps, or pits that must be immediately cleared, shut down, or restricted.",
            },
            safetyMessage: {
              type: Type.STRING,
              description: "Official direct broadcast transcript to be read or dispatched to teams on site.",
            },
          },
          required: ["statusLevel", "hazardIndex", "analysis", "remediation", "evacuationZones", "safetyMessage"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Analysis API Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// REST API endpoint: AI Safety Officer Chat Companion
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, sensorStates, alarms } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: "This is the active Emergency AI Advisor (Fallback Mode). Please configure your GEMINI_API_KEY in Settings > Secrets to activate real-time intelligence. Currently checking standard safety threshold parameters. Let me know if you need to run drills or mock tests!"
      });
    }

    const ai = getAIClient();

    // Reconstruct the dialogue transcript
    const lastUserMessage = messages && messages.length > 0 ? messages[messages.length - 1].text : "Hello";
    const history = messages ? messages.slice(0, messages.length - 1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    })) : [];

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are the Geotechnical Safety Officer & Principal AI Advisor at the Rockfall Command Center.
        You communicate clearly, professionally, and authoritatively, resembling an experienced mine operations veteran.
        Current system metrics for your reference:
        - Active sensors: ${JSON.stringify(sensorStates || [])}
        - Current Alarm Status: ${JSON.stringify(alarms || {})}
        Respond to the user as their principal expert, providing smart, actionable open-pit safety analysis, rockfall protocols, slope-monitoring recommendations, sensor troubleshooting, or muster instructions.`,
      },
      history: history
    });

    const response = await chat.sendMessage({
      message: lastUserMessage
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Vite & Static file serving setup
async function setupServer() {
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
    console.log(`Rockfall Command Center server booting at http://localhost:${PORT}`);
  });
}

setupServer();
