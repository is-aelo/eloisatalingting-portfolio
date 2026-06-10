"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    if (!section) return;

    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-card]"));
    if (!cards.length) return;

    const CARD_PEEK = 28;
    const CARD_SCALE_BURIED = 1;
    const OVERLAP = 0.72;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const isLast = i === cards.length - 1;

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

              gsap.set(card, {
                y: `${(1 - eased) * 100}vh`,
              });

              for (let j = 0; j < i; j++) {
                const depth = i - j;
                const maxScale = 1 - (depth - 1) * (1 - CARD_SCALE_BURIED) / (cards.length - 1);
                const targetScale = maxScale - eased * (1 - CARD_SCALE_BURIED) / (cards.length - 1);
                const targetY = -(depth - 1) * CARD_PEEK - eased * CARD_PEEK;

                gsap.set(cards[j], {
                  scale: Math.max(targetScale, CARD_SCALE_BURIED),
                  y: targetY,
                });
              }
            },
          });
        }

        if (!isLast) {
          const img = card.querySelector<HTMLElement>("img");
          if (img) {
            ScrollTrigger.create({
              trigger: card,
              start: "top top",
              end: "bottom top",
              scrub: 1.4,
              onUpdate: (self) => {
                gsap.set(img, { yPercent: self.progress * 8 });
              },
            });
          }
        }
      });
    }, section);

    return () => ctx.revert();
  }, [projects]);

  if (!projects.length) return null;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative"
      style={{ height: `${projects.length * 120}vh` }}
    >
      <div className="sticky top-14 flex h-[calc(100dvh-3.5rem)] w-full flex-col gap-6 overflow-hidden md:top-16 md:h-[calc(100dvh-4rem)] md:gap-8">
        <div
          ref={headerRef}
          className="shrink-0 pt-6 md:pt-12"
        >
          <div className="mx-auto flex max-w-6xl items-end justify-between px-6">
            <div>
              <p className="font-body text-[10px] text-muted uppercase tracking-wider md:text-xs">
                Projects
              </p>
              <h2 className="mt-2 font-heading text-2xl text-primary md:text-3xl">
                Selected Work
              </h2>
            </div>
            <span className="font-heading text-6xl font-bold leading-none text-accent-quaternary/10 md:text-8xl">
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
              className="mx-auto w-full max-w-6xl px-4 md:px-6"
              style={{ height: CARD_HEIGHT }}
            >
              <div
                className="flex h-full w-full flex-col overflow-hidden bg-surface rounded-xl border border-border shadow-sm lg:flex-row"
              >
                <div className="relative h-[58%] w-full shrink-0 overflow-hidden lg:hidden">
                  {(project.cover_image_url || project.thumbnail_url) ? (
                    <img
                      src={project.cover_image_url ?? project.thumbnail_url!}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-muted">
                      <span className="font-heading text-6xl text-muted">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative hidden h-full w-3/5 shrink-0 overflow-hidden lg:block">
                  {(project.cover_image_url || project.thumbnail_url) ? (
                    <img
                      src={project.cover_image_url ?? project.thumbnail_url!}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ willChange: "transform" }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface-muted">
                      <span className="font-heading text-6xl text-muted">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex h-[42%] w-full shrink-0 flex-col justify-center overflow-hidden px-5 py-6 lg:h-full lg:w-2/5 lg:p-8">
                  <div className="mt-1 flex items-center gap-3">
                    <span className="font-heading text-xs text-accent-quaternary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-8 bg-border" />
                    {project.project_type && (
                      <p className="font-body text-[10px] text-muted uppercase tracking-wider md:text-xs">
                        {project.project_type}
                      </p>
                    )}
                  </div>

                  <h2 className="mt-3 font-heading text-base text-primary md:text-2xl">
                    {project.title}
                  </h2>

                  {project.short_description && (
                    <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-secondary md:text-base">
                      {project.short_description}
                    </p>
                  )}

                  {project.tech_stack_summary && (
                    <div className="mt-4 flex flex-wrap gap-1.5 md:mt-5 md:gap-2">
                      {project.tech_stack_summary.split(",").map((tech) => (
                        <span
                          key={tech.trim()}
                          className="rounded-full bg-accent-tertiary/10 px-2.5 py-0.5 font-body text-[11px] text-accent-tertiary md:px-3 md:py-1 md:text-xs"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 mb-4 flex w-full gap-3">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-body text-sm text-background transition-opacity hover:opacity-90 lg:flex-initial"
                    >
                      View case study
                    </Link>
                    {project.project_ctas && project.project_ctas.length > 0 && (
                      <a
                        href={project.project_ctas[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-accent px-4 py-2 font-body text-xs text-accent transition-colors hover:bg-accent/10 lg:flex-initial md:px-5 md:py-2.5 md:text-sm"
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
    </section>
  );
}
