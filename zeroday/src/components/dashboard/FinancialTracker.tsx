"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/store";
import * as d3 from "d3";
import { Coins } from "lucide-react";

export default function FinancialTracker() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { company, stats, tick } = useGameStore();
  const [history, setHistory] = useState<number[][]>([]);

  useEffect(() => {
    setHistory((prev) => {
      const next = [...prev, [tick, company.securityBudget]];
      return next.slice(-80);
    });
  }, [tick, company.securityBudget]);

  useEffect(() => {
    if (!svgRef.current || history.length < 2) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 80;
    svg.selectAll("*").remove();

    const x = d3.scaleLinear().domain([history[0][0], history[history.length - 1][0]]).range([0, width]);
    const maxBudget = Math.max(...history.map((h) => h[1]), 50000);
    const y = d3.scaleLinear().domain([0, maxBudget]).range([height - 5, 5]);

    const area = d3.area<number[]>()
      .x((d) => x(d[0]))
      .y0(height)
      .y1((d) => y(d[1]))
      .curve(d3.curveMonotoneX);

    const line = d3.line<number[]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(d3.curveMonotoneX);

    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id", "fin-grad").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#ffd700").attr("stop-opacity", 0.2);
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#ffd700").attr("stop-opacity", 0);

    svg.append("path").datum(history).attr("fill", "url(#fin-grad)").attr("d", area);
    svg.append("path").datum(history).attr("fill", "none").attr("stroke", "#ffd700").attr("stroke-width", 1.5).attr("d", line);
  }, [history]);

  const netFlow = company.income - (stats.moneySpent + stats.moneyLost) / Math.max(1, tick / 24);

  return (
    <div className="card-cyber p-4">
      <h3 className="text-xs text-cyber-dim uppercase tracking-wider mb-2 flex items-center gap-2"><Coins size={14} /> Financial Impact</h3>
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div>
          <div className="text-[10px] text-cyber-dim">Budget</div>
          <div className="text-sm font-bold text-neon-yellow font-mono">${company.securityBudget.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[10px] text-cyber-dim">Spent</div>
          <div className="text-sm font-bold text-neon-blue font-mono">${stats.moneySpent.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-[10px] text-cyber-dim">Lost</div>
          <div className="text-sm font-bold text-neon-red font-mono">${stats.moneyLost.toLocaleString()}</div>
        </div>
      </div>
      <div className="text-[10px] text-cyber-dim mb-1 flex justify-between">
        <span>Budget Over Time</span>
        <span className={netFlow >= 0 ? "text-neon-green" : "text-neon-red"}>
          {netFlow >= 0 ? "+" : ""}{netFlow.toFixed(0)}/day avg
        </span>
      </div>
      <svg ref={svgRef} className="w-full" style={{ height: "80px" }} />
    </div>
  );
}
