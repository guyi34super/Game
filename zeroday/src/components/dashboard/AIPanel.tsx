"use client";

import { useState, useCallback } from "react";
import { useGameStore } from "@/lib/store";
import { Bot } from "lucide-react";

type RiskFactor = { factor: string; impact: number; recommendation: string };

type AIAnalysis = {
  overall_risk: number;
  risk_level: string;
  threat_probability: number;
  recommended_actions: string[];
  risk_factors: RiskFactor[];
} | null;

type AnomalyInfo = {
  node_id: string;
  anomaly_score: number;
  is_anomaly: boolean;
  risk_level: string;
  details: string;
};

function computeLocalRisk(company: {
  securityMaturity: number;
  patchLevel: number;
  employeeAwareness: number;
  aiDetectionLevel: number;
  firewallStrength: number;
}): AIAnalysis {
  let risk = 0;
  const factors: RiskFactor[] = [];
  const actions: string[] = [];

  if (company.securityMaturity < 40) {
    risk += 0.2;
    factors.push({ factor: "Low security maturity", impact: 0.2, recommendation: "Invest in security research" });
  }
  if (company.patchLevel < 50) {
    risk += 0.2;
    factors.push({ factor: "Critical patch gap", impact: 0.2, recommendation: "Patch vulnerable systems" });
  }
  if (company.employeeAwareness < 40) {
    risk += 0.15;
    factors.push({ factor: "Low employee awareness", impact: 0.15, recommendation: "Deploy training" });
  }
  if (company.aiDetectionLevel < 30) {
    risk += 0.1;
    factors.push({ factor: "Weak AI detection", impact: 0.1, recommendation: "Research AI detection" });
  }
  if (company.firewallStrength < 40) {
    risk += 0.1;
    factors.push({ factor: "Weak firewall", impact: 0.1, recommendation: "Upgrade firewall rules" });
  }

  risk = Math.min(1, risk);
  for (const f of factors.slice(0, 3)) actions.push(f.recommendation);
  if (!actions.length) actions.push("Security posture is healthy");

  const level = risk > 0.7 ? "critical" : risk > 0.5 ? "high" : risk > 0.3 ? "medium" : "low";
  return {
    overall_risk: risk,
    risk_level: level,
    threat_probability: Math.min(1, risk * 1.2),
    recommended_actions: actions,
    risk_factors: factors,
  };
}

function computeLocalAnomalies(network: { id: string; traffic: number; vulnerabilities: number; patchLevel: number; status: string }[]): AnomalyInfo[] {
  return network.map((n) => {
    let score = 0;
    if (n.traffic > 80) score += 0.3;
    if (n.vulnerabilities > 3) score += 0.3;
    if (n.patchLevel < 40) score += 0.2;
    if (n.status === "compromised") score += 0.4;
    score = Math.min(1, score);
    const level = score > 0.7 ? "critical" : score > 0.5 ? "high" : score > 0.3 ? "medium" : "low";
    return {
      node_id: n.id,
      anomaly_score: score,
      is_anomaly: score > 0.4,
      risk_level: level,
      details: [
        n.traffic > 80 ? "high traffic" : "",
        n.vulnerabilities > 3 ? `${n.vulnerabilities} vulns` : "",
        n.patchLevel < 40 ? "low patch" : "",
        n.status === "compromised" ? "compromised" : "",
      ].filter(Boolean).join("; ") || "nominal",
    };
  });
}

const RISK_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

export default function AIPanel() {
  const { company, network, employees } = useGameStore();
  const [analysis, setAnalysis] = useState<AIAnalysis>(null);
  const [anomalies, setAnomalies] = useState<AnomalyInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"online" | "offline">("offline");

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/game/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "risk",
          data: {
            company_stats: company,
            traffic_anomalies: [],
            behavior_results: [],
          },
        }),
      });
      const data = await res.json();
      if (data.fallback) {
        setMode("offline");
        setAnalysis(computeLocalRisk(company));
        setAnomalies(computeLocalAnomalies(network));
      } else {
        setMode("online");
        setAnalysis(data);
      }
    } catch {
      setMode("offline");
      setAnalysis(computeLocalRisk(company));
      setAnomalies(computeLocalAnomalies(network));
    }
    setLoading(false);
  }, [company, network, employees]);

  return (
    <div className="card-cyber p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs text-cyber-dim uppercase tracking-wider flex items-center gap-2">
          <Bot size={14} /> AI Threat Analysis
          <span className={`text-[9px] px-1.5 py-0.5 rounded ${mode === "online" ? "bg-neon-green/10 text-neon-green" : "bg-neon-yellow/10 text-neon-yellow"}`}>
            {mode === "online" ? "ML Engine" : "Heuristic"}
          </span>
        </h3>
        <button
          onClick={runAnalysis}
          disabled={loading}
          className="btn-cyber text-[10px] px-3 py-1"
        >
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>
      </div>

      {!analysis ? (
        <div className="text-center py-6 text-cyber-dim text-sm">
          <div className="text-3xl mb-2"><Bot size={32} /></div>
          <p>Click &quot;Run Analysis&quot; to scan your systems</p>
          <p className="text-[10px] mt-1">AI engine will assess threats, anomalies, and risk factors</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[10px] text-cyber-dim uppercase mb-1">Overall Risk</div>
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 rounded-full bg-cyber-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${analysis.overall_risk * 100}%`,
                      background: RISK_COLORS[analysis.risk_level],
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold font-mono"
                  style={{ color: RISK_COLORS[analysis.risk_level] }}
                >
                  {(analysis.overall_risk * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-lg font-bold uppercase px-3 py-1 rounded border"
                style={{
                  color: RISK_COLORS[analysis.risk_level],
                  borderColor: `${RISK_COLORS[analysis.risk_level]}40`,
                  background: `${RISK_COLORS[analysis.risk_level]}10`,
                }}
              >
                {analysis.risk_level}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-cyber-dim uppercase mb-1">
              Attack Probability: <span className="text-neon-yellow font-bold">{(analysis.threat_probability * 100).toFixed(0)}%</span>
            </div>
          </div>

          {analysis.risk_factors.length > 0 && (
            <div>
              <div className="text-[10px] text-cyber-dim uppercase mb-2">Risk Factors</div>
              <div className="space-y-1.5">
                {analysis.risk_factors.map((rf, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: rf.impact > 0.15 ? "#ef4444" : rf.impact > 0.1 ? "#f97316" : "#eab308" }}
                    />
                    <span className="text-cyber-text">{rf.factor}</span>
                    <span className="text-cyber-dim ml-auto">({(rf.impact * 100).toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-[10px] text-cyber-dim uppercase mb-2">Recommended Actions</div>
            <div className="space-y-1">
              {analysis.recommended_actions.map((action, i) => (
                <div key={i} className="text-[11px] text-neon-green flex items-start gap-2">
                  <span className="shrink-0">→</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {anomalies.length > 0 && anomalies.some((a) => a.is_anomaly) && (
            <div>
              <div className="text-[10px] text-cyber-dim uppercase mb-2">Network Anomalies</div>
              <div className="space-y-1">
                {anomalies
                  .filter((a) => a.is_anomaly)
                  .map((a) => (
                    <div key={a.node_id} className="text-[11px] flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: RISK_COLORS[a.risk_level] }}
                      />
                      <span className="text-cyber-text">{a.details}</span>
                      <span className="ml-auto font-mono" style={{ color: RISK_COLORS[a.risk_level] }}>
                        {(a.anomaly_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
