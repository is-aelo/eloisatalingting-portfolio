"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { LuMapPin } from "react-icons/lu";
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
  location: string | null;
};

export function HeroSection({ hero, tools, fullName, location }: Props) {
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

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] flex-col overflow-hidden pt-8 md:pt-16 pb-16 md:pb-24">
      <div className="mx-auto flex w-full max-w-5xl flex-1 items-center px-5 sm:px-6 md:px-8 lg:px-6">
        <div className="flex w-full flex-col items-start text-left md:items-center md:text-center">

          <div ref={badgeRef} className="mb-8 flex flex-wrap items-center justify-start md:justify-center gap-x-2 gap-y-1 opacity-0">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-tertiary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-tertiary" />
            </span>
            <span className="font-body text-xs text-primary/80 uppercase tracking-wider">Available for remote opportunities</span>
            {location && (
              <>
                <span className="text-muted">—</span>
                <span className="flex items-center gap-1">
                  <LuMapPin size={14} className="text-accent-tertiary shrink-0" />
                  <span className="font-body text-xs text-secondary tracking-wide">{location}</span>
                </span>
              </>
            )}
          </div>

          {fullName && (
            <h1
              ref={nameRef}
              className="font-heading font-medium text-[2.25rem] sm:text-6xl md:text-7xl lg:text-[4rem] xl:text-[5rem] 2xl:text-[6rem] uppercase leading-[1.05] tracking-tight text-primary opacity-0"
            >
              {fullName}
            </h1>
          )}

          <div
            ref={lineRef}
            className="mt-6 sm:mt-7 h-0.5 w-16 bg-accent-secondary opacity-0 md:mx-auto"
          />

          {hero?.headline && (
            <p
              ref={headlineRef}
              className="mt-6 sm:mt-8 max-w-2xl font-heading text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-accent-secondary opacity-0 md:mx-auto"
            >
              {renderTextWithAmpersand(hero.headline)}
            </p>
          )}

          {hero?.subheadline && (
            <p
              ref={subheadlineRef}
              className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-secondary opacity-0 md:mx-auto"
            >
              {hero.subheadline}
            </p>
          )}

          <div ref={ctasRef} className="mt-8 sm:mt-10 flex flex-wrap items-center justify-start md:justify-center gap-3 opacity-0">
            <Link
              href={hero?.cta_primary_url || "/#projects"}
              className="btn-shine inline-block cursor-pointer whitespace-nowrap rounded-full bg-gradient-to-r from-accent-secondary to-accent-tertiary px-5 py-3 text-sm font-body text-white transition-opacity hover:opacity-90 md:px-7 md:py-3 md:text-base"
            >
              {hero?.cta_primary_label || "View Projects"}
            </Link>
            <Link
              href={hero?.cta_secondary_url || "/#contact"}
              className="inline-block cursor-pointer whitespace-nowrap rounded-full border border-white/15 px-5 py-3 text-sm font-body text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary md:px-7 md:py-3 md:text-base"
            >
              {hero?.cta_secondary_label || "Get in Touch"}
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
