"use client";

import { useState, useEffect } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Fireflies() {
  const [flies, setFlies] = useState<any[]>([]);

  useEffect(() => {
    const pts = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      driftX: (Math.random() - 0.5) * 30,
      driftY: (Math.random() - 0.5) * 20,
      duration: Math.random() * 12 + 8,
      glowDuration: Math.random() * 3 + 2,
      delay: Math.random() * 8,
      hue: Math.random() > 0.6 ? "rgba(255, 200, 100, 0.9)" : "rgba(167, 139, 250, 0.85)",
      glowColor: Math.random() > 0.6 ? "rgba(255, 200, 100, 0.6)" : "rgba(167, 139, 250, 0.5)",
    }));
    setFlies(pts);
  }, []);

  return (
    <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden">
      {flies.map(f => (
        <motion.div
          key={f.id}
          className="absolute rounded-full"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.8, 0.3, 0.9, 0],
            x: [0, f.driftX * 0.5, f.driftX, f.driftX * 0.7, 0],
            y: [0, f.driftY * 0.3, f.driftY, f.driftY * 1.2, 0],
          }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: f.x + "vw",
            top: f.y + "vh",
            width: f.size + "px",
            height: f.size + "px",
            background: f.hue,
            boxShadow: `0 0 ${f.size * 4}px ${f.glowColor}, 0 0 ${f.size * 8}px ${f.glowColor}`,
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
}

export function NeonToggle() {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    if (isOn) {
      document.body.classList.add("neon-glow-active");
    } else {
      document.body.classList.remove("neon-glow-active");
    }
  }, [isOn]);

  return (
    <>
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <Fireflies />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOn(!isOn)}
        className="fixed bottom-8 right-8 z-[100] p-4 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md"
        style={{
          background: isOn ? "rgba(124, 58, 237, 0.15)" : "rgba(255, 255, 255, 0.03)",
          border: isOn ? "1px solid rgba(124, 58, 237, 0.4)" : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: isOn ? "0 0 30px rgba(124, 58, 237, 0.4), inset 0 0 15px rgba(124, 58, 237, 0.2)" : "0 4px 20px rgba(0,0,0,0.4)",
        }}
        title={isOn ? "Turn Off Edge Glow" : "Turn On Edge Glow"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOn ? <Lightbulb color="#c4b5fd" size={24} /> : <LightbulbOff color="var(--ink-4)" size={24} />}
      </motion.button>
    </>
  );
}
