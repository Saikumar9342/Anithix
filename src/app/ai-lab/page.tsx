"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorGlowClient } from "@/components/animations/CursorGlowClient";

const AILab = dynamic(() => import("@/components/sections/AILab").then((m) => ({ default: m.AILab })));

export default function AILabPage() {
  return (
    <SmoothScroll>
      <CursorGlowClient />
      <Navbar />
      <main style={{ paddingTop: "4.5rem" }}>
        <AILab />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
