"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorGlowClient } from "@/components/animations/CursorGlowClient";

const Technology = dynamic(() => import("@/components/sections/Technology").then((m) => ({ default: m.Technology })));

export default function TechnologyPage() {
  return (
    <SmoothScroll>
      <CursorGlowClient />
      <Navbar />
      <main style={{ paddingTop: "4.5rem" }}>
        <Technology />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
