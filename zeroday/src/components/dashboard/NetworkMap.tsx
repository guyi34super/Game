"use client";

import { useEffect, useRef, memo, useCallback } from "react";
import { useGameStore } from "@/lib/store";
import { select } from "d3-selection";
import "d3-transition";
import { NetworkNode } from "@/engine/types";
import { Globe } from "lucide-react";

const NODE_COLORS: Record<NetworkNode["type"], string> = {
  server: "#00d4ff",
  workstation: "#a855f7",
  firewall: "#ff8c00",
  router: "#ffd700",
  database: "#00ff41",
  cloud: "#00d4ff",
};

const svgIcon = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const NODE_ICON_SVGS: Record<NetworkNode["type"], string> = {
  server: svgIcon('<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>'),
  workstation: svgIcon('<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>'),
  firewall: svgIcon('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
  router: svgIcon('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
  database: svgIcon('<path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>'),
  cloud: svgIcon('<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>'),
};

const STATUS_COLORS: Record<NetworkNode["status"], string> = {
  online: "#00ff41",
  offline: "#8b949e",
  compromised: "#ff3e3e",
  patching: "#ffd700",
};

export default memo(function NetworkMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const network = useGameStore((s) => s.network);
  const patchNode = useGameStore((s) => s.patchNode);

  const handlePatch = useCallback((id: string) => patchNode(id), [patchNode]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = select(svgRef.current);
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
      const el = select(this);
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
          handlePatch(d.id);
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

    g.each(function (d) {
      const fo = select(this).append("foreignObject")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", -10)
        .attr("y", -10)
        .attr("class", "pointer-events-none");
      fo.append("xhtml:div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("color", NODE_COLORS[d.type])
        .html(NODE_ICON_SVGS[d.type]);
    });

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

  }, [network, handlePatch]);

  return (
    <div className="card-cyber p-4">
      <h3 className="text-xs text-cyber-dim uppercase tracking-wider mb-3 flex items-center gap-2">
        <Globe size={14} /> Network Topology
        <span className="text-[10px] text-neon-green/50">(click nodes to patch)</span>
      </h3>
      <svg ref={svgRef} className="w-full" style={{ height: "350px" }} />
    </div>
  );
});
