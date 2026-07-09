"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type CursorShape = "ring" | "dot" | "ring-dot" | "crosshair";

type CursorFollowerProps = {
  shape?: CursorShape;
  size?: number;
  color?: string;
  ringWidth?: number;
  mixBlend?: string;
};

export function CursorFollower({
  shape = "ring-dot",
  size = 32,
  color = "var(--accent-secondary)",
  ringWidth = 1.5,
  mixBlend = "difference",
}: CursorFollowerProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor) return;

    document.body.style.cursor = "none";
    document.body.style.setProperty("--cursor-color", color);

    const toRing = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power1.out" });
    const toRingY = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power1.out" });
    let toDot: ((v: number) => void) | null = null;
    let toDotY: ((v: number) => void) | null = null;
    if (dot) {
      toDot = gsap.quickTo(dot, "x", { duration: 0.04, ease: "power1.out" });
      toDotY = gsap.quickTo(dot, "y", { duration: 0.04, ease: "power1.out" });
    }

    const move = (e: MouseEvent) => {
      toRing(e.clientX);
      toRingY(e.clientY);
      if (toDot && toDotY) {
        toDot(e.clientX);
        toDotY(e.clientY);
      }
    };

    const leave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.15 });
      if (dot) gsap.to(dot, { opacity: 0, duration: 0.15 });
    };

    const enter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.15 });
      if (dot) gsap.to(dot, { opacity: 1, duration: 0.15 });
    };

    const hoverIn = () => {
      gsap.to(cursor, { scale: 1.5, duration: 0.15, ease: "power1.out" });
    };

    const hoverOut = () => {
      gsap.to(cursor, { scale: 1, duration: 0.15, ease: "power1.out" });
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    const hoverTargets = document.querySelectorAll("a, button, [data-cursor-hover]");
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", hoverIn);
      el.addEventListener("mouseleave", hoverOut);
    });

    const observer = new MutationObserver(() => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.removeEventListener("mouseenter", hoverIn);
        el.removeEventListener("mouseleave", hoverOut);
        el.addEventListener("mouseenter", hoverIn);
        el.addEventListener("mouseleave", hoverOut);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      hoverTargets.forEach((el) => {
        el.removeEventListener("mouseenter", hoverIn);
        el.removeEventListener("mouseleave", hoverOut);
      });
      observer.disconnect();
    };
  }, [color]);

  const ringVisible = shape === "ring" || shape === "ring-dot";
  const dotVisible = shape === "dot" || shape === "ring-dot";
  const ringSize = shape === "ring" ? size : size;
  const dotSize = shape === "dot" ? size * 0.5 : 6;

  return (
    <>
      {ringVisible && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-[9999]"
          style={{
            width: ringSize,
            height: ringSize,
            marginLeft: -ringSize / 2,
            marginTop: -ringSize / 2,
            border: `${ringWidth}px solid var(--cursor-color)`,
            borderRadius: shape === "crosshair" ? "0" : "50%",
            opacity: 0,
            transition: "border-color 0.3s",
          }}
        />
      )}
      {dotVisible && (
        <div
          ref={dotRef}
          className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            marginLeft: -dotSize / 2,
            marginTop: -dotSize / 2,
            backgroundColor: "var(--cursor-color)",
            opacity: 0,
          }}
        />
      )}
    </>
  );
}
