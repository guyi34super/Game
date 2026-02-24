"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/lib/store";
import * as d3 from "d3";
import { NetworkNode } from "@/engine/types";

const NODE_COLORS: Record<NetworkNode["type"], string> = {
  server: "#00d4ff",
  workstation: "#a855f7",
  firewall: "#ff8c00",
  router: "#ffd700",
  database: "#00ff41",
  cloud: "#00d4ff",
};

const NODE_ICONS: Record<NetworkNode["type"], string> = {
  server: "🖥️",
  workstation: "💻",
  firewall: "🔥",
  router: "🌐",
  database: "🗄️",
  cloud: "☁️",
};

const STATUS_COLORS: Record<NetworkNode["status"], string> = {
  online: "#00ff41",
  offline: "#8b949e",
  compromised: "#ff3e3e",
  patching: "#ffd700",
};

export default function NetworkMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { network, patchNode } = useGameStore();

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    svg.selectAll("*").remove();

    const defs = svg.append("defs");
    const glow = defs.append("filter").attr("id", "glow");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur");
    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    const nodes = network.map((node, i) => {
      const angle = (i / network.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.35;
      return {
        ...node,
        x: width / 2 + Math.cos(angle) * radius * (0.7 + Math.random() * 0.3),
        y: height / 2 + Math.sin(angle) * radius * (0.7 + Math.random() * 0.3),
      };
    });

    const links: { source: number; target: number }[] = [];
    const firewallIdx = nodes.findIndex((n) => n.type === "firewall");
    const routerIdx = nodes.findIndex((n) => n.type === "router");

    if (firewallIdx >= 0 && routerIdx >= 0) {
      links.push({ source: firewallIdx, target: routerIdx });
    }

    nodes.forEach((node, i) => {
      if (i !== firewallIdx && i !== routerIdx) {
        const connectTo = routerIdx >= 0 ? routerIdx : firewallIdx >= 0 ? firewallIdx : 0;
        if (i !== connectTo) links.push({ source: connectTo, target: i });
      }
    });

    svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", (d) => nodes[d.source].x)
      .attr("y1", (d) => nodes[d.source].y)
      .attr("x2", (d) => nodes[d.target].x)
      .attr("y2", (d) => nodes[d.target].y)
      .attr("stroke", "#21262d")
      .attr("stroke-width", 1)
      .attr("opacity", 0.6);

    const packets = svg
      .selectAll(".packet")
      .data(links.filter(() => Math.random() > 0.5))
      .enter()
      .append("circle")
      .attr("r", 2)
      .attr("fill", "#00ff41")
      .attr("filter", "url(#glow)")
      .attr("opacity", 0.8);

    packets.each(function (d) {
      const el = d3.select(this);
      function animate() {
        el.attr("cx", nodes[d.source].x)
          .attr("cy", nodes[d.source].y)
          .transition()
          .duration(1500 + Math.random() * 2000)
          .attr("cx", nodes[d.target].x)
          .attr("cy", nodes[d.target].y)
          .on("end", function () {
            el.attr("cx", nodes[d.target].x)
              .attr("cy", nodes[d.target].y)
              .transition()
              .duration(1500 + Math.random() * 2000)
              .attr("cx", nodes[d.source].x)
              .attr("cy", nodes[d.source].y)
              .on("end", animate);
          });
      }
      animate();
    });

    const g = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")
      .on("click", (_, d) => {
        if (d.vulnerabilities > 0 && d.status !== "patching") {
          patchNode(d.id);
        }
      });

    g.append("circle")
      .attr("r", 24)
      .attr("fill", (d) => `${NODE_COLORS[d.type]}15`)
      .attr("stroke", (d) => STATUS_COLORS[d.status])
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)");

    g.append("circle")
      .attr("r", 28)
      .attr("fill", "none")
      .attr("stroke", (d) => STATUS_COLORS[d.status])
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.3)
      .attr("stroke-dasharray", "3,3");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "16px")
      .text((d) => NODE_ICONS[d.type]);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 38)
      .attr("font-size", "9px")
      .attr("fill", "#c9d1d9")
      .attr("font-family", "JetBrains Mono, monospace")
      .text((d) => d.name);

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 49)
      .attr("font-size", "8px")
      .attr("fill", (d) => (d.vulnerabilities > 2 ? "#ff3e3e" : d.vulnerabilities > 0 ? "#ffd700" : "#00ff41"))
      .text((d) => (d.status === "patching" ? "PATCHING..." : `${d.vulnerabilities} vulns`));

  }, [network, patchNode]);

  return (
    <div className="card-cyber p-4">
      <h3 className="text-xs text-cyber-dim uppercase tracking-wider mb-3 flex items-center gap-2">
        🌐 Network Topology
        <span className="text-[10px] text-neon-green/50">(click nodes to patch)</span>
      </h3>
      <svg ref={svgRef} className="w-full" style={{ height: "350px" }} />
    </div>
  );
}
