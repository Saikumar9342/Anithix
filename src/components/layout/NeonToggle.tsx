"use client";

import { useState, useEffect } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function NeonParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const pts = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="fixed inset-0 z-[-5] pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: p.y + "vh" }}
          animate={{ opacity: [0, 0.6, 0], y: [(p.y + 10) + "vh", p.y + "vh", (p.y - 10) + "vh"] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full"
          style={{
            left: p.x + "vw",
            width: p.size + "px",
            height: p.size + "px",
            background: "rgba(167, 139, 250, 0.8)",
            boxShadow: "0 0 12px rgba(167, 139, 250, 1)",
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
            <NeonParticles />
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
