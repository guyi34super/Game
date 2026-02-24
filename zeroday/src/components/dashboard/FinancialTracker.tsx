"use client";

import { useEffect, useRef, useState, memo, useMemo } from "react";
import { useGameStore } from "@/lib/store";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { area, line, curveMonotoneX } from "d3-shape";
import { Coins } from "lucide-react";

export default memo(function FinancialTracker() {
  const svgRef = useRef<SVGSVGElement>(null);
  const company = useGameStore((s) => s.company);
  const stats = useGameStore((s) => s.stats);
  const tick = useGameStore((s) => s.tick);
  const [history, setHistory] = useState<number[][]>([]);

  useEffect(() => {
    setHistory((prev) => {
      const next = [...prev, [tick, company.securityBudget]];
      return next.length > 80 ? next.slice(-80) : next;
    });
  }, [tick, company.securityBudget]);

  useEffect(() => {
    if (!svgRef.current || history.length < 2) return;
    const svg = select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 80;
    svg.selectAll("*").remove();

    const x = scaleLinear().domain([history[0][0], history[history.length - 1][0]]).range([0, width]);
    let maxBudget = 50000;
    for (let i = 0; i < history.length; i++) {
      if (history[i][1] > maxBudget) maxBudget = history[i][1];
    }
    const y = scaleLinear().domain([0, maxBudget]).range([height - 5, 5]);

    const areaGen = area<number[]>().x((d) => x(d[0])).y0(height).y1((d) => y(d[1])).curve(curveMonotoneX);
    const lineGen = line<number[]>().x((d) => x(d[0])).y((d) => y(d[1])).curve(curveMonotoneX);

    const defs = svg.append("defs");
    const grad = defs.append("linearGradient").attr("id", "fin-grad").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
    grad.append("stop").attr("offset", "0%").attr("stop-color", "#ffd700").attr("stop-opacity", 0.2);
    grad.append("stop").attr("offset", "100%").attr("stop-color", "#ffd700").attr("stop-opacity", 0);

    svg.append("path").datum(history).attr("fill", "url(#fin-grad)").attr("d", areaGen);
    svg.append("path").datum(history).attr("fill", "none").attr("stroke", "#ffd700").attr("stroke-width", 1.5).attr("d", lineGen);
  }, [history]);

  const netFlow = useMemo(
    () => company.income - (stats.moneySpent + stats.moneyLost) / Math.max(1, tick / 24),
    [company.income, stats.moneySpent, stats.moneyLost, tick]
  );

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
});
