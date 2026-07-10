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
  location: string | null;
};

export function HeroSection({ hero, fullName, location }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 }
        );
      }

      if (nameRef.current) {
        tl.fromTo(
          nameRef.current,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7 },
          "-=0.2"
        );
      }

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6 },
          "-=0.3"
        );
      }

      if (subheadlineRef.current) {
        tl.fromTo(
          subheadlineRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6 },
          "-=0.3"
        );
      }

      if (ctasRef.current) {
        tl.fromTo(
          ctasRef.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5 },
          "-=0.25"
        );
      }
    });

    return () => ctx.revert();
  }, [hero?.headline, hero?.subheadline, fullName]);

  return (
    <section ref={sectionRef}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-14 pb-8 sm:pb-8 lg:pb-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
          <div className="w-full max-w-[240px] mx-auto lg:mx-0 lg:max-w-none lg:flex-1 text-left">
            {fullName && (
              <h1
                ref={nameRef}
                className="font-heading font-bold text-lg leading-[1.08] tracking-tight text-primary opacity-0 uppercase sm:text-xl lg:text-2xl xl:text-3xl"
              >
                {fullName}
              </h1>
            )}

            {hero?.headline && (
              <p
                ref={headlineRef}
                className="mt-3 max-w-lg font-heading text-sm font-medium text-accent-secondary opacity-0 sm:text-base lg:text-lg"
              >
                {renderTextWithAmpersand(hero.headline)}
              </p>
            )}

            {location && (
              <div
                ref={badgeRef}
                className="mt-4 flex flex-col items-start lg:flex-row lg:items-center gap-1 lg:gap-2.5 opacity-0"
              >
                <span className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-tertiary" />
                  <span className="font-body text-[10px] text-secondary uppercase tracking-wider sm:text-xs">
                    {location}
                  </span>
                </span>
                <span className="hidden lg:block h-3 w-px shrink-0 bg-border" />
                <span className="font-body text-[10px] text-accent-secondary uppercase tracking-wider sm:text-xs">
                  Open to work
                </span>
              </div>
            )}

            {hero?.subheadline && (
              <p
                ref={subheadlineRef}
                className="mt-6 text-left text-xs leading-relaxed text-secondary opacity-0 sm:text-sm"
              >
                {hero.subheadline}
              </p>
            )}

            <div
              ref={ctasRef}
              className="mt-6 flex flex-wrap items-center justify-start gap-3 opacity-0"
            >
              <Link
                href={hero?.cta_secondary_url || "/#contact"}
                className="btn-shine inline-block cursor-pointer whitespace-nowrap rounded-lg bg-accent px-5 py-2.5 text-xs font-body text-white transition-opacity hover:opacity-90 md:px-7 md:py-3 md:text-sm"
              >
                {hero?.cta_secondary_label || "Get in Touch"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
