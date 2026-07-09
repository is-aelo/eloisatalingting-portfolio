"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { renderTextWithAmpersand } from "@/lib/text";

gsap.registerPlugin(ScrollTrigger);

function getCSSVariable(name: string): string {
  if (typeof window === "undefined") return "#000000";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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

type ProjectCTA = {
  label: string;
  url: string;
};

type Project = {
  slug: string;
  title: string;
  short_description: string | null;
  thumbnail_url: string | null;
  cover_image_url: string | null;
  project_type: string | null;
  tech_stack_summary: string | null;
  project_ctas: ProjectCTA[] | null;
};

type Props = {
  hero?: HeroContent | null;
  tools: Tool[];
  fullName: string;
  location: string | null;
  projects: Project[];
  profileImageUrl?: string | null;
};

const CARD_HEIGHT = "clamp(320px, 60vh, 600px)";

function CardContent({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <>
      <div className="relative h-full w-3/5 shrink-0 overflow-hidden leading-0 bg-surface-muted">
        {project.cover_image_url || project.thumbnail_url ? (
          <img
            src={project.cover_image_url || project.thumbnail_url || undefined}
            alt={project.title}
            className="absolute inset-0 block h-full w-full object-cover"
            style={{ willChange: "transform" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-muted">
            <span className="font-heading text-4xl text-muted md:text-6xl">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="flex h-full w-2/5 shrink-0 flex-col justify-between p-5 sm:p-6 md:p-8">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="font-body text-xs text-accent-secondary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px w-5 bg-border sm:w-6" />
          {project.project_type && (
            <p className="font-body text-[10px] text-primary/80 uppercase tracking-wider sm:text-xs">
              {project.project_type}
            </p>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <h2               className="font-heading text-sm text-primary sm:text-base md:text-lg leading-snug">
            {renderTextWithAmpersand(project.title)}
          </h2>

          {project.short_description && (
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-secondary md:mt-3 md:text-sm">
              {project.short_description}
            </p>
          )}

          {project.tech_stack_summary && (
            <div className="mt-3 flex flex-wrap gap-1.5 md:mt-4 md:gap-2">
              {project.tech_stack_summary.split(",").map((tech) => (
                <span
                  key={tech.trim()}
                  className="rounded-full bg-accent-secondary/10 px-2 py-0.5 font-body text-[10px] text-accent-secondary sm:px-2.5 sm:py-1 sm:text-xs"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <span className="mt-4 flex items-center gap-1.5 text-xs font-medium text-accent-secondary sm:text-sm">
          <span>View case study</span>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </>
  );
}

export function HeroSection({ hero, fullName, location, projects, profileImageUrl }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasProjects = projects.length > 0;

  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-card]"));
    if (!cards.length) return;

    const CARD_PEEK = 28;
    const CARD_SCALE_BURIED = 1;
    const OVERLAP = 0.72;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        gsap.set(card, {
          y: i === 0 ? 0 : "100vh",
          scale: 1,
          transformOrigin: "50% 100%",
        });

        if (i > 0) {
          const triggerStart = (i - OVERLAP) / cards.length;
          const triggerEnd = i / cards.length;

          ScrollTrigger.create({
            trigger: section,
            start: `${triggerStart * 100}% top`,
            end: `${triggerEnd * 100}% top`,
            scrub: 0.6,
            onUpdate: (self) => {
              const p = self.progress;
              const eased = gsap.parseEase("power3.out")(p);

              gsap.set(card, { y: `${(1 - eased) * 100}vh` });

              for (let j = 0; j < i; j++) {
                const depth = i - j;
                const maxScale = 1 - ((depth - 1) * (1 - CARD_SCALE_BURIED)) / (cards.length - 1);
                const targetScale = maxScale - (eased * (1 - CARD_SCALE_BURIED)) / (cards.length - 1);
                const targetY = -(depth - 1) * CARD_PEEK - eased * CARD_PEEK;

                gsap.set(cards[j], {
                  scale: Math.max(targetScale, CARD_SCALE_BURIED),
                  y: targetY,
                });

                const buriedInner = cards[j].querySelector<HTMLElement>(
                  "[data-card-inner]"
                );
                if (buriedInner) {
                  gsap.to(buriedInner, {
                    borderColor: hexToRgba(getCSSVariable("--border"), 0.3),
                    boxShadow: "none",
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }
              }

              const activeInner = card.querySelector<HTMLElement>(
                "[data-card-inner]"
              );
              if (activeInner && eased > 0.5) {
                const accentColor = getCSSVariable("--accent-secondary");
                gsap.to(activeInner, {
                  borderColor: hexToRgba(accentColor, 0.35),
                  boxShadow: `0 0 12px ${hexToRgba(accentColor, 0.1)}, 0 0 24px ${hexToRgba(accentColor, 0.04)}`,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }
            },
          });
        }

        if (i === 0) {
          const firstInner = card.querySelector<HTMLElement>(
            "[data-card-inner]"
          );
          if (firstInner) {
            const accentColor = getCSSVariable("--accent-secondary");
            gsap.set(firstInner, {
              borderColor: hexToRgba(accentColor, 0.35),
              boxShadow: `0 0 12px ${hexToRgba(accentColor, 0.1)}, 0 0 24px ${hexToRgba(accentColor, 0.04)}`,
            });
          }
        }

        const img = card.querySelector<HTMLElement>("img");
        if (img && i < cards.length - 1) {
          gsap.set(img, { yPercent: 0 });
        }
      });
    }, section);

    return () => ctx.revert();
  }, [projects, isMobile]);

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

  useEffect(() => {
    if (!isMobile) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const cardEls = cardsRef.current.filter(Boolean) as HTMLElement[];
    if (!cardEls.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardEls,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }, container);

    let rafId: number;
    let lastIndex = -1;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollLeft = container.scrollLeft;
        const cardWidth = cardEls[0]?.offsetWidth ?? 0;
        const gap = 16;
        const newIndex = Math.round(scrollLeft / (cardWidth + gap));

        if (
          newIndex !== lastIndex &&
          newIndex >= 0 &&
          newIndex < cardEls.length
        ) {
          lastIndex = newIndex;
          setActiveIndex(newIndex);

          cardEls.forEach((card, i) => {
            if (i === newIndex) {
              const accentColor = getCSSVariable("--accent-secondary");
              gsap.to(card, {
                scale: 1,
                opacity: 1,
                filter: "saturate(1) brightness(1)",
                borderColor: hexToRgba(accentColor, 0.35),
                boxShadow: `0 0 12px ${hexToRgba(accentColor, 0.1)}, 0 0 24px ${hexToRgba(accentColor, 0.04)}`,
                duration: 0.3,
                ease: "power2.out",
              });
            } else {
              const distance = Math.abs(i - newIndex);
              gsap.to(card, {
                scale: Math.max(0.92, 1 - distance * 0.04),
                opacity: Math.max(0.5, 1 - distance * 0.25),
                filter: "saturate(0.3) brightness(0.7)",
                borderColor: hexToRgba(getCSSVariable("--border"), 0.3),
                boxShadow: "none",
                duration: 0.3,
                ease: "power2.out",
              });
            }
          });
        }
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", onScroll);
    };
  }, [projects, isMobile]);

  const scrollToCard = useCallback(
    (index: number) => {
      const container = scrollContainerRef.current;
      const card = cardsRef.current[index];
      if (!container || !card) return;

      const cardWidth = card.offsetWidth;
      const gap = 16;
      const scrollTo = index * (cardWidth + gap);

      gsap.to(container, {
        scrollLeft: scrollTo,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    []
  );

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative"
      style={
        !isMobile && hasProjects
          ? { height: `${projects.length * 120 + 30}vh` }
          : undefined
      }
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-14 pb-8 sm:pb-8 lg:pb-2">
        <div className="flex flex-col md:flex-row md:items-center md:gap-16 lg:gap-20">
          {profileImageUrl && (
            <div className="mb-10 shrink-0 self-center md:mb-0 md:self-auto">
              <div className="relative">
                <div className="absolute -inset-2 rounded-xl border border-accent-secondary/20" />
                <img
                  src={profileImageUrl}
                  alt={fullName || "Profile"}
                  className="relative block w-full max-w-[240px] rounded-xl border border-border object-cover shadow-sm md:w-52 lg:w-64 aspect-square"
                />
              </div>
            </div>
          )}

          <div className="flex-1 text-center md:text-left">
            {location && (
              <div
                ref={badgeRef}
                className="mb-5 flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-2.5 opacity-0"
              >
                <span className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-tertiary" />
                  <span className="font-body text-[10px] text-secondary uppercase tracking-wider sm:text-xs">
                    {location}
                  </span>
                </span>
                <span className="hidden sm:block h-3 w-px shrink-0 bg-border" />
                <span className="font-body text-[10px] text-accent-secondary uppercase tracking-wider sm:text-xs">
                  Open for remote opportunities
                </span>
              </div>
            )}

            {fullName && (
              <h1
                ref={nameRef}
                className="font-heading font-bold text-lg leading-[1.08] tracking-tight text-primary opacity-0 uppercase sm:text-xl md:text-2xl lg:text-3xl"
              >
                {fullName}
              </h1>
            )}

            {hero?.headline && (
              <p
                ref={headlineRef}
                className="mt-5 max-w-lg font-heading text-sm font-medium text-accent-secondary opacity-0 sm:text-base md:text-lg"
              >
                {renderTextWithAmpersand(hero.headline)}
              </p>
            )}

            {hero?.subheadline && (
              <p
                ref={subheadlineRef}
                className="mt-3 text-xs leading-relaxed text-secondary opacity-0 sm:text-sm"
              >
                {hero.subheadline}
              </p>
            )}

            <div
              ref={ctasRef}
              className="mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0 md:justify-start"
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

      {!isMobile && hasProjects && (
        <div className="sticky top-16 flex h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden">
          <p className="px-4 sm:px-6 lg:px-8 pt-16 text-center font-body text-xs text-primary/80 uppercase tracking-wider">Selected Projects</p>
          <div className="relative min-h-0 flex-1">
            {projects.map((project, i) => (
              <div
                key={project.slug}
                data-card
                className="absolute inset-0 flex items-center justify-center will-change-transform"
                style={{ zIndex: i + 1 }}
              >
                <div
                  className="w-full max-w-5xl px-4 sm:px-6 lg:px-8"
                  style={{ height: CARD_HEIGHT }}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    data-card-inner
                    className="flex h-full w-full flex-row overflow-hidden rounded-lg border border-border bg-background transition-colors hover:border-accent-secondary/30"
                  >
                    <CardContent project={project} index={i} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isMobile && hasProjects && (
        <div>
          <p className="px-5 pt-16 text-center font-body text-xs text-primary/80 uppercase tracking-wider">Selected Projects</p>
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide [-webkit-overflow-scrolling:touch]"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {projects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="shrink-0 w-[80vw] flex flex-col bg-background border border-border overflow-hidden"
                style={{ scrollSnapAlign: "center" }}
              >
                <div
                  className="relative w-full overflow-hidden leading-0 bg-surface-muted"
                  style={{ aspectRatio: "4/3" }}
                >
                  {project.cover_image_url || project.thumbnail_url ? (
                    <img
                      src={
                        project.cover_image_url ||
                        project.thumbnail_url ||
                        undefined
                      }
                      alt={project.title}
                      className="block h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                      <span className="font-heading text-5xl text-muted">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-1 px-4 pt-4 pb-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="font-body text-xs font-medium text-accent-secondary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-5 bg-border" />
                    {project.project_type && (
                      <p className="font-body text-[10px] text-primary/80 uppercase tracking-wider">
                        {project.project_type}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className="font-heading text-base text-primary sm:text-lg">
                      {renderTextWithAmpersand(project.title)}
                    </h2>

                    {project.short_description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-secondary line-clamp-2 sm:text-sm">
                        {project.short_description}
                      </p>
                    )}

                    {project.tech_stack_summary && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tech_stack_summary.split(",").map((tech) => (
                          <span
                            key={tech.trim()}
                            className="rounded-full bg-accent-secondary/10 px-2 py-0.5 font-body text-[10px] text-accent-secondary"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-accent-secondary">
                    <span>View case study</span>
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 pb-8">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`cursor-pointer rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "h-2 w-5 bg-accent-secondary"
                    : "h-2 w-2 bg-border hover:bg-muted"
                }`}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
