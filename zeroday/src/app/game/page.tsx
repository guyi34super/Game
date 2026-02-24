"use client";

import { useEffect, useState, useCallback, ReactNode } from "react";
import { useGameStore } from "@/lib/store";
import { LayoutDashboard, Globe, Users, FlaskConical, ClipboardList } from "lucide-react";
import TopBar from "@/components/dashboard/TopBar";
import StatsOverview from "@/components/dashboard/StatsOverview";
import EventPanel from "@/components/dashboard/EventPanel";
import NetworkMap from "@/components/dashboard/NetworkMap";
import ThreatTimeline from "@/components/dashboard/ThreatTimeline";
import TrafficMonitor from "@/components/dashboard/TrafficMonitor";
import EmployeePanel from "@/components/dashboard/EmployeePanel";
import ResearchPanel from "@/components/dashboard/ResearchPanel";
import LogPanel from "@/components/dashboard/LogPanel";
import VulnerabilityHeatmap from "@/components/dashboard/VulnerabilityHeatmap";
import GameOverScreen from "@/components/game/GameOverScreen";
import AIPanel from "@/components/dashboard/AIPanel";
import FinancialTracker from "@/components/dashboard/FinancialTracker";

type Tab = "overview" | "network" | "employees" | "research" | "logs";

const TABS: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
  { id: "network", label: "Network", icon: <Globe size={14} /> },
  { id: "employees", label: "Employees", icon: <Users size={14} /> },
  { id: "research", label: "Research", icon: <FlaskConical size={14} /> },
  { id: "logs", label: "Logs", icon: <ClipboardList size={14} /> },
];

export default function GamePage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [initialized, setInitialized] = useState(false);
  const { doTick, gameSpeed, paused, gameOver, init, events } = useGameStore();

  const activeThreats = events.filter((e) => !e.resolved).length;

  useEffect(() => {
    if (!initialized) {
      init();
      setInitialized(true);
    }
  }, [init, initialized]);

  const tickFn = useCallback(() => {
    doTick();
  }, [doTick]);

  useEffect(() => {
    if (!initialized) return;
    const interval = setInterval(tickFn, 1000 / gameSpeed);
    return () => clearInterval(interval);
  }, [tickFn, gameSpeed, initialized]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-neon-green animate-pulse text-lg font-mono">
          Initializing simulation...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black grid-pattern flex flex-col">
      {gameOver && <GameOverScreen />}
      <TopBar />

      <div className="flex border-b border-cyber-border bg-cyber-dark/50">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs font-mono transition-all flex items-center gap-1.5 border-b-2 ${
              tab === t.id
                ? "border-neon-green text-neon-green bg-neon-green/5"
                : "border-transparent text-cyber-dim hover:text-cyber-text hover:bg-cyber-border/10"
            }`}
          >
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
            {t.id === "overview" && activeThreats > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-neon-red/20 text-neon-red rounded-full animate-pulse">
                {activeThreats}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 space-y-4">
              <StatsOverview />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <EventPanel />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <AIPanel />
              <FinancialTracker />
              <TrafficMonitor />
              <ThreatTimeline />
              <VulnerabilityHeatmap />
            </div>
          </div>
        )}

        {tab === "network" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <NetworkMap />
            <div className="space-y-4">
              <TrafficMonitor />
              <VulnerabilityHeatmap />
              <ThreatTimeline />
            </div>
          </div>
        )}

        {tab === "employees" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EmployeePanel />
            <div className="space-y-4">
              <StatsOverview />
            </div>
          </div>
        )}

        {tab === "research" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ResearchPanel />
            <div className="space-y-4">
              <StatsOverview />
              <LogPanel />
            </div>
          </div>
        )}

        {tab === "logs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <LogPanel />
            </div>
            <div className="space-y-4">
              <TrafficMonitor />
              <ThreatTimeline />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
