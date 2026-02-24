"use client";

type StatBarProps = {
  label: string;
  value: number;
  max: number;
  color?: string;
  showValue?: boolean;
  size?: "sm" | "md";
};

export default function StatBar({ label, value, max, color = "#00ff41", showValue = true, size = "md" }: StatBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const height = size === "sm" ? "h-1.5" : "h-2";

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-cyber-dim">{label}</span>
        {showValue && (
          <span className="text-xs font-mono" style={{ color }}>
            {Math.round(value)}/{max}
          </span>
        )}
      </div>
      <div className={`${height} rounded-full bg-cyber-border overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  );
}
