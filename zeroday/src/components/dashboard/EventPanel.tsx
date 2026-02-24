"use client";

import { useGameStore } from "@/lib/store";
import { getAttackIcon, getSeverityColor } from "@/engine/attacks";
import { SecurityEvent } from "@/engine/types";
import { AlertTriangle, Shield, Check, X } from "lucide-react";

function EventCard({ event }: { event: SecurityEvent }) {
  const { handleEvent, tick } = useGameStore();
  const timeLeft = Math.max(0, event.expiresAt - tick);
  const urgency = timeLeft / 20;

  return (
    <div
      className={`card-cyber p-4 border-l-4 transition-all ${
        event.resolved ? "opacity-50" : urgency < 0.3 ? "animate-pulse" : ""
      }`}
      style={{ borderLeftColor: getSeverityColor(event.severity) }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {(() => { const Icon = getAttackIcon(event.type); return <Icon size={20} />; })()}
          <div>
            <h4 className="text-sm font-semibold text-cyber-text">{event.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                style={{
                  color: getSeverityColor(event.severity),
                  background: `${getSeverityColor(event.severity)}15`,
                  border: `1px solid ${getSeverityColor(event.severity)}40`,
                }}
              >
                {event.severity}
              </span>
              <span className="text-[10px] text-cyber-dim">{event.source}</span>
            </div>
          </div>
        </div>
        {!event.resolved && (
          <div className="text-right shrink-0">
            <div className={`text-xs font-mono ${timeLeft < 5 ? "text-neon-red animate-pulse" : "text-neon-yellow"}`}>
              {timeLeft}t left
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-cyber-dim mb-3">{event.description}</p>

      {event.resolved ? (
        <div className={`text-xs ${event.outcome === "success" ? "text-neon-green" : "text-neon-red"}`}>
          {event.outcome === "success" ? <><Check size={12} className="inline" /> Resolved</> : event.outcome === "failed" ? <><X size={12} className="inline" /> Response Failed</> : <><X size={12} className="inline" /> Expired</>}{" "}
          {event.chosenAction && ` via "${event.chosenAction}"`}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleEvent(event.id, choice.id)}
              className="text-left p-2 rounded border border-cyber-border bg-cyber-dark/50 hover:border-neon-green/30 hover:bg-neon-green/5 transition-all group"
            >
              <div className="text-xs font-semibold text-cyber-text group-hover:text-neon-green">
                {choice.label}
              </div>
              <div className="text-[10px] text-cyber-dim mt-0.5">{choice.description}</div>
              <div className="flex gap-2 mt-1 text-[10px]">
                {choice.moneyCost > 0 && <span className="text-neon-yellow">-${choice.moneyCost.toLocaleString()}</span>}
                {choice.timeCost > 0 && <span className="text-neon-blue">{choice.timeCost}t</span>}
                <span className={choice.successRate > 0.8 ? "text-neon-green" : choice.successRate > 0.6 ? "text-neon-yellow" : "text-neon-red"}>
                  {Math.round(choice.successRate * 100)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EventPanel() {
  const { events } = useGameStore();
  const activeEvents = events.filter((e) => !e.resolved);
  const recentResolved = events.filter((e) => e.resolved).slice(-5).reverse();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-neon-red uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle size={14} className={activeEvents.length > 0 ? "animate-pulse" : ""} />
          Active Threats ({activeEvents.length})
        </h2>
      </div>

      {activeEvents.length === 0 ? (
        <div className="card-cyber p-6 text-center">
          <div className="text-2xl mb-2"><Shield size={28} /></div>
          <p className="text-cyber-dim text-sm">No active threats. Systems nominal.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {activeEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {recentResolved.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs text-cyber-dim uppercase tracking-wider mb-2">Recent Incidents</h3>
          <div className="space-y-2">
            {recentResolved.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
