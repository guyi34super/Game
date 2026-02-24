"use client";

import { useGameStore } from "@/lib/store";
import { Research } from "@/engine/types";

const CATEGORY_COLORS: Record<Research["category"], string> = {
  detection: "#00d4ff",
  prevention: "#00ff41",
  response: "#f97316",
  ai: "#a855f7",
};

const CATEGORY_ICONS: Record<Research["category"], string> = {
  detection: "🔍",
  prevention: "🛡️",
  response: "🚨",
  ai: "🤖",
};

export default function ResearchPanel() {
  const { research, startResearch, company } = useGameStore();

  const canResearch = (r: Research) => {
    if (r.unlocked || r.researching) return false;
    if (company.securityBudget < r.cost) return false;
    return r.prerequisites.every((p) => research.find((x) => x.id === p)?.unlocked);
  };

  const categories = ["prevention", "detection", "response", "ai"] as const;

  return (
    <div className="card-cyber p-4">
      <h3 className="text-xs text-cyber-dim uppercase tracking-wider mb-4">🔬 Research Lab</h3>

      <div className="space-y-5">
        {categories.map((cat) => {
          const items = research.filter((r) => r.category === cat);
          return (
            <div key={cat}>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1"
                style={{ color: CATEGORY_COLORS[cat] }}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </h4>
              <div className="space-y-2">
                {items.map((r) => {
                  const prereqsMet = r.prerequisites.every(
                    (p) => research.find((x) => x.id === p)?.unlocked
                  );
                  return (
                    <div
                      key={r.id}
                      className={`p-3 rounded border transition-all ${
                        r.unlocked
                          ? "border-neon-green/20 bg-neon-green/5"
                          : r.researching
                          ? "border-neon-yellow/30 bg-neon-yellow/5"
                          : prereqsMet
                          ? "border-cyber-border bg-cyber-dark/30 hover:border-cyber-border/80"
                          : "border-cyber-border/30 bg-cyber-dark/10 opacity-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-cyber-text">{r.name}</span>
                            {r.unlocked && <span className="text-[9px] text-neon-green">✓ COMPLETE</span>}
                            {r.researching && <span className="text-[9px] text-neon-yellow animate-pulse">RESEARCHING...</span>}
                          </div>
                          <p className="text-[10px] text-cyber-dim mt-0.5">{r.description}</p>
                          {r.prerequisites.length > 0 && !prereqsMet && (
                            <p className="text-[10px] text-neon-red/60 mt-1">
                              Requires: {r.prerequisites.map((p) => research.find((x) => x.id === p)?.name).join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {!r.unlocked && !r.researching && (
                            <>
                              <div className="text-[10px] text-neon-yellow font-mono">${r.cost.toLocaleString()}</div>
                              <div className="text-[10px] text-cyber-dim">{r.duration} ticks</div>
                            </>
                          )}
                        </div>
                      </div>

                      {r.researching && (
                        <div className="mt-2">
                          <div className="h-1.5 rounded-full bg-cyber-border overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-neon-yellow to-neon-green transition-all"
                              style={{ width: `${(r.progress / r.duration) * 100}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-cyber-dim mt-1 text-right">
                            {r.progress}/{r.duration}
                          </div>
                        </div>
                      )}

                      {!r.unlocked && !r.researching && prereqsMet && (
                        <button
                          onClick={() => startResearch(r.id)}
                          disabled={!canResearch(r)}
                          className="btn-cyber text-[10px] px-3 py-1 mt-2"
                        >
                          Start Research
                        </button>
                      )}

                      {r.unlocked && r.effect && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {Object.entries(r.effect).map(([key, val]) => (
                            <span key={key} className="text-[9px] px-1.5 py-0.5 bg-neon-green/10 text-neon-green rounded">
                              {key}: +{val}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
