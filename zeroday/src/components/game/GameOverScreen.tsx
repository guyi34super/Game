"use client";

import { useGameStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Skull } from "lucide-react";

export default function GameOverScreen() {
  const { gameOverReason, stats, day, company, init } = useGameStore();
  const router = useRouter();

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="card-cyber p-8 max-w-lg w-full text-center border-neon-red/30">
        <div className="text-6xl mb-4 flex justify-center"><Skull size={64} /></div>
        <h1 className="text-3xl font-bold text-neon-red glow-red mb-2">SYSTEM BREACH</h1>
        <h2 className="text-lg text-neon-red/70 mb-6">GAME OVER</h2>

        <p className="text-cyber-dim text-sm mb-6">{gameOverReason}</p>

        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="card-cyber p-3">
            <div className="text-[10px] text-cyber-dim uppercase">Days Survived</div>
            <div className="text-xl font-bold text-neon-blue font-mono">{day}</div>
          </div>
          <div className="card-cyber p-3">
            <div className="text-[10px] text-cyber-dim uppercase">Final Score</div>
            <div className="text-xl font-bold text-neon-green font-mono">{stats.score.toLocaleString()}</div>
          </div>
          <div className="card-cyber p-3">
            <div className="text-[10px] text-cyber-dim uppercase">Attacks Blocked</div>
            <div className="text-xl font-bold text-neon-green font-mono">{stats.attacksBlocked}</div>
          </div>
          <div className="card-cyber p-3">
            <div className="text-[10px] text-cyber-dim uppercase">Attacks Succeeded</div>
            <div className="text-xl font-bold text-neon-red font-mono">{stats.attacksSucceeded}</div>
          </div>
          <div className="card-cyber p-3">
            <div className="text-[10px] text-cyber-dim uppercase">Money Spent</div>
            <div className="text-lg font-bold text-neon-yellow font-mono">${stats.moneySpent.toLocaleString()}</div>
          </div>
          <div className="card-cyber p-3">
            <div className="text-[10px] text-cyber-dim uppercase">Money Lost</div>
            <div className="text-lg font-bold text-neon-red font-mono">${stats.moneyLost.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              init();
            }}
            className="btn-cyber text-base px-6 py-2"
          >
            ↻ RETRY
          </button>
          <button
            onClick={() => router.push("/")}
            className="btn-cyber btn-danger text-base px-6 py-2"
          >
            ← MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}
