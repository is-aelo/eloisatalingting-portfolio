"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface DriftFrame {
  x: number;
  y: number;
  duration: number;
}

interface BlobConfig {
  size: number;
  blur: number;
  color: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  scrollStart: number;
  scrollEnd: number;
  scrollEase: string;
  driftFrames: DriftFrame[];
}

const BLOBS: BlobConfig[] = [
  {
    size: 600, blur: 100,
    color: "var(--blob-1-bg)",
    from: { x: 15, y: 10 }, to: { x: 25, y: 30 },
    scrollStart: 0, scrollEnd: 0.7,
    scrollEase: "power1.out",
    driftFrames: [
      { x: 1, y: -2, duration: 10 },
      { x: -2, y: 3, duration: 8 },
      { x: 2, y: -1, duration: 9 },
      { x: 0, y: 0, duration: 8 },
    ],
  },
  {
    size: 500, blur: 90,
    color: "var(--blob-2-bg)",
    from: { x: 70, y: 35 }, to: { x: 60, y: 50 },
    scrollStart: 0.1, scrollEnd: 0.85,
    scrollEase: "sine.inOut",
    driftFrames: [
      { x: 2, y: 1, duration: 12 },
      { x: -1, y: 3, duration: 10 },
      { x: -2, y: 0, duration: 9 },
      { x: 0, y: 0, duration: 9 },
    ],
  },
  {
    size: 450, blur: 85,
    color: "var(--blob-3-bg)",
    from: { x: 50, y: 80 }, to: { x: 55, y: 65 },
    scrollStart: 0.15, scrollEnd: 1,
    scrollEase: "power2.inOut",
    driftFrames: [
      { x: 0, y: -4, duration: 7 },
      { x: 1.5, y: 0, duration: 6 },
      { x: 0, y: 4, duration: 8 },
      { x: -1.5, y: 0, duration: 7 },
    ],
  },
  {
    size: 350, blur: 80,
    color: "var(--blob-4-bg)",
    from: { x: 82, y: 15 }, to: { x: 88, y: 8 },
    scrollStart: 0, scrollEnd: 0.5,
    scrollEase: "power4.out",
    driftFrames: [
      { x: -3, y: 1, duration: 5 },
      { x: 2, y: -2, duration: 4 },
      { x: -1, y: 2, duration: 5 },
      { x: 0, y: 0, duration: 4 },
    ],
  },
  {
    size: 550, blur: 95,
    color: "var(--blob-5-bg)",
    from: { x: 28, y: 60 }, to: { x: 18, y: 78 },
    scrollStart: 0.3, scrollEnd: 1,
    scrollEase: "power1.in",
    driftFrames: [
      { x: 0, y: -2, duration: 9 },
      { x: 2, y: 0, duration: 7 },
      { x: 0, y: 2, duration: 8 },
      { x: -2, y: 0, duration: 6 },
    ],
  },
];

export function MeshGradient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const blobsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [mobileScale] = useState(() => {
    if (typeof window === "undefined") return 1;
    return window.innerWidth < 768 ? 0.5 : 1;
  });

  useEffect(() => {
    const container = containerRef.current;
    const layer = layerRef.current;
    if (!container) return;

    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const isMobile = window.innerWidth < 768;
    const driftMult = isMobile ? 3 : 1;
    const timeScale = isMobile ? 0.7 : 1;

    const ctx = gsap.context(() => {
      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const b = BLOBS[i];
        gsap.set(el, { left: `${b.from.x}vw`, top: `${b.from.y}vw` });
      });

      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          blobsRef.current.forEach((el, i) => {
            if (!el) return;
            const b = BLOBS[i];
            const raw = self.progress;
            const local = raw <= b.scrollStart ? 0
              : raw >= b.scrollEnd ? 1
              : (raw - b.scrollStart) / (b.scrollEnd - b.scrollStart);
            const eased = gsap.parseEase(b.scrollEase)(local);
            const x = b.from.x + (b.to.x - b.from.x) * eased;
            const y = b.from.y + (b.to.y - b.from.y) * eased;
            gsap.set(el, { left: `${x}vw`, top: `${y}vw` });
          });
        },
      });

      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const b = BLOBS[i];
        const tl = gsap.timeline({ repeat: -1 });
        b.driftFrames.forEach((frame) => {
          tl.to(el, {
            x: `${frame.x * driftMult}vw`,
            y: `${frame.y * driftMult}vw`,
            duration: frame.duration * timeScale,
            ease: "sine.inOut",
          });
        });
      });

      if (layer) {
        gsap.to(layer, {
          backgroundPosition: "100% 100%",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5,
          },
        });
      }
    }, container);

    return () => {
      ctx.revert();
      blobsRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={layerRef}
        className="absolute inset-0"
        style={{
          background: "var(--gradient-layer-bg)",
          backgroundSize: "300% 300%",
          backgroundPosition: "0% 0%",
        }}
      />
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) blobsRef.current[i] = el;
          }}
          className="absolute rounded-full"
          style={{
            width: blob.size * mobileScale,
            height: blob.size * mobileScale,
            background: blob.color,
            filter: `blur(${blob.blur * mobileScale}px)`,
            willChange: "transform, filter",
          }}
        />
      ))}
    </div>
  );
}
