"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useState } from "react";

export function JellyText({ text, className = "", style = {} }: { text: string, className?: string, style?: React.CSSProperties }) {
  // Split the text into parts (words and spaces)
  const parts = text.split(/(\s+)/);

  return (
    <span className={className} style={{ display: "inline-block", ...style }}>
      {parts.map((part, partIndex) => {
        // If it's whitespace, render it inside an inline-block without nowrapping
        if (/\s+/.test(part)) {
          return (
            <span key={partIndex} style={{ display: "inline-block", whiteSpace: "pre" }}>
              {part}
            </span>
          );
        }
        
        // If it's a word, wrap it in a nowrap container so the word doesn't break
        return (
          <span key={partIndex} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {part.split("").map((letter, index) => (
              <JellyLetter key={index} letter={letter} />
            ))}
          </span>
        );
      })}
    </span>
  );
}

function JellyLetter({ letter }: { letter: string }) {
  const controls = useAnimationControls();
  const [isPlaying, setIsPlaying] = useState(false);

  const rubberBand = async () => {
    if (!isPlaying) {
      setIsPlaying(true);
      await controls.start({
        transform: [
          "scale3d(1, 1, 1)",
          "scale3d(1.4, .55, 1)",
          "scale3d(.75, 1.25, 1)",
          "scale3d(1.25, .85, 1)",
          "scale3d(.9, 1.05, 1)",
          "scale3d(1, 1, 1)"
        ],
        transition: {
          times: [0, 0.4, 0.6, 0.7, 0.8, 0.9],
          duration: 0.8
        }
      });
      setIsPlaying(false);
    }
  };

  return (
    <motion.span
      animate={controls}
      onMouseOver={rubberBand}
      style={{ display: "inline-block", cursor: "default", whiteSpace: letter === " " ? "pre" : "normal" }}
    >
      {letter}
    </motion.span>
  );
}
