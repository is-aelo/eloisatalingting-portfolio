"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MeshBlobBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const blobs = Array.from(container.querySelectorAll<HTMLElement>("[data-blob]"));
    if (!blobs.length) return;

    const ctx = gsap.context(() => {
      blobs.forEach((blob, i) => {
        const xRange = 80 + i * 30;
        const yRange = 150 + i * 50;
        const rotateRange = 30 + i * 15;

        gsap.to(blob, {
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
          y: () => yRange * (i % 2 === 0 ? 1 : -1),
          x: `random(-${xRange}, ${xRange})`,
          rotation: rotateRange * (i % 2 === 0 ? 1 : -1),
          scale: 1 + (i * 0.15),
          ease: "none",
        });

        gsap.to(blob, {
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 2 + i * 0.5,
          },
          keyframes: [
            { x: 0, y: 0, duration: 0 },
            { x: xRange * 0.5, y: -yRange * 0.3, duration: 1 },
            { x: -xRange * 0.3, y: yRange * 0.5, duration: 1 },
            { x: 0, y: 0, duration: 1 },
          ],
          ease: "none",
        });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-layer-bg)" }}
      />

      {/* Blob 1 - Top left */}
      <div
        data-blob
        className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full blur-[120px] opacity-60"
        style={{ background: "var(--blob-1-bg)" }}
      />

      {/* Blob 2 - Top right */}
      <div
        data-blob
        className="absolute -right-24 top-1/4 h-[400px] w-[400px] rounded-full blur-[100px] opacity-50"
        style={{ background: "var(--blob-2-bg)" }}
      />

      {/* Blob 3 - Center */}
      <div
        data-blob
        className="absolute left-1/3 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] opacity-40"
        style={{ background: "var(--blob-3-bg)" }}
      />

      {/* Blob 4 - Bottom left */}
      <div
        data-blob
        className="absolute -left-20 bottom-1/4 h-[450px] w-[450px] rounded-full blur-[110px] opacity-50"
        style={{ background: "var(--blob-4-bg)" }}
      />

      {/* Blob 5 - Bottom right */}
      <div
        data-blob
        className="absolute -right-16 bottom-10 h-[350px] w-[350px] rounded-full blur-[90px] opacity-45"
        style={{ background: "var(--blob-5-bg)" }}
      />
    </div>
  );
}
