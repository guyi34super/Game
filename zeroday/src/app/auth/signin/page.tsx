"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Chrome, Apple, Github, User, Terminal, Lock, Wifi } from "lucide-react";

const MATRIX_CHARS = "01";

function MatrixRain() {
  const [columns, setColumns] = useState<{ chars: string[]; x: number; speed: number }[]>([]);

  useEffect(() => {
    const cols = Array.from({ length: 30 }, (_, i) => ({
      chars: Array.from({ length: 15 + Math.floor(Math.random() * 10) }, () =>
        MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      ),
      x: (i / 30) * 100,
      speed: 15 + Math.random() * 25,
    }));
    setColumns(cols);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {columns.map((col, i) => (
        <div
          key={i}
          className="absolute text-neon-green text-xs font-mono leading-tight animate-matrix-fall"
          style={{
            left: `${col.x}%`,
            animationDuration: `${col.speed}s`,
            animationDelay: `${Math.random() * -20}s`,
          }}
        >
          {col.chars.map((c, j) => (
            <div key={j} style={{ opacity: j / col.chars.length }}>{c}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

const AUTH_PROVIDERS = [
  {
    id: "google",
    name: "Google",
    icon: Chrome,
    color: "neon-blue",
    borderColor: "border-neon-blue/40",
    bgColor: "bg-neon-blue/10",
    hoverBg: "hover:bg-neon-blue/20",
    hoverBorder: "hover:border-neon-blue/70",
    textColor: "text-neon-blue",
    shadowColor: "hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]",
  },
  {
    id: "apple",
    name: "Apple",
    icon: Apple,
    color: "cyber-text",
    borderColor: "border-cyber-text/30",
    bgColor: "bg-cyber-text/5",
    hoverBg: "hover:bg-cyber-text/15",
    hoverBorder: "hover:border-cyber-text/60",
    textColor: "text-cyber-text",
    shadowColor: "hover:shadow-[0_0_20px_rgba(201,209,217,0.1)]",
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    color: "neon-purple",
    borderColor: "border-neon-purple/40",
    bgColor: "bg-neon-purple/10",
    hoverBg: "hover:bg-neon-purple/20",
    hoverBorder: "hover:border-neon-purple/70",
    textColor: "text-neon-purple",
    shadowColor: "hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  },
];

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [bootComplete, setBootComplete] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

  const BOOT_LINES = [
    "[AUTH] Initializing secure authentication module...",
    "[CRYPTO] Loading encryption protocols... OK",
    "[NET] Establishing secure OAuth channels...",
    "[READY] Authentication gateway online.",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i];
        setBootLines((prev) => [...prev, line]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setBootComplete(true), 400);
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const handleProviderSignIn = async (providerId: string) => {
    setLoading(providerId);
    try {
      await signIn(providerId, { callbackUrl: "/" });
    } catch {
      setLoading(null);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading("guest");
    try {
      const result = await signIn("guest", { redirect: false });
      if (result?.ok) {
        router.push("/");
      }
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black grid-pattern flex items-center justify-center relative overflow-hidden">
      <MatrixRain />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {!bootComplete ? (
        <div className="card-cyber p-6 max-w-md w-full mx-4 terminal-text z-10">
          <div className="text-neon-green/80 mb-2 text-xs">root@zeroday-auth:~$</div>
          {bootLines.map((line, i) => (
            <div
              key={i}
              className={`${
                line.includes("OK") || line.includes("READY")
                  ? "text-neon-green"
                  : "text-cyber-dim"
              } text-xs leading-relaxed`}
            >
              {line}
            </div>
          ))}
          <div className="text-neon-green animate-pulse mt-1 text-xs">_</div>
        </div>
      ) : (
        <div className="z-10 w-full max-w-md mx-4 animate-[fadeIn_0.5s_ease-in]">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield size={48} className="text-neon-green" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-neon-green rounded-full animate-pulse" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-1">
              <span className="text-neon-green glow-green">ZERO</span>
              <span className="text-neon-blue glow-blue">DAY</span>
            </h1>
            <p className="text-cyber-dim text-xs tracking-[0.2em] uppercase">
              Secure Authentication Required
            </p>
          </div>

          <div className="card-cyber p-6 mb-4">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-cyber-border">
              <Lock size={14} className="text-neon-green" />
              <span className="text-xs text-neon-green font-semibold tracking-wider uppercase">
                Sign In to Continue
              </span>
            </div>

            <div className="space-y-3">
              {AUTH_PROVIDERS.map((provider) => {
                const Icon = provider.icon;
                const isLoading = loading === provider.id;
                return (
                  <button
                    key={provider.id}
                    onClick={() => handleProviderSignIn(provider.id)}
                    disabled={loading !== null}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 ${provider.borderColor} ${provider.bgColor} ${provider.hoverBg} ${provider.hoverBorder} ${provider.shadowColor} disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    <Icon size={20} className={provider.textColor} />
                    <span className={`font-semibold text-sm ${provider.textColor}`}>
                      {isLoading ? "Connecting..." : `Continue with ${provider.name}`}
                    </span>
                    {isLoading && (
                      <div className="ml-auto w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-cyber-border" />
              <span className="text-cyber-dim text-xs">OR</span>
              <div className="flex-1 h-px bg-cyber-border" />
            </div>

            <button
              onClick={handleGuestSignIn}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-neon-green/30 bg-neon-green/5 hover:bg-neon-green/15 hover:border-neon-green/60 hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <User size={20} className="text-neon-green" />
              <span className="font-semibold text-sm text-neon-green">
                {loading === "guest" ? "Initializing..." : "Continue as Guest"}
              </span>
              {loading === "guest" && (
                <div className="ml-auto w-4 h-4 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
              )}
            </button>
          </div>

          <div className="card-cyber p-4">
            <div className="flex items-start gap-3">
              <Terminal size={14} className="text-neon-green mt-0.5 shrink-0" />
              <div className="text-[11px] text-cyber-dim leading-relaxed">
                <p className="mb-1">
                  Sign in to save your progress, track high scores, and sync across devices.
                </p>
                <p>
                  Guest mode lets you play immediately &mdash; no account required.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-cyber-dim/50">
            <div className="flex items-center gap-1">
              <Lock size={10} />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Wifi size={10} />
              <span>Protected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
