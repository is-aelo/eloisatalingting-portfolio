"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
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

const CARD_HEIGHT = "clamp(320px, 60vh, 600px)";

export function ProjectCardStack({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

    const borderColor = hexToRgba(getCSSVariable("--border"), 0.3);
    cards.forEach((card) => {
      const inner = card.querySelector<HTMLElement>("[data-card-inner]");
      if (inner) {
        gsap.set(inner, {
          borderColor: borderColor,
          boxShadow: "none",
        });
      }
    });

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
                const maxScale = 1 - (depth - 1) * (1 - CARD_SCALE_BURIED) / (cards.length - 1);
                const targetScale = maxScale - eased * (1 - CARD_SCALE_BURIED) / (cards.length - 1);
                const targetY = -(depth - 1) * CARD_PEEK - eased * CARD_PEEK;

                gsap.set(cards[j], {
                  scale: Math.max(targetScale, CARD_SCALE_BURIED),
                  y: targetY,
                });

                const buriedInner = cards[j].querySelector<HTMLElement>("[data-card-inner]");
                if (buriedInner) {
                  gsap.to(buriedInner, {
                    borderColor: hexToRgba(getCSSVariable("--border"), 0.3),
                    boxShadow: "none",
                    duration: 0.3,
                    ease: "power2.out",
                  });
                }
              }

              const activeInner = card.querySelector<HTMLElement>("[data-card-inner]");
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
          const firstInner = card.querySelector<HTMLElement>("[data-card-inner]");
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

        if (newIndex !== lastIndex && newIndex >= 0 && newIndex < cardEls.length) {
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

  const scrollToCard = useCallback((index: number) => {
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
  }, []);

  if (!projects.length) return null;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative pb-16 md:pb-24"
      style={!isMobile ? { height: `${projects.length * 120}vh` } : undefined}
    >
      {isMobile && (
        <div
          ref={headerRef}
          className="shrink-0 px-5 pt-6 pb-4"
        >
          <div className="mx-auto flex max-w-6xl items-end justify-between">
            <div>
              <p className="font-body text-[10px] text-primary/80 uppercase tracking-wider">
                Projects
              </p>
              <h2 className="mt-1 font-heading text-xl text-primary">
                Selected Work
              </h2>
            </div>
            <span className="font-heading text-4xl leading-none text-accent-secondary/10">
              {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto px-5 pb-4 scrollbar-hide [-webkit-overflow-scrolling:touch]"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {projects.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="shrink-0 w-[80vw] flex flex-col bg-surface-muted overflow-hidden"
                style={{ scrollSnapAlign: "center" }}
              >
                <div className="relative w-full overflow-hidden leading-0" style={{ aspectRatio: "4/3" }}>
                  {(project.cover_image_url || project.thumbnail_url) ? (
                    <img
                      src={project.cover_image_url || project.thumbnail_url || undefined}
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
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
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

      {!isMobile && (
        <div className="sticky top-16 flex h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden">
          <div ref={headerRef} className="shrink-0 px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4 md:pt-12 md:pb-6">
            <div className="mx-auto flex max-w-6xl items-end justify-between">
              <div>
                <p className="font-body text-[10px] text-primary/80 uppercase tracking-wider md:text-xs">
                  Projects
                </p>
                <h2 className="mt-1 font-heading text-lg text-primary sm:text-xl md:mt-2 md:text-2xl lg:text-3xl">
                  Selected Work
                </h2>
              </div>
              <span className="font-heading text-4xl leading-none text-accent-secondary/10 sm:text-5xl md:text-6xl lg:text-8xl">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="relative min-h-0 flex-1">
            {projects.map((project, i) => (
              <div
                key={project.slug}
                data-card
                className="absolute inset-0 flex items-center justify-center will-change-transform"
                style={{ zIndex: i + 1 }}
              >
                <div
                  className="mx-auto w-full max-w-6xl px-4 sm:px-6"
                  style={{ height: CARD_HEIGHT }}
                >
                  <div
                    data-card-inner
                    className="flex h-full w-full flex-row overflow-hidden rounded-lg border border-transparent bg-surface-muted"
                  >
                    <div className="relative h-full w-3/5 shrink-0 overflow-hidden leading-0">
                      {(project.cover_image_url || project.thumbnail_url) ? (
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

                    <div className="flex h-full w-2/5 shrink-0 flex-col justify-between p-6 sm:p-8 md:p-10">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="font-body text-xs text-accent-secondary">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px w-6 bg-border sm:w-8" />
                        {project.project_type && (
                          <p className="font-body text-[10px] text-primary/80 uppercase tracking-wider sm:text-xs">
                            {project.project_type}
                          </p>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-center">
                        <h2 className="font-heading text-lg text-primary sm:text-xl md:text-2xl leading-snug">
                          {renderTextWithAmpersand(project.title)}
                        </h2>

                        {project.short_description && (
                          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-secondary md:mt-4">
                            {project.short_description}
                          </p>
                        )}

                        {project.tech_stack_summary && (
                          <div className="mt-4 flex flex-wrap gap-1.5 md:mt-6 md:gap-2">
                            {project.tech_stack_summary.split(",").map((tech) => (
                              <span
                                key={tech.trim()}
                                className="rounded-full bg-accent-secondary/10 px-2.5 py-1 font-body text-[10px] text-accent-secondary sm:px-3 sm:py-1 sm:text-xs"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex w-full gap-2 sm:gap-3">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-accent-secondary px-5 py-2.5 font-body text-sm text-white transition-opacity hover:opacity-90 sm:px-6 sm:py-3 sm:text-base md:px-7"
                        >
                          View case study
                        </Link>
                        {project.project_ctas && project.project_ctas.length > 0 && (
                          <a
                            href={project.project_ctas[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 font-body text-xs text-primary transition-colors hover:border-accent-secondary hover:text-accent-secondary sm:px-5 sm:text-sm"
                          >
                            {project.project_ctas[0].label}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}