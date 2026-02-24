"use client";

import { useGameStore } from "@/lib/store";

export default function TopBar() {
  const { day, hour, paused, gameSpeed, gameOver, company, stats, togglePause, setSpeed } = useGameStore();

  const timeStr = `Day ${day} - ${String(hour % 24).padStart(2, "0")}:00`;

  return (
    <div className="bg-cyber-dark border-b border-cyber-border px-4 py-2 flex items-center justify-between gap-4 text-sm flex-wrap">
      <div className="flex items-center gap-4">
        <span className="text-neon-green font-bold tracking-wider text-base">
          ZERO<span className="text-neon-blue">DAY</span>
        </span>
        <span className="text-cyber-dim font-mono">{timeStr}</span>
        {gameOver && <span className="text-neon-red font-bold animate-pulse">GAME OVER</span>}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-cyber-dim text-xs">BUDGET</span>
          <span className="text-neon-green font-mono font-bold">${company.securityBudget.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyber-dim text-xs">REP</span>
          <span className={`font-mono font-bold ${company.reputation > 50 ? "text-neon-green" : company.reputation > 25 ? "text-neon-yellow" : "text-neon-red"}`}>
            {company.reputation}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-cyber-dim text-xs">SCORE</span>
          <span className="text-neon-blue font-mono font-bold">{stats.score.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1 border-l border-cyber-border pl-3">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 text-xs rounded ${gameSpeed === s ? "bg-neon-green/20 text-neon-green border border-neon-green/40" : "text-cyber-dim hover:text-cyber-text"}`}
            >
              {s}x
            </button>
          ))}
          <button
            onClick={togglePause}
            className={`ml-1 px-2 py-0.5 text-xs rounded ${paused ? "bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40" : "bg-neon-red/20 text-neon-red border border-neon-red/40"}`}
          >
            {paused ? "▶ PLAY" : "⏸ PAUSE"}
          </button>
        </div>
      </div>
    </div>
  );
}
