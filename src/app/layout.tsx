import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ANITHIX — Building Intelligent Products For The Future",
    template: "%s | ANITHIX",
  },
  description:
    "Anithix builds AI-powered software, automation platforms, and developer tools designed for the next generation of creators and businesses.",
  keywords: ["Anithix", "AI software", "Graviton", "Atom", "Orbis", "intelligent products"],
  authors: [{ name: "Anithix", url: "https://anithix.com" }],
  creator: "Anithix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://anithix.com",
    title: "ANITHIX — Building Intelligent Products For The Future",
    description: "Explore the Anithix ecosystem — AI-powered software and developer tools.",
    siteName: "ANITHIX",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
};

import { Preloader } from "@/components/layout/Preloader";
import { NeonToggle } from "@/components/layout/NeonToggle";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <body suppressHydrationWarning>
        <Preloader />
        <NeonToggle />
        {children}
      </body>
    </html>
  );
}
