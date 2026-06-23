"use client";

import { motion } from "framer-motion";

export type SnakeLadderLoaderPhase = "loading" | "finishing";

interface SnakeLadderLoaderProps {
  phase?: SnakeLadderLoaderPhase;
}

const fillKeyframes = ["0%", "22%", "48%", "68%", "82%", "88%", "84%", "90%"];
const fillTimes = [0, 0.12, 0.28, 0.45, 0.6, 0.72, 0.78, 1];

export function SnakeLadderLoader({ phase = "loading" }: SnakeLadderLoaderProps) {
  const isFinishing = phase === "finishing";

  return (
    <div className="relative h-10 w-56">
      <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-surface-muted" />

      <motion.div
        className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-accent"
        animate={
          isFinishing
            ? { width: "100%" }
            : { width: fillKeyframes }
        }
        transition={
          isFinishing
            ? { duration: 0.25, ease: "easeIn" }
            : {
                duration: 2.8,
                repeat: Infinity,
                times: fillTimes,
                ease: "easeInOut",
              }
        }
      />

      <motion.div
        className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
        animate={
          isFinishing
            ? { left: "100%", scale: 0, opacity: 0 }
            : {
                left: fillKeyframes,
                scale: [1, 1.08, 1, 0.96, 1.04, 1],
              }
        }
        transition={
          isFinishing
            ? { duration: 0.25, ease: "easeIn" }
            : {
                left: {
                  duration: 2.8,
                  repeat: Infinity,
                  times: fillTimes,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
        }
      />
    </div>
  );
}
