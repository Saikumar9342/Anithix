"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorGlowClient } from "@/components/animations/CursorGlowClient";

const Ecosystem = dynamic(() => import("@/components/sections/Ecosystem").then((m) => ({ default: m.Ecosystem })));

export default function EcosystemPage() {
  return (
    <SmoothScroll>
      <CursorGlowClient />
      <Navbar />
      <main style={{ paddingTop: "4.5rem" }}>
        <Ecosystem />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
