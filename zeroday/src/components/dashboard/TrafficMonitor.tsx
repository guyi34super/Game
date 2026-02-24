"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/lib/store";
import * as d3 from "d3";
import { Radio } from "lucide-react";

export default function TrafficMonitor() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { network, tick } = useGameStore();
  const [history, setHistory] = useState<number[][]>([]);

  useEffect(() => {
    const totalTraffic = network.reduce((sum, n) => sum + n.traffic, 0) / network.length;
    setHistory((prev) => {
      const next = [...prev, [tick, totalTraffic]];
      return next.slice(-60);
    });
  }, [tick, network]);

  useEffect(() => {
    if (!svgRef.current || history.length < 2) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 100;
    svg.selectAll("*").remove();

    const x = d3
      .scaleLinear()
      .domain([history[0][0], history[history.length - 1][0]])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .range([height - 5, 5]);

    const area = d3
      .area<number[]>()
      .x((d) => x(d[0]))
      .y0(height)
      .y1((d) => y(d[1]))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<number[]>()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(d3.curveMonotoneX);

    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "traffic-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#00ff41").attr("stop-opacity", 0.3);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#00ff41").attr("stop-opacity", 0);

    svg.append("path").datum(history).attr("fill", "url(#traffic-gradient)").attr("d", area);
    svg.append("path").datum(history).attr("fill", "none").attr("stroke", "#00ff41").attr("stroke-width", 1.5).attr("d", line);

    const lastPoint = history[history.length - 1];
    svg.append("circle").attr("cx", x(lastPoint[0])).attr("cy", y(lastPoint[1])).attr("r", 3).attr("fill", "#00ff41");

  }, [history]);

  const avgTraffic = network.reduce((s, n) => s + n.traffic, 0) / network.length;

  return (
    <div className="card-cyber p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs text-cyber-dim uppercase tracking-wider flex items-center gap-2"><Radio size={14} /> Live Traffic Monitor</h3>
        <span className={`text-xs font-mono ${avgTraffic > 70 ? "text-neon-red" : avgTraffic > 40 ? "text-neon-yellow" : "text-neon-green"}`}>
          {avgTraffic.toFixed(1)}% avg
        </span>
      </div>
      <svg ref={svgRef} className="w-full" style={{ height: "100px" }} />
    </div>
  );
}
