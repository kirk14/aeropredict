import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Activity, Cpu, Gauge, Search, AlertTriangle, CheckCircle,
  TrendingDown, Zap, Target, Terminal, Crosshair, Wifi
} from "lucide-react";
import RadialOrbitalTimeline from "./components/ui/radial-orbital-timeline";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: any;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

// --- DECORATIVE COMPONENT: SCROLLING LOGS ---
const SystemLogs = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const messages = [
      "INITIALIZING SENSOR ARRAY...",
      "CALIBRATING PRESSURE NODES...",
      "CONNECTION ESTABLISHED: PORT 8000",
      "FETCHING TELEMETRY DATA...",
      "ANALYZING VIBRATION PATTERNS...",
      "RUL PREDICTION ALGORITHM: ACTIVE",
      "SAFETY BUFFER: 20% APPLIED",
      "RENDERING DIGITAL TWIN...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs(prev => [...prev.slice(-5), `> ${messages[i]} [OK]`]);
        i++;
      } else {
        // Random "Keep Alive" logs
        if (Math.random() > 0.7) {
          setLogs(prev => [...prev.slice(-5), `> SYNCING... ${(Math.random() * 100).toFixed(2)}ms`]);
        }
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:block absolute bottom-8 left-8 font-mono text-[10px] text-blue-400/60 leading-tight">
      <div className="border-l-2 border-blue-500/30 pl-3">
        <h3 className="text-blue-300 font-bold mb-1 flex items-center gap-2">
          <Terminal size={10} /> SYSTEM LOGS
        </h3>
        {logs.map((log, index) => (
          <div key={index} className="opacity-70">{log}</div>
        ))}
        <div className="animate-blink mt-1">_</div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
function App() {
  const [engineId, setEngineId] = useState<string>("5");
  const [timelineData, setTimelineData] = useState<TimelineItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [rmse, setRmse] = useState<number>(0);

  const fetchEngineData = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/analyze/${id}`);
      const data = response.data;
      setRmse(data.rmse);
      const status = data.status;

      const orbitalData: TimelineItem[] = [
        {
          id: 1,
          title: "Engine Identity",
          date: `ID: ${data.engine_id}`,
          content: `Current Age: ${data.current_cycle} Flight Cycles. | Health Score: ${data.health_score}%.`,
          category: "Identity",
          icon: Cpu,
          relatedIds: [2, 3, 4, 5],
          status: status,
          energy: data.health_score,
        },
        {
          id: 2,
          title: "RUL Forecast",
          date: "AI Prediction",
          content: `Safety-Adjusted RUL: ${data.rul} Cycles. | Raw AI Model Output: ${data.raw_rul_prediction} Cycles.`,
          category: "Prediction",
          icon: Zap,
          relatedIds: [1, 3],
          status: status === "completed" ? "completed" : "in-progress",
          energy: 90,
        },
        {
          id: 3,
          title: "Model Accuracy",
          date: "Global RMSE",
          content: `Global Model Accuracy (RMSE): ${data.rmse}. (Lower is better; <20 is Top Tier).`,
          category: "Metrics",
          icon: Target,
          relatedIds: [2],
          status: "in-progress",
          energy: 100,
        },
        {
          id: 4,
          title: "Pressure Sensor",
          date: "Sensor S11",
          content: `Turbine Pressure: ${data.sensors.s11_pressure.toFixed(2)} psi. | Monitoring for compression leaks.`,
          category: "Sensors",
          icon: Activity,
          relatedIds: [1],
          status: status === "completed" ? "completed" : "in-progress",
          energy: 85,
        },
        {
          id: 5,
          title: "Fan Velocity",
          date: "Sensor S14",
          content: `Fan Rotation Speed: ${data.sensors.s14_speed.toFixed(2)} rpm. | Monitoring for drag/friction.`,
          category: "Sensors",
          icon: Gauge,
          relatedIds: [1],
          status: status === "pending" ? "pending" : "in-progress",
          energy: 70,
        }
      ];
      setTimelineData(orbitalData);
    } catch (error) {
      console.error("Failed to fetch", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEngineData(engineId);
  }, []);

  return (
    <div className="w-full h-screen bg-[#050505] overflow-hidden relative font-sans selection:bg-blue-500/30">

      {/* 1. BACKGROUND GRID (The Foundation) */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.03] pointer-events-none"></div>

      {/* 2. SCANNING LINE (The Movement) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[20%] animate-scan pointer-events-none z-0"></div>

      {/* 3. VIGNETTE (The Depth) */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black opacity-80 pointer-events-none"></div>

      {/* 4. DECORATIVE HUD CORNERS (The Frame) */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-white/10 rounded-tl-3xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-white/10 rounded-tr-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-white/10 rounded-bl-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-white/10 rounded-br-3xl pointer-events-none"></div>

      {/* HEADER */}
      <div className="absolute top-8 left-8 z-50 pointer-events-none">
        <h1 className="text-6xl font-bold text-white tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
          AERO<span className="text-blue-500">PREDICT</span>
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="bg-blue-600/20 border border-blue-500/50 text-blue-300 text-[10px] px-2 py-0.5 rounded font-mono tracking-widest uppercase backdrop-blur-md">
            NASA CMAPSS v2.0
          </span>
          <span className="text-white/30 text-xs tracking-widest uppercase font-mono">
            // DIGITAL TWIN CONNECTED
          </span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute top-8 right-8 z-50 flex flex-col items-end gap-3">
        {/* Search Bar */}
        <div className="flex gap-2 bg-black/60 backdrop-blur-xl p-1.5 rounded-lg border border-white/10 shadow-2xl ring-1 ring-white/5">
          <input
            type="number"
            value={engineId}
            onChange={(e) => setEngineId(e.target.value)}
            className="bg-transparent text-white px-3 py-2 outline-none w-20 text-right font-mono border-r border-white/10 placeholder-white/20"
            placeholder="#"
          />
          <button
            onClick={() => fetchEngineData(engineId)}
            className="bg-white hover:bg-blue-50 text-black px-6 py-2 rounded-md transition-all flex items-center font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
          >
            {loading ? <Activity className="animate-spin w-4 h-4 mr-2" /> : <Search className="w-4 h-4 mr-2" />}
            ANALYZE
          </button>
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm">
            <Wifi className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span className="text-white/40 text-[10px] font-mono">LATENCY: 12ms</span>
          </div>

          {rmse > 0 && (
            <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-md backdrop-blur-sm">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs font-mono font-bold tracking-wider">
                RMSE: {rmse.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CENTER DECORATIONS (Behind the Orbital) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none animate-spin-slow"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-dashed border-white/10 rounded-full pointer-events-none animate-spin-reverse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <Crosshair size={400} strokeWidth={0.5} className="text-white" />
      </div>

      {/* MAIN VISUALIZATION */}
      {timelineData && (
        <RadialOrbitalTimeline timelineData={timelineData} />
      )}

      {/* LEFT SIDE: SCROLLING LOGS */}
      <SystemLogs />

      {/* FOOTER */}
      <div className="absolute bottom-5 w-full flex justify-center items-center gap-8 text-white/20 text-[10px] tracking-[0.2em] pointer-events-none font-mono">
        <span>PREDICTIVE MAINTENANCE</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>LIVE SENSOR FEED</span>
        <span className="w-1 h-1 bg-white/20 rounded-full"></span>
        <span>SAFETY BUFFER: ACTIVE</span>
      </div>
    </div>
  );
}

export default App;