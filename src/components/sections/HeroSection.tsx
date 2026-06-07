"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

type HeroContent = {
  headline: string;
  subheadline?: string | null;
  cta_primary_label?: string | null;
  cta_primary_url?: string | null;
  cta_secondary_label?: string | null;
  cta_secondary_url?: string | null;
  display?: boolean;
};

const fallback: HeroContent = {
  headline: "Product Designer & Developer",
  subheadline: null,
  cta_primary_label: "View Projects",
  cta_primary_url: "/projects",
  cta_secondary_label: "Get in Touch",
  cta_secondary_url: "/contact",
};

export function HeroSection({
  content,
  fullName,
}: {
  content?: HeroContent | null;
  fullName?: string | null;
}) {
  const c = content ?? fallback;
  const nameRef = useRef<HTMLParagraphElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.out" } });

      if (nameRef.current) {
        tl.fromTo(nameRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 });
      }

      if (accentRef.current) {
        tl.fromTo(accentRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, "-=0.3");
      }

      tl.fromTo(
        headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.3",
      )
        .fromTo(
          subheadlineRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.4",
        )
        .fromTo(
          ctaRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1 },
          "-=0.3",
        );
    });

    return () => ctx.revert();
  }, [c.headline, c.subheadline, fullName]);

  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)] flex-col items-start justify-center overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] opacity-20 dark:opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] opacity-10 dark:opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(216,180,254,0.3) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="relative z-10 max-w-3xl">
        {fullName && (
          <>
            <p
              ref={nameRef}
              className="font-body text-sm text-muted uppercase tracking-widest"
              style={{ opacity: 0 }}
            >
              {fullName} <span className="text-muted">/ PORTFOLIO</span>
            </p>

            <div
              ref={accentRef}
              className="mt-3 h-0.5 w-16 origin-left rounded-full bg-gradient-to-r from-accent-secondary to-transparent"
              style={{ transform: "scaleX(0)" }}
            />
          </>
        )}

        <h1
          ref={headlineRef}
          className="mt-8 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-primary md:text-5xl lg:text-6xl"
          style={{ opacity: 0 }}
        >
          {c.headline}
        </h1>

        {c.subheadline && (
          <p
            ref={subheadlineRef}
            className="mt-6 max-w-2xl text-base leading-relaxed text-secondary md:text-lg"
            style={{ opacity: 0 }}
          >
            {c.subheadline}
          </p>
        )}

        <div
          ref={ctaRef}
          className="mt-10 flex flex-wrap items-center gap-4"
          style={{ opacity: 0 }}
        >
          {c.cta_primary_label && c.cta_primary_url && (
            <Link
              href={c.cta_primary_url}
              className="inline-block cursor-pointer rounded-lg bg-accent px-8 py-3 font-body text-background transition-opacity hover:opacity-90"
            >
              {c.cta_primary_label}
            </Link>
          )}
          {c.cta_secondary_label && c.cta_secondary_url && (
            <Link
              href={c.cta_secondary_url}
              className="inline-block cursor-pointer rounded-lg border border-border px-8 py-3 font-body text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary"
            >
              {c.cta_secondary_label}
            </Link>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
