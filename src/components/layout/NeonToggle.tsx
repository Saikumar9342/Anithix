"use client";

import { useState, useEffect } from "react";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AmbientSky, getPeriod, type Period } from "./AmbientSky";

/* Per-period button styling + icon */
const BUTTON: Record<Period, { icon: typeof Sun; color: string; glow: string; border: string; label: string }> = {
  morning:   { icon: Sunrise, color: "#ffd9a0", glow: "rgba(255,200,120,0.45)", border: "rgba(255,200,120,0.4)", label: "Morning" },
  afternoon: { icon: Sun,     color: "#fff3c4", glow: "rgba(255,235,150,0.45)", border: "rgba(255,235,150,0.4)", label: "Afternoon" },
  evening:   { icon: Sunset,  color: "#ff9e7a", glow: "rgba(255,140,90,0.45)",  border: "rgba(255,140,90,0.4)",  label: "Evening" },
  night:     { icon: Moon,    color: "#c4b5fd", glow: "rgba(124,58,237,0.45)",  border: "rgba(124,58,237,0.4)",  label: "Night" },
};

const ORDER: Period[] = ["morning", "afternoon", "evening", "night"];

export function NeonToggle() {
  const [isOn, setIsOn] = useState(false);
  const [autoPeriod, setAutoPeriod] = useState<Period>("night");
  const [manualPeriod, setManualPeriod] = useState<Period | null>(null);

  // Detect time of day on mount, then re-check every minute
  useEffect(() => {
    const update = () => setAutoPeriod(getPeriod(new Date().getHours()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const period = manualPeriod ?? autoPeriod;

  // When a theme is active, make content transparent so the sky shows behind it.
  useEffect(() => {
    document.body.classList.toggle("theme-active", isOn);
    return () => document.body.classList.remove("theme-active");
  }, [isOn]);

  // Night keeps the violet edge glow; daytime themes don't
  useEffect(() => {
    if (isOn && period === "night") {
      document.body.classList.add("neon-glow-active");
    } else {
      document.body.classList.remove("neon-glow-active");
    }
    return () => document.body.classList.remove("neon-glow-active");
  }, [isOn, period]);

  const cfg = BUTTON[period];
  const Icon = cfg.icon;

  return (
    <>
      <AnimatePresence>
        {isOn && (
          <motion.div
            key={period}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <AmbientSky period={period} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme picker — appears above the toggle when on */}
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.35 }}
            className="fixed bottom-28 right-8 z-[100] flex flex-col gap-2"
          >
            {ORDER.map((p) => {
              const pc = BUTTON[p];
              const PIcon = pc.icon;
              const active = p === period;
              const isAuto = !manualPeriod && p === autoPeriod;
              return (
                <button
                  key={p}
                  onClick={() => setManualPeriod(p)}
                  title={`${pc.label}${p === autoPeriod ? " (now)" : ""}`}
                  className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300"
                  style={{
                    background: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
                    border: active ? `1px solid ${pc.border}` : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: active ? `0 0 16px ${pc.glow}` : "none",
                  }}
                >
                  <PIcon color={active || isAuto ? pc.color : "var(--ink-4)"} size={17} />
                </button>
              );
            })}
            {/* back to auto / time-based */}
            <button
              onClick={() => setManualPeriod(null)}
              title="Auto (match current time)"
              className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300"
              style={{
                background: !manualPeriod ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
                border: !manualPeriod ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                fontFamily: "var(--mono)",
                fontSize: "0.55rem",
                letterSpacing: "0.06em",
                color: !manualPeriod ? "var(--ink)" : "var(--ink-4)",
              }}
            >
              AUTO
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOn(!isOn)}
        className="fixed bottom-8 right-8 z-[100] p-4 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md"
        style={{
          background: isOn ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
          border: isOn ? `1px solid ${cfg.border}` : "1px solid rgba(255,255,255,0.1)",
          boxShadow: isOn ? `0 0 30px ${cfg.glow}, inset 0 0 15px ${cfg.glow}` : "0 4px 20px rgba(0,0,0,0.4)",
        }}
        title={isOn ? `${cfg.label} theme — turn off` : `Turn on ${cfg.label.toLowerCase()} theme`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon color={isOn ? cfg.color : "var(--ink-4)"} size={24} />
      </motion.button>
    </>
  );
}
