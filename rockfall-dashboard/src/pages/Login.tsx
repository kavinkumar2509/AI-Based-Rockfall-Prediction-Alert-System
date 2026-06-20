  import { useNavigate } from "react-router-dom";
  
  import React, { useState, useEffect, useRef } from "react";
import {
  Award,
  Key,
  Shield,
  Clock,
  Eye,
  EyeOff,
  Sun,
  Layout,
  CheckCircle,
  HelpCircle,
  Database,
  Cpu,
  Fingerprint,
  RefreshCw,
  Construction,
  Lock,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Theme specifications for Maritime / Industrial Brutalism
interface ThemeConfig {
  id: string;
  name: string;
  primary: string;       // HEX/Color code
  textPrimary: string;
  bgGrad: string;
  outlineColor: string;
  glowColor: string;
}

const THEMES: ThemeConfig[] = [
  {
    id: "amber",
    name: "Warning Amber",
    primary: "#ffd700",
    textPrimary: "#e9c400",
    bgGrad: "rgba(233, 196, 0, 0.05)",
    outlineColor: "border-[#4d4732]",
    glowColor: "rgba(255, 215, 0, 0.2)"
  },
  {
    id: "emerald",
    name: "Cyber Emerald",
    primary: "#10b981",
    textPrimary: "#34d399",
    bgGrad: "rgba(16, 185, 129, 0.05)",
    outlineColor: "border-[#154734]",
    glowColor: "rgba(16, 185, 129, 0.2)"
  },
  {
    id: "crimson",
    name: "Crimson Sector",
    primary: "#ef4444",
    textPrimary: "#f87171",
    bgGrad: "rgba(239, 68, 68, 0.05)",
    outlineColor: "border-[#5c1d1d]",
    glowColor: "rgba(239, 68, 68, 0.2)"
  },
  {
    id: "cobalt",
    name: "Cobalt Ocean",
    primary: "#3b82f6",
    textPrimary: "#60a5fa",
    bgGrad: "rgba(59, 130, 246, 0.05)",
    outlineColor: "border-[#1e3a8a]",
    glowColor: "rgba(59, 130, 246, 0.2)"
  }
];

export default function App() {
  // Theme state
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(THEMES[0]);
  
  // Input fields
  const [accessTier, setAccessTier] = useState<string>("supervisor");
const [operatorId, setOperatorId] =useState("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [persistentSession, setPersistentSession] = useState<boolean>(true);

  // Interaction feedback states
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<"IDLE" | "AUTHENTICATING" | "CONNECTED" | "ERROR">("IDLE");
  const [statusMessage, setStatusMessage] = useState<string>("SYSTEM STATUS: CHANNELS SECURED");
  const [timeStr, setTimeStr] = useState<string>("19:42:03");
  const navigate = useNavigate();

  // Keep a simulated clock updating to show real attention to precision
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Authentication simulator
const handleLoginSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setIsConnecting(true);

    const response = await fetch(
      "https://rockfall-backend-7qfn.onrender.com/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: operatorId,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    localStorage.setItem(
      "token",
      data.token
    );

    setConnectionStatus("CONNECTED");
    setStatusMessage(
      `WELCOME ${data.username}`
    );

    navigate("/dashboard");
  } catch (error) {
    setConnectionStatus("ERROR");
    setStatusMessage(
      "INVALID USERNAME OR PASSWORD"
    );
  } finally {
    setIsConnecting(false);
  }
};

    

  // Atmospheric cursor glow coordinates
  const [glowPos, setGlowSpot] = useState({ x: 50, y: 50 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowSpot({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col font-mono text-[#e4e2e1] bg-[#121212] selection:bg-[#ffd700] selection:text-[#131313] overflow-x-hidden relative transition-all duration-300"
      style={{
        backgroundImage: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${activeTheme.bgGrad} 0%, rgba(18, 18, 18, 0.4) 60%)`,
        "--primary-glow": activeTheme.glowColor
      } as React.CSSProperties}
      id="root-container"
    >
      {/* Background Matrix Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Main Login Screen Viewport */}
      <div className="flex-grow flex flex-col justify-between p-4 md:p-8 relative z-10">
        
        {/* Header Block with Brand on Left and Theme Switcher on Right */}
        <header className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#333333]/60 pb-4">
          <div className="flex items-center gap-4">
            {/* Custom SVG logo with matching theme glow colors */}
            <div 
              style={{ borderColor: activeTheme.primary }}
              className="w-11 h-11 border-2 rounded flex items-center justify-center bg-[#1b1c1c] p-2 transition-colors duration-300"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: activeTheme.primary }} fill="currentColor">
                {/* Pit Wall lines */}
                <path d="M10,10 L35,48 L65,48 L90,10" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M22,25 L42,65 L58,65 L78,25" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6,6" />
                {/* Geotechnical Radar pulse point */}
                <circle cx="50" cy="74" r="9" className="animate-pulse" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg tracking-tighter uppercase transition-colors duration-200" style={{ color: activeTheme.textPrimary }}>
                ROCKFALL COMMAND CENTER
              </h1>
              <p className="text-[10px] md:text-xs text-[#d0c6ab] tracking-widest uppercase opacity-75 font-sans font-medium">
                AI-Powered Open-Pit Mine Monitoring & Risk Prediction System
              </p>
            </div>
          </div>
          
          {/* THEME SELECTOR - Top Right Side */}
          <div className="flex items-center gap-2 bg-[#1b1c1c] p-1.5 rounded border border-[#333333]">
            <span className="text-[9px] uppercase font-bold text-[#d0c6ab] px-2">Theme Profile:</span>
            <div className="flex gap-1">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(theme)}
                  title={theme.name}
                  style={{
                    backgroundColor: theme.primary,
                    boxShadow: activeTheme.id === theme.id ? `0 0 10px ${theme.primary}` : "none",
                    borderColor: activeTheme.id === theme.id ? "#e4e2e1" : "transparent"
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-all cursor-pointer transform hover:scale-115 active:scale-90`}
                />
              ))}
            </div>
          </div>
        </header>

        {/* Central Auth Login Card */}
        <main className="flex-grow flex items-center justify-center my-6">
          <div className="max-w-md w-full bg-[#131313]/90 backdrop-blur-xl border-2 border-[#333333] rounded overflow-hidden relative shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
            
            {/* Top Indicator Strip matching current theme color */}
            <div 
              style={{ backgroundColor: activeTheme.primary }} 
              className="h-1.5 w-full transition-colors duration-300" 
            />
            
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-[#d0c6ab]">
                    SECURITY PROTOCOL
                  </h2>
                  <h3 
                    style={{ color: activeTheme.textPrimary }}
                    className="text-lg md:text-xl font-extrabold uppercase tracking-tight transition-colors duration-300"
                  >
                    AUTHENTICATION
                  </h3>
                </div>
                <div 
                  style={{ borderColor: activeTheme.primary + "30", color: activeTheme.primary }}
                  className="px-2 py-0.5 bg-[#1b1c1c] rounded text-[10px] border uppercase transition-all duration-300"
                >
                  SECURE-LINK
                </div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Access Tier Select input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-[#d0c6ab] font-bold tracking-wider block">
                    Access / Command Tier
                  </label>
                  <select
                    value={accessTier}
                    onChange={(e) => setAccessTier(e.target.value)}
                    className="w-full bg-[#1b1c1c] text-[#e4e2e1] border-2 border-[#333333] focus:border-[#ffd700] focus:ring-0 rounded p-3 text-xs uppercase cursor-pointer"
                  >
                    <option value="supervisor">Mine Supervisor</option>
                    <option value="officer">Safety Officer</option>
                    <option value="admin">Systems Administrator</option>
                  </select>
                </div>

                {/* Operator ID input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-[#d0c6ab] font-bold tracking-wider block">
                    User Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-[#d0c6ab]/70">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={operatorId}
                      onChange={(e) => setOperatorId(e.target.value)}
                      className="w-full pl-10 bg-[#1b1c1c] text-[#e4e2e1] border-2 border-[#333333] focus:border-[#ffd700] focus:ring-0 rounded p-3 text-xs"
                      placeholder="Username / Operator Code"
                    />
                  </div>
                </div>

                {/* Secure Password input instead of Secure Protocol Key */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-[#d0c6ab] font-bold tracking-wider block">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center text-[#d0c6ab]/70">
                      <Key className="w-4 h-4" style={{ color: activeTheme.primary }} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 bg-[#1b1c1c] text-[#e4e2e1] border-2 border-[#333333] focus:border-[#ffd700] focus:ring-0 rounded p-3 text-xs tracking-widest font-sans"
                      placeholder="••••••••"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-[#d0c6ab] hover:text-white focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me & Forgot Password instead of Forgot Protocol */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      checked={persistentSession}
                      onChange={(e) => setPersistentSession(e.target.checked)}
                      style={{ accentColor: activeTheme.primary }}
                      className="w-4 h-4 bg-[#1b1c1c] border-2 border-[#333333] rounded focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[10px] uppercase text-[#d0c6ab] group-hover:text-[#e4e2e1] transition-colors">
                      Remember Session
                    </span>
                  </label>
                  <button
                    onClick={() => {
                      alert("Please contact the Geotechnical Division System Administrator to verify RF-CO-KEY sequence parameters.");
                    }}
                    type="button"
                    style={{ color: activeTheme.textPrimary }}
                    className="text-[10px] uppercase font-bold hover:underline bg-transparent border-none p-0 cursor-pointer transition-colors duration-200"
                  >
                    Forgot Password
                  </button>
                </div>

                {/* Login button instead of Initialize Link */}
                <button
                  type="submit"
                  disabled={isConnecting}
                  style={{
                    backgroundColor: activeTheme.primary,
                    boxShadow: `0 4px 15px ${activeTheme.glowColor}`
                  }}
                  className="w-full text-[#131313] hover:brightness-110 font-bold py-3.5 rounded flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  <span className="uppercase text-xs tracking-widest font-black">
                    {isConnecting ? "ESTABLISHING CONTEXT..." : "LOGIN"}
                  </span>
                  <Lock className="w-4 h-4 font-bold" />
                </button>
              </form>

              {/* Status Indicator Feedback */}
              <div className="mt-5 p-3 rounded bg-[#1b1c1c] border border-[#333333] flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus === "ERROR" ? "bg-red-500" :
                    connectionStatus === "AUTHENTICATING" ? "bg-amber-400 animate-pulse" :
                    connectionStatus === "CONNECTED" ? "bg-green-400 animate-ping" : "bg-[#555] animate-pulse"
                  }`} />
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-bold ${
                  connectionStatus === "ERROR" ? "text-red-400" :
                  connectionStatus === "CONNECTED" ? "text-green-400" : "text-[#d0c6ab]"
                }`}>
                  {statusMessage}
                </span>
              </div>

            </div>

            {/* Minor System parameter read-only metadata section in the base of the card */}
            <div className="bg-[#1b1c1c] border-t-2 border-[#333333] p-4 flex flex-col gap-2 rounded-b">
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[#e4e2e1] uppercase font-bold tracking-tight">Active link channels status: OK</span>
                </div>
                <span className="text-[#d0c6ab] uppercase">GMT: {timeStr}</span>
              </div>
            </div>

          </div>
        </main>

        {/* Simplified high-fidelity minimal footer as requested */}
        <footer className="w-full border-t border-[#333333]/40 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[#d0c6ab]">
          <div className="uppercase">
            © 2026 ROCKFALL INDUSTRIAL SAFETY SYSTEMS | SECURE LOGIN
          </div>
          <div className="flex items-center gap-4">
            <span className="uppercase">AI-Powered Risk Assessment</span>
            <span>•</span>
            <span className="uppercase text-[#ffd700]">Build 1.0.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
