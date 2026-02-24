"use client";

import { useRef, useEffect } from "react";
import { useGameStore } from "@/lib/store";
import { GameLog } from "@/engine/types";

const LOG_COLORS: Record<GameLog["type"], string> = {
  info: "#8b949e",
  warning: "#ffd700",
  danger: "#ff3e3e",
  success: "#00ff41",
  critical: "#ff3e3e",
};

const LOG_PREFIX: Record<GameLog["type"], string> = {
  info: "[INFO]",
  warning: "[WARN]",
  danger: "[DANGER]",
  success: "[OK]",
  critical: "[CRITICAL]",
};

export default function LogPanel() {
  const { logs } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length]);

  return (
    <div className="card-cyber p-4">
      <h3 className="text-xs text-cyber-dim uppercase tracking-wider mb-3">📋 System Logs</h3>
      <div
        ref={scrollRef}
        className="bg-cyber-black rounded p-3 max-h-[300px] overflow-y-auto terminal-text"
      >
        {logs.length === 0 ? (
          <div className="text-cyber-dim text-[11px]">No log entries yet...</div>
        ) : (
          logs.slice(-100).map((log) => (
            <div key={log.id} className="flex gap-2 text-[11px] leading-relaxed hover:bg-cyber-border/10">
              <span className="text-cyber-dim shrink-0 w-12 text-right">t{log.timestamp}</span>
              <span className="font-bold shrink-0 w-20" style={{ color: LOG_COLORS[log.type] }}>
                {LOG_PREFIX[log.type]}
              </span>
              <span className="text-cyber-dim shrink-0">[{log.source}]</span>
              <span style={{ color: LOG_COLORS[log.type] }}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
