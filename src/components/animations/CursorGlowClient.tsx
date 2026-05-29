"use client";

import dynamic from "next/dynamic";

const CursorGlow = dynamic(
  () => import("./CursorGlow").then((m) => ({ default: m.CursorGlow })),
  { ssr: false }
);

export function CursorGlowClient() {
  return <CursorGlow />;
}
