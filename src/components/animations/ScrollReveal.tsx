"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  as?: React.ElementType;
  y?: number;
  duration?: number;
  stagger?: number;
  selector?: string;
  className?: string;
}

export function ScrollReveal({
  children,
  as: Tag = "div",
  y = 30,
  duration = 0.8,
  stagger = 0,
  selector,
  className,
}: ScrollRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const targets = selector
      ? Array.from(el.querySelectorAll<HTMLElement>(selector))
      : stagger > 0
        ? (Array.from(el.children) as HTMLElement[])
        : [el];

    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          stagger: stagger || undefined,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [y, duration, stagger, selector]);

  return <Tag ref={elRef} className={className}>{children}</Tag>;
}
