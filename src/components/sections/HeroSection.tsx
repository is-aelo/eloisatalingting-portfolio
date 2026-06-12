"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { renderTextWithAmpersand } from "@/lib/text";

type Tool = {
  name: string;
  logo_url: string | null;
  category: string | null;
};

type HeroContent = {
  headline: string;
  subheadline?: string | null;
  cta_primary_label?: string | null;
  cta_primary_url?: string | null;
  cta_secondary_label?: string | null;
  cta_secondary_url?: string | null;
  display?: boolean;
};

type Props = {
  hero?: HeroContent | null;
  tools: Tool[];
  fullName: string;
};

export function HeroSection({ hero, tools, fullName }: Props) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 }
        );
      }

      if (nameRef.current) {
        tl.fromTo(
          nameRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1 },
          "-=0.3"
        );
      }

      if (lineRef.current) {
        tl.fromTo(
          lineRef.current,
          { scaleX: 0, transformOrigin: "center" },
          { scaleX: 1, duration: 0.6 },
          "-=0.4"
        );
      }

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.3"
        );
      }

      if (subheadlineRef.current) {
        tl.fromTo(
          subheadlineRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.35"
        );
      }

      if (ctasRef.current) {
        tl.fromTo(
          ctasRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        );
      }
    });

    return () => ctx.revert();
  }, [hero?.headline, hero?.subheadline, fullName]);

  const marqueeItems = [...tools, ...tools];

  return (
    <section id="about" className="relative flex min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-5xl flex-1 items-center px-5 sm:px-6 md:px-8 lg:px-6">
        <div className="flex w-full flex-col items-start text-left md:items-center md:text-center">
          <div ref={badgeRef} className="mb-5 sm:mb-6 flex items-center gap-2 opacity-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-tertiary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-tertiary" />
            </span>
            <span className="font-body text-xs text-primary/80 uppercase tracking-wider">Available for remote opportunities</span>
          </div>

          {fullName && (
            <h1
              ref={nameRef}
              className="font-body font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[4rem] xl:text-[5rem] 2xl:text-[6rem] uppercase leading-[1.05] tracking-tight text-primary opacity-0"
            >
              {fullName}
            </h1>
          )}

          <div
            ref={lineRef}
            className="mt-5 sm:mt-6 h-0.5 w-16 bg-accent-secondary opacity-0"
          />

          {hero?.headline && (
            <p
              ref={headlineRef}
              className="mt-6 sm:mt-8 max-w-2xl font-heading text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-accent-secondary opacity-0"
            >
              {renderTextWithAmpersand(hero.headline)}
            </p>
          )}

          {hero?.subheadline && (
            <p
              ref={subheadlineRef}
              className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-secondary opacity-0"
            >
              {hero.subheadline}
            </p>
          )}

          <div ref={ctasRef} className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3 md:justify-center opacity-0">
            <Link
              href={hero?.cta_primary_url || "/#contact"}
              className="btn-shine inline-block cursor-pointer whitespace-nowrap rounded-full bg-gradient-to-r from-accent-secondary to-accent-tertiary px-5 py-2.5 text-sm font-body text-white transition-opacity hover:opacity-90 md:px-7 md:py-3 md:text-base"
            >
              {hero?.cta_primary_label || "Get in Touch"}
            </Link>
            <Link
              href={hero?.cta_secondary_url || "/#projects"}
              className="inline-block cursor-pointer whitespace-nowrap rounded-full border border-border px-5 py-2.5 text-sm font-body text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary md:px-7 md:py-3 md:text-base"
            >
              {hero?.cta_secondary_label || "View Projects"}
            </Link>
          </div>
        </div>
      </div>

      {tools.length > 0 && (
        <div className="w-full border-y border-border bg-gradient-to-r from-accent-secondary/5 via-surface-muted/50 to-accent-secondary/5 py-4">
          <div className="flex items-center gap-4 px-5 sm:px-6 md:px-8 lg:px-6 mb-3">
            <span className="font-body text-[10px] text-accent-secondary uppercase tracking-widest shrink-0 font-medium">
              Technologies
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-accent-secondary/20 to-transparent" />
          </div>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="flex gap-3 w-fit animate-[marquee_30s_linear_infinite]">
              {marqueeItems.map((tool, i) => (
                <span
                  key={`${tool.name}-${i}`}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border/50 bg-surface/80 px-4 py-1.5 font-body text-xs text-secondary backdrop-blur-sm transition-colors hover:border-accent-secondary/30 hover:text-accent-secondary md:text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary/40" />
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
