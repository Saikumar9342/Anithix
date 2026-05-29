"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CursorGlowClient } from "@/components/animations/CursorGlowClient";

const ProductGalaxy = dynamic(() => import("@/components/sections/ProductGalaxy").then((m) => ({ default: m.ProductGalaxy })));
const Products = dynamic(() => import("@/components/sections/Products").then((m) => ({ default: m.Products })));

export default function ProductsPage() {
  return (
    <SmoothScroll>
      <CursorGlowClient />
      <Navbar />
      <main style={{ paddingTop: "4.5rem" }}>
        <ProductGalaxy />
        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <Products />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
