"use client";

import { memo, useMemo, useCallback } from "react";
import { useGameStore } from "@/lib/store";
import { Users } from "lucide-react";

export default memo(function EmployeePanel() {
  const employees = useGameStore((s) => s.employees);
  const company = useGameStore((s) => s.company);
  const trainEmployee = useGameStore((s) => s.trainEmployee);
  const hireEmployee = useGameStore((s) => s.hireEmployee);

  const sorted = useMemo(
    () => [...employees].sort((a, b) => b.riskScore - a.riskScore),
    [employees]
  );

  const avgRisk = useMemo(
    () => employees.reduce((s, e) => s + e.riskScore, 0) / employees.length,
    [employees]
  );

  const trainedCount = useMemo(
    () => employees.filter((e) => e.trained).length,
    [employees]
  );

  const canHire = company.securityBudget >= 3000;
  const canTrain = company.securityBudget >= 1000;

  const handleHire = useCallback(() => hireEmployee(), [hireEmployee]);

  return (
    <div className="card-cyber p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs text-cyber-dim uppercase tracking-wider flex items-center gap-2"><Users size={14} /> Employees ({employees.length})</h3>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-cyber-dim">Avg Risk: <span className={`font-bold ${avgRisk > 40 ? "text-neon-red" : avgRisk > 20 ? "text-neon-yellow" : "text-neon-green"}`}>{avgRisk.toFixed(1)}</span></span>
          <span className="text-cyber-dim">Trained: <span className="text-neon-blue font-bold">{trainedCount}/{employees.length}</span></span>
        </div>
      </div>

      <div className="mb-3">
        <button onClick={handleHire} disabled={!canHire} className="btn-cyber text-xs px-3 py-1">
          + Hire Employee ($3,000)
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto space-y-1.5 pr-1">
        {sorted.map((emp) => (
          <div
            key={emp.id}
            className="flex items-center justify-between p-2 rounded bg-cyber-dark/30 border border-cyber-border/50 hover:border-cyber-border transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-cyber-text truncate">{emp.name}</span>
                {emp.trained && <span className="text-[9px] px-1 py-0 bg-neon-green/10 text-neon-green rounded">TRAINED</span>}
                {emp.compromised && <span className="text-[9px] px-1 py-0 bg-neon-red/10 text-neon-red rounded">COMPROMISED</span>}
              </div>
              <div className="text-[10px] text-cyber-dim">{emp.role} - {emp.department}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className={`text-[10px] font-mono ${emp.riskScore > 50 ? "text-neon-red" : emp.riskScore > 25 ? "text-neon-yellow" : "text-neon-green"}`}>
                  Risk: {emp.riskScore.toFixed(0)}
                </div>
                <div className="text-[10px] text-cyber-dim font-mono">
                  Aware: {emp.awarenessScore.toFixed(0)}
                </div>
              </div>
              {!emp.trained && (
                <button
                  onClick={() => trainEmployee(emp.id)}
                  disabled={!canTrain}
                  className="text-[10px] px-2 py-1 btn-cyber"
                >
                  Train
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
