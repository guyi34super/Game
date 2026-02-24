"use client";

import { useGameStore } from "@/lib/store";
import MiniCard from "@/components/ui/MiniCard";
import StatBar from "@/components/ui/StatBar";
import { AlertTriangle, ShieldCheck, Skull, DollarSign } from "lucide-react";

export default function StatsOverview() {
  const { company, stats, events } = useGameStore();
  const activeThreats = events.filter((e) => !e.resolved).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MiniCard
          title="Active Threats"
          value={activeThreats}
          icon={<AlertTriangle size={18} />}
          color={activeThreats > 3 ? "#ff3e3e" : activeThreats > 0 ? "#ffd700" : "#00ff41"}
        />
        <MiniCard title="Attacks Blocked" value={stats.attacksBlocked} icon={<ShieldCheck size={18} />} color="#00ff41" />
        <MiniCard title="Attacks Succeeded" value={stats.attacksSucceeded} icon={<Skull size={18} />} color="#ff3e3e" />
        <MiniCard
          title="Money Lost"
          value={`$${stats.moneyLost.toLocaleString()}`}
          icon={<DollarSign size={18} />}
          color="#f97316"
        />
      </div>

      <div className="card-cyber p-4 space-y-3">
        <h3 className="text-xs text-cyber-dim uppercase tracking-wider mb-3">Security Posture</h3>
        <StatBar label="Security Maturity" value={company.securityMaturity} max={100} color="#00ff41" />
        <StatBar label="Employee Awareness" value={company.employeeAwareness} max={100} color="#00d4ff" />
        <StatBar label="Patch Level" value={company.patchLevel} max={100} color="#a855f7" />
        <StatBar label="AI Detection" value={company.aiDetectionLevel} max={100} color="#ffd700" />
        <StatBar label="Firewall Strength" value={company.firewallStrength} max={100} color="#f97316" />
        <StatBar label="Data Encryption" value={company.dataEncryption} max={100} color="#00d4ff" />
        <StatBar label="Threat Intelligence" value={company.threatIntelligence} max={100} color="#a855f7" />
      </div>
    </div>
  );
}
