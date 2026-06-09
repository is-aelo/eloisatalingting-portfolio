"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

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
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });

      if (nameRef.current) {
        tl.fromTo(nameRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 });
      }

      if (headlineRef.current) {
        tl.fromTo(
          headlineRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.3",
        );
      }

      if (subheadlineRef.current) {
        tl.fromTo(
          subheadlineRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.4",
        );
      }
    });

    return () => ctx.revert();
  }, [hero?.headline, hero?.subheadline, fullName]);

  const marqueeItems = [...tools, ...tools];

  return (
    <section id="about" className="relative flex min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] flex-col items-center justify-center overflow-hidden">
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6">
        <div className="max-w-3xl">
          {fullName && (
            <h1
              ref={nameRef}
              className="font-heading text-4xl font-bold uppercase leading-[1.05] tracking-tight text-primary md:text-5xl lg:text-6xl"
              style={{ opacity: 0 }}
            >
              {fullName}
            </h1>
          )}

          {hero?.headline && (
            <p
              ref={headlineRef}
              className="mt-4 font-heading text-lg font-medium text-accent-secondary md:text-xl lg:text-2xl"
              style={{ opacity: 0 }}
            >
              {hero.headline}
            </p>
          )}

          {hero?.subheadline && (
            <p
              ref={subheadlineRef}
              className="mt-4 max-w-xl text-sm leading-relaxed text-secondary md:text-base"
              style={{ opacity: 0 }}
            >
              {hero.subheadline}
            </p>
          )}

          <div className="mt-8 flex flex-nowrap items-center gap-3">
            <Link
              href="/#projects"
              className="inline-block cursor-pointer whitespace-nowrap rounded-lg bg-accent px-4 py-2.5 text-sm font-body text-background transition-opacity hover:opacity-90 md:px-6 md:py-3 md:text-base"
            >
              View Projects
            </Link>
            <Link
              href="/contact"
              className="inline-block cursor-pointer whitespace-nowrap rounded-lg border border-border px-4 py-2.5 text-sm font-body text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary md:px-6 md:py-3 md:text-base"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Tech stack band — full width */}
      {tools.length > 0 && (
        <div className="w-full border-y border-border bg-surface py-3">
          <div
            className="overflow-hidden"
            style={{
              maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
            }}
          >
            <div
              ref={marqueeRef}
              className="flex gap-1"
              style={{
                width: "fit-content",
                animation: "marquee 30s linear infinite",
              }}
            >
              {marqueeItems.map((tool, i) => (
                <span
                  key={`${tool.name}-${i}`}
                  className="inline-flex shrink-0 items-center font-body text-xs text-accent-secondary md:text-sm"
                >
                  {i > 0 && <span className="mx-4 text-accent-secondary/40">◆</span>}
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
