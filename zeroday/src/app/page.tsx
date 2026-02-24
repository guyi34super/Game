"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useGameStore } from "@/lib/store";
import {
  Building2,
  Swords,
  FlaskConical,
  BarChart3,
  Shield,
  Zap,
  Brain,
  LogIn,
  LogOut,
  User,
  ChevronRight,
  BookOpen,
  Gauge,
} from "lucide-react";
import { Difficulty, DIFFICULTY_CONFIGS } from "@/engine/types";
import { isValidImageUrl } from "@/lib/security/sanitize-client";

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

function GlitchText({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        setIsGlitching(true);
        const glitched = text
          .split("")
          .map((c) => (Math.random() < 0.3 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c))
          .join("");
        setDisplay(glitched);
        setTimeout(() => {
          setDisplay(text);
          setIsGlitching(false);
        }, 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={`${className} ${isGlitching ? "opacity-80" : ""}`}>{display}</span>;
}

function TypeWriter({ text, speed = 50, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx < text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev + text[idx]);
        setIdx(idx + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      onDone?.();
    }
  }, [idx, text, speed, onDone]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse">_</span>
    </span>
  );
}

const DIFFICULTY_ICONS: Record<Difficulty, ReactNode> = {
  easy: <Shield size={20} />,
  medium: <Gauge size={20} />,
  hard: <Zap size={20} />,
};

const DIFFICULTY_COLORS: Record<Difficulty, { text: string; border: string; bg: string; glow: string }> = {
  easy: {
    text: "text-neon-green",
    border: "border-neon-green/40",
    bg: "bg-neon-green/10",
    glow: "hover:shadow-[0_0_20px_rgba(0,255,65,0.15)]",
  },
  medium: {
    text: "text-neon-yellow",
    border: "border-neon-yellow/40",
    bg: "bg-neon-yellow/10",
    glow: "hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]",
  },
  hard: {
    text: "text-neon-red",
    border: "border-neon-red/40",
    bg: "bg-neon-red/10",
    glow: "hover:shadow-[0_0_20px_rgba(255,62,62,0.15)]",
  },
};

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const initGame = useGameStore((s) => s.init);
  const [showSubtext, setShowSubtext] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [booting, setBooting] = useState(true);

  const BOOT_SEQUENCE = [
    "[SYSTEM] Initializing ZeroDay v2.0.1...",
    "[KERNEL] Loading cybersecurity simulation engine...",
    "[NET] Establishing encrypted channels... OK",
    "[AI] Neural threat detection model loaded",
    "[DB] Vulnerability database synced (142,891 entries)",
    "[SIM] Attack engine initialized",
    "[AUTH] Security clearance verified",
    "[READY] System online. Awaiting operator.",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_SEQUENCE.length) {
        const line = BOOT_SEQUENCE[i];
        setBootLines((prev) => [...prev, line]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 500);
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handleStartGame = () => {
    initGame(selectedDifficulty);
    if (status !== "authenticated") {
      router.push("/auth/signin?callbackUrl=/game");
      return;
    }
    router.push("/game");
  };

  const isAuthenticated = status === "authenticated";
  const userName = session?.user?.name || "Operator";

  return (
    <div className="min-h-screen bg-cyber-black grid-pattern flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl" />
      </div>

      {/* Session Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-cyber-dark/80 backdrop-blur border-b border-cyber-border px-4 py-2 flex items-center justify-between">
        <span className="text-neon-green font-bold tracking-wider text-sm">
          ZERO<span className="text-neon-blue">DAY</span>
        </span>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-neon-green/20 border border-neon-green/40 flex items-center justify-center">
                  {session?.user?.image && isValidImageUrl(session.user.image) ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-6 h-6 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User size={12} className="text-neon-green" />
                  )}
                </div>
                <span className="text-cyber-text hidden sm:inline">{userName}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1 text-[11px] text-cyber-dim hover:text-neon-red transition-colors px-2 py-1 rounded border border-transparent hover:border-neon-red/30"
              >
                <LogOut size={12} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/auth/signin")}
              className="flex items-center gap-1.5 text-xs text-neon-green hover:text-neon-green/80 transition-colors px-3 py-1.5 rounded border border-neon-green/30 hover:border-neon-green/60 bg-neon-green/5 hover:bg-neon-green/10"
            >
              <LogIn size={12} />
              Sign In
            </button>
          )}
        </div>
      </div>

      {booting ? (
        <div className="card-cyber p-6 max-w-xl w-full mx-4 terminal-text z-10">
          <div className="text-neon-green/80 mb-2 text-xs">root@zeroday:~$</div>
          {bootLines.map((line, i) => (
            <div
              key={i}
              className={`${
                line.includes("OK") || line.includes("READY")
                  ? "text-neon-green"
                  : line.includes("ERROR")
                  ? "text-neon-red"
                  : "text-cyber-dim"
              } text-xs leading-relaxed`}
            >
              {line}
            </div>
          ))}
          <div className="text-neon-green animate-pulse mt-1 text-xs">_</div>
        </div>
      ) : (
        <div className="z-10 flex flex-col items-center px-4 mt-16">
          <div className="mb-2 text-neon-green/40 text-sm tracking-[0.3em] uppercase">
            [ Cyber War Simulator ]
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
            <GlitchText text="ZERO" className="text-neon-green glow-green" />
            <GlitchText text="DAY" className="text-neon-blue glow-blue" />
          </h1>

          <div className="text-cyber-dim text-sm md:text-base mb-8 max-w-lg text-center">
            <TypeWriter
              text="Defend your company against relentless cyber threats. Detect anomalies. Patch vulnerabilities. Survive."
              speed={25}
              onDone={() => {
                setShowSubtext(true);
                setTimeout(() => setShowContent(true), 300);
              }}
            />
          </div>

          {showSubtext && (
            <div className="flex flex-wrap gap-3 justify-center mb-10 text-xs">
              {["Phishing", "Ransomware", "Zero-Days", "DDoS", "Insider Threats", "Social Engineering"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 border border-neon-green/20 rounded-full text-neon-green/60 bg-neon-green/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {showContent && (
            <div className="w-full max-w-2xl space-y-6 animate-[fadeIn_0.5s_ease-in]">
              {/* Difficulty Selector */}
              <div className="card-cyber p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Gauge size={16} className="text-neon-green" />
                  <span className="text-xs text-neon-green font-semibold tracking-wider uppercase">
                    Select Difficulty
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => {
                    const config = DIFFICULTY_CONFIGS[diff];
                    const colors = DIFFICULTY_COLORS[diff];
                    const isSelected = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                          isSelected
                            ? `${colors.border} ${colors.bg} ${colors.glow} ring-1 ring-current/20`
                            : "border-cyber-border bg-cyber-dark/50 hover:border-cyber-dim/50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={isSelected ? colors.text : "text-cyber-dim"}>
                            {DIFFICULTY_ICONS[diff]}
                          </span>
                          <span
                            className={`font-bold text-sm uppercase tracking-wider ${
                              isSelected ? colors.text : "text-cyber-dim"
                            }`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            isSelected ? "text-cyber-text" : "text-cyber-dim/70"
                          }`}
                        >
                          {config.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleStartGame}
                  className="btn-cyber text-lg px-8 py-3 font-semibold tracking-wider flex items-center justify-center gap-2"
                >
                  &gt; START SIMULATION
                  <ChevronRight size={18} />
                </button>
                <button
                  onClick={() => router.push("/how-to-play")}
                  className="btn-cyber text-lg px-8 py-3 font-semibold tracking-wider text-neon-blue border-neon-blue/40 flex items-center justify-center gap-2"
                >
                  <BookOpen size={18} />
                  HOW TO PLAY
                </button>
              </div>

              {/* Quick How-to-Play Summary */}
              <div className="card-cyber p-5">
                <h2 className="text-sm font-bold text-neon-green mb-4 tracking-wider uppercase flex items-center gap-2">
                  <Brain size={16} />
                  Quick Start Guide
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {([
                    {
                      icon: <Building2 size={22} />,
                      title: "Manage Your Company",
                      desc: "Oversee network infrastructure, employees, and security budget. Every decision impacts your defenses.",
                    },
                    {
                      icon: <Swords size={22} />,
                      title: "Respond to Attacks",
                      desc: "Face phishing, ransomware, zero-days, and more. Choose how to respond under time pressure.",
                    },
                    {
                      icon: <FlaskConical size={22} />,
                      title: "Research & Upgrade",
                      desc: "Invest in AI detection, firewalls, encryption, and employee training through the research tree.",
                    },
                    {
                      icon: <BarChart3 size={22} />,
                      title: "Monitor Everything",
                      desc: "Track live traffic, vulnerability heatmaps, employee risk scores, and financial impact in real-time.",
                    },
                  ] as { icon: ReactNode; title: string; desc: string }[]).map((item) => (
                    <div key={item.title} className="card-cyber p-4 flex gap-3">
                      <div className="text-neon-green shrink-0">{item.icon}</div>
                      <div>
                        <h3 className="text-neon-green font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-cyber-dim text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <button
                    onClick={() => router.push("/how-to-play")}
                    className="text-xs text-neon-blue hover:text-neon-blue/80 transition-colors inline-flex items-center gap-1"
                  >
                    View full operations manual
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="fixed bottom-4 left-4 text-cyber-dim/30 text-xs z-10">
        ZeroDay v2.0.1 | Simulation Engine Active
      </div>
    </div>
  );
}
