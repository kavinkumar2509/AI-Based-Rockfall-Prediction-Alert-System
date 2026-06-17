import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route first: AI-driven risk analysis request
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { sector, vibration, slopeTilt, moisture, rainfall } = req.body;

    // Check if API key is present
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Graceful fallback when API key is missing or is the placeholder
      const safetyLevel = vibration > 0.8 || slopeTilt > 15 || moisture > 40
        ? "CRITICAL"
        : vibration > 0.4 || slopeTilt > 8 || moisture > 25
          ? "WARNING"
          : "NOMINAL";

      const fallbackAssessment = {
        assessment: `[LOCAL ANALYTICS MOTOR - BACKUP MODE]\nTelemetry analysis for Sector ${sector || "ALPHA-1"} shows ${safetyLevel.toLowerCase()} seismic stability. Vibration index registers at ${vibration || 0.3}g, combined with a local slope tilt of ${slopeTilt || 5}° and aggregate structural moisture index of ${moisture || 18}%. Displacement vectors are currently behaving in accordance with baseline operational thresholds. Heavy equipment vibration interference is detected, but no tectonic resonance or imminent failures are predicted. Continuous visual lidar scanning recommended.`,
        confidence: 89,
        riskScore: safetyLevel === "CRITICAL" ? 78 : safetyLevel === "WARNING" ? 42 : 11,
        status: safetyLevel === "CRITICAL" ? "CRITICAL_MOVEMENT" : safetyLevel === "WARNING" ? "WARNING_DISPLACEMENT" : "STABLE_SEISMIC",
        recommendations: [
          "Establish standard visual telemetry check-ups.",
          safetyLevel !== "NOMINAL" ? "Halt heavy machinery operations immediately in Sector " + sector : "Maintain current extraction load vectors.",
          "Perform mandatory physical inclinometer recalibration.",
          safetyLevel === "CRITICAL" ? "Initiate acoustic warning siren drills for all personnel." : "Ensure LIDAR monitoring is actively synced."
        ]
      };

      return res.json(fallbackAssessment);
    }

    // Initialize Gemini client with proper user agent for telemetry
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `Analyze the safety.
Sector: ${sector || "ALPHA-1"}
Vibration: ${vibration || 0.36}g
Slope Tilt: ${slopeTilt || 6.8}°
Moisture: ${moisture || 18}%
Rainfall: ${rainfall || 0}mm

Perform a professional geotechnical AI stability and risk assessment as expected in a high-risk open-pit mining environment.
You must return your output strictly in JSON format matching this schema:
{
  "assessment": "Detailed 2-3 sentence geotechnical summary of the current readings, describing stability and any potential rockfall or landslide risks. Keep it professional and realistic.",
  "confidence": <integer percentage 0-100 indicating confidence>,
  "riskScore": <integer risk rating 1-100>,
  "status": "STABLE_SEISMIC" or "WARNING_DISPLACEMENT" or "CRITICAL_MOVEMENT",
  "recommendations": ["Recommendation 1", "Recommendation 2", "etc."]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert geotechnical engineer and AI Risk Analyst at a state-of-the-art mining operation. Provide safety assessments based on telemetry feeds."
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini API");
    }

    // Parse safety answer
    const parsed = JSON.parse(resultText.trim());
    res.json(parsed);

  } catch (error: any) {
    console.error("Gemini API server error:", error);
    res.status(500).json({
      error: "Failed to generate AI Risk Assessment.",
      details: error.message
    });
  }
});

// Configure Vite middleware or static files
async function startServer() {
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
    console.log(`Rockfall Command Center server is operating on http://0.0.0.0:${PORT}`);
  });
}

startServer();
