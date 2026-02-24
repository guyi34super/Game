"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Building2, Swords, FlaskConical, BarChart3 } from "lucide-react";

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

export default function HomePage() {
  const router = useRouter();
  const [showSubtext, setShowSubtext] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
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

  return (
    <div className="min-h-screen bg-cyber-black grid-pattern flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl" />
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
        <div className="z-10 flex flex-col items-center px-4">
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
                setTimeout(() => setShowButtons(true), 300);
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

          {showButtons && (
            <div className="flex flex-col sm:flex-row gap-4 animate-[fadeIn_0.5s_ease-in]">
              <button
                onClick={() => router.push("/game")}
                className="btn-cyber text-lg px-8 py-3 font-semibold tracking-wider"
              >
                &gt; START SIMULATION
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("about");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-cyber text-lg px-8 py-3 font-semibold tracking-wider text-neon-blue border-neon-blue/40"
              >
                ? HOW TO PLAY
              </button>
            </div>
          )}
        </div>
      )}

      {!booting && (
        <div id="about" className="z-10 mt-32 max-w-4xl mx-4 pb-20">
          <h2 className="text-2xl font-bold text-neon-green mb-8 text-center">
            // HOW TO PLAY
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {([
              {
                icon: <Building2 size={28} />,
                title: "Manage Your Company",
                desc: "Oversee network infrastructure, employees, and security budget. Every decision impacts your defenses.",
              },
              {
                icon: <Swords size={28} />,
                title: "Respond to Attacks",
                desc: "Face phishing, ransomware, zero-days, and more. Choose how to respond under time pressure.",
              },
              {
                icon: <FlaskConical size={28} />,
                title: "Research & Upgrade",
                desc: "Invest in AI detection, firewalls, encryption, and employee training through the research tree.",
              },
              {
                icon: <BarChart3 size={28} />,
                title: "Monitor Everything",
                desc: "Track live traffic, vulnerability heatmaps, employee risk scores, and financial impact in real-time.",
              },
            ] as { icon: ReactNode; title: string; desc: string }[]).map((item) => (
              <div key={item.title} className="card-cyber p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-neon-green font-semibold mb-1">{item.title}</h3>
                <p className="text-cyber-dim text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4 text-cyber-dim/30 text-xs z-10">
        ZeroDay v2.0.1 | Simulation Engine Active
      </div>
    </div>
  );
}
