"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorGlowClient } from "@/components/animations/CursorGlowClient";

const Founder = dynamic(() => import("@/components/sections/Founder").then((m) => ({ default: m.Founder })));

export default function FounderPage() {
  return (
    <SmoothScroll>
      <CursorGlowClient />
      <Navbar />
      <main style={{ paddingTop: "4.5rem" }}>
        <Founder />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
