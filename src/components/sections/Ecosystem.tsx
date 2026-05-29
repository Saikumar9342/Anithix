"use client";

import { useState, useRef } from "react";
import { PRODUCTS } from "@/lib/constants";

const ECOSYSTEM_NODES = PRODUCTS.map((p, i) => {
  const angles = [0, 60, 120, 180, 240, 300];
  const radii = [220, 200, 220, 200, 220, 200];
  const angle = (angles[i] * Math.PI) / 180;
  return {
    ...p,
    x: Math.cos(angle) * radii[i],
    y: Math.sin(angle) * radii[i],
  };
});

export function Ecosystem() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className="section"
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        {/* Header */}
        <div className="section-head reveal in">
          <div className="eyebrow reveal in reveal-d1">
            <span className="idx">02</span>The Ecosystem
          </div>

          <h2 className="h-sec reveal in reveal-d2">
            One ecosystem.{"\n"}Infinite possibilities.
          </h2>

          <p className="lede reveal in reveal-d3">
            Every Anithix product is part of a living, intelligent network
            designed to work together seamlessly.
          </p>
        </div>

        {/* Network visualization */}
        <div
          className="relative flex items-center justify-center reveal in reveal-d4"
          style={{ height: "600px" }}
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: "visible" }}
          >
            <defs>
              <filter id="glow-2">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {ECOSYSTEM_NODES.map((node) => {
              const isHovered = hoveredNode === node.id;
              const cx = "50%";
              const cy = "50%";
              const nx = `calc(50% + ${node.x}px)`;
              const ny = `calc(50% + ${node.y}px)`;

              return (
                <g key={node.id}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={nx}
                    y2={ny}
                    stroke={
                      isHovered
                        ? "var(--accent)"
                        : "rgba(255,255,255,0.085)"
                    }
                    strokeWidth={isHovered ? 1.5 : 1}
                    strokeDasharray={isHovered ? "none" : "4 4"}
                    filter={isHovered ? "url(#glow-2)" : undefined}
                    style={{ transition: "all 0.4s ease" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center node */}
          <div
            className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center font-600 text-sm text-center"
            style={{
              background: "var(--bg-1)",
              border: "1px solid var(--line-2)",
              color: "var(--accent)",
              boxShadow: "0 0 20px rgba(196,188,255,0.15)",
            }}
          >
            ANITHIX
          </div>

          {/* Product nodes */}
          {ECOSYSTEM_NODES.map((node, i) => (
            <div
              key={node.id}
              className="absolute cursor-pointer transition-all"
              style={{
                left: `calc(50% + ${node.x}px)`,
                top: `calc(50% + ${node.y}px)`,
                transform: "translate(-50%, -50%)",
                zIndex: 20,
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-600 text-xs text-center text-white transition-all duration-300"
                style={{
                  background: "var(--bg-1)",
                  border: "1px solid var(--line-2)",
                  transform:
                    hoveredNode === node.id ? "scale(1.2)" : "scale(1)",
                  boxShadow:
                    hoveredNode === node.id
                      ? `0 0 20px rgba(196,188,255,0.3), inset 0 0 20px rgba(196,188,255,0.1)`
                      : "none",
                }}
              >
                {node.name}
              </div>

              {/* Tooltip */}
              {hoveredNode === node.id && (
                <div
                  className="cell absolute top-full mt-4 left-1/2 -translate-x-1/2 w-56 p-4 pointer-events-none z-30"
                  style={{ background: "var(--bg-1)" }}
                >
                  <div className="text-xs" style={{ color: "var(--ink-4)" }}>
                    {node.category}
                  </div>
                  <div className="font-600 text-sm mb-2" style={{ color: "var(--ink)" }}>
                    {node.name}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--ink-3)" }}>
                    {node.description}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
