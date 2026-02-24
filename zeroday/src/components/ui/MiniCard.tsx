"use client";

import { ReactNode } from "react";

type MiniCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
  trend?: "up" | "down" | "neutral";
};

export default function MiniCard({ title, value, subtitle, icon, color = "#00ff41", trend }: MiniCardProps) {
  return (
    <div className="card-cyber p-3 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-cyber-dim uppercase tracking-wider">{title}</span>
        {icon && <span className="text-lg flex items-center">{icon}</span>}
      </div>
      <div className="text-xl font-bold font-mono" style={{ color }}>
        {value}
        {trend && (
          <span className={`text-xs ml-1 ${trend === "up" ? "text-neon-green" : trend === "down" ? "text-neon-red" : "text-cyber-dim"}`}>
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "─"}
          </span>
        )}
      </div>
      {subtitle && <span className="text-[10px] text-cyber-dim">{subtitle}</span>}
    </div>
  );
}
