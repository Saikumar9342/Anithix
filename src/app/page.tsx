"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { Products } from "@/components/sections/Products";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Technology } from "@/components/sections/Technology";
import { AILab } from "@/components/sections/AILab";
import { Timeline } from "@/components/sections/Timeline";
import { About } from "@/components/sections/About";
import { Founder } from "@/components/sections/Founder";
import { Contact } from "@/components/sections/Contact";
import { CursorGlowClient } from "@/components/animations/CursorGlowClient";

export default function Home() {
  return (
    <SmoothScroll>
      <CursorGlowClient />
      <Navbar />
      <main>
        <Hero />
        <Products />
        <Ecosystem />
        <Technology />
        <AILab />
        <Timeline />
        <About />
        <Founder />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
