"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorGlowClient } from "@/components/animations/CursorGlowClient";

const Timeline = dynamic(() => import("@/components/sections/Timeline").then((m) => ({ default: m.Timeline })));

export default function TimelinePage() {
  return (
    <SmoothScroll>
      <CursorGlowClient />
      <Navbar />
      <main style={{ paddingTop: "4.5rem" }}>
        <Timeline />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
