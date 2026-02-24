"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store";
import * as d3 from "d3";
import { getSeverityColor } from "@/engine/attacks";
import { BarChart3 } from "lucide-react";

export default function ThreatTimeline() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { events, tick } = useGameStore();

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = 120;
    svg.selectAll("*").remove();

    const recentEvents = events.filter((e) => e.timestamp > tick - 100);
    if (recentEvents.length === 0) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#8b949e")
        .attr("font-size", "11px")
        .attr("font-family", "JetBrains Mono, monospace")
        .text("No recent threat activity");
      return;
    }

    const x = d3
      .scaleLinear()
      .domain([Math.max(0, tick - 100), tick])
      .range([30, width - 10]);

    const severityY: Record<string, number> = {
      critical: 20,
      high: 45,
      medium: 70,
      low: 95,
    };

    svg
      .append("g")
      .selectAll("text")
      .data(["critical", "high", "medium", "low"])
      .enter()
      .append("text")
      .attr("x", 2)
      .attr("y", (d) => severityY[d] + 4)
      .attr("font-size", "7px")
      .attr("fill", (d) => getSeverityColor(d as "critical" | "high" | "medium" | "low"))
      .attr("font-family", "JetBrains Mono, monospace")
      .text((d) => d.charAt(0).toUpperCase());

    recentEvents.forEach((event) => {
      const cx = x(event.timestamp);
      const cy = severityY[event.severity] || 70;

      svg
        .append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", event.resolved ? 3 : 5)
        .attr("fill", event.resolved ? `${getSeverityColor(event.severity)}40` : getSeverityColor(event.severity))
        .attr("stroke", getSeverityColor(event.severity))
        .attr("stroke-width", event.resolved ? 0.5 : 1)
        .attr("opacity", event.resolved ? 0.5 : 1);

      if (!event.resolved) {
        svg
          .append("circle")
          .attr("cx", cx)
          .attr("cy", cy)
          .attr("r", 8)
          .attr("fill", "none")
          .attr("stroke", getSeverityColor(event.severity))
          .attr("stroke-width", 0.5)
          .attr("opacity", 0.4)
          .attr("stroke-dasharray", "2,2");
      }
    });

  }, [events, tick]);

  return (
    <div className="card-cyber p-4">
      <h3 className="text-xs text-cyber-dim uppercase tracking-wider mb-2 flex items-center gap-2"><BarChart3 size={14} /> Threat Timeline</h3>
      <svg ref={svgRef} className="w-full" style={{ height: "120px" }} />
    </div>
  );
}
