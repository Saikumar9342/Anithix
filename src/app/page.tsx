"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { Products } from "@/components/sections/Products";
import { Contact } from "@/components/sections/Contact";
import { CursorGlowClient } from "@/components/animations/CursorGlowClient";
import { SpaceCanvas } from "@/components/layout/SpaceCanvas";

export default function Home() {
  useEffect(() => {
    // Disable browser scroll restoration so page always starts at top
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <SmoothScroll>
      <CursorGlowClient />
      <Navbar />
      <SpaceCanvas />
      <main>
        <Hero />
        <Products />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
