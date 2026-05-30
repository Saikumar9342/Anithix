"use client";

import { StarField } from "./StarField";

/**
 * Persistent universe backdrop — fixed behind all content.
 * Deep-space gradient + nebula glows + twinkling starfield + shooting stars.
 * Content sections are transparent (see globals.css) so this shows through.
 */
export function CosmicBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -2 }}
    >
      {/* Deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% -10%, #14101f 0%, #0a0810 45%, #060509 100%)",
        }}
      />

      {/* Nebula glows */}
      <div
        className="absolute"
        style={{
          top: "-10%",
          left: "-5%",
          width: "55vw",
          height: "55vw",
          background: "radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "-15%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(56,120,220,0.13) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "40%",
          left: "55%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(220,80,160,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Twinkling starfield + shooting stars (fills the parent) */}
      <StarField position="absolute" opacity={0.7} count={170} />
    </div>
  );
}
