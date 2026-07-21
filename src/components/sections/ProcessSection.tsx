"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ProcessStep = {
  id: string;
  step_number: number;
  title: string;
  description: string;
};

type Props = {
  steps: ProcessStep[];
};

export function ProcessSection({ steps }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".process-card");
    if (!cards || cards.length === 0) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        if (isDesktop) {
          const tilt = (Math.random() - 0.5) * 3;
          gsap.set(card, { rotation: tilt, transformOrigin: "50% 100%" });
        }
      });

      gsap.from(cards, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 48,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
      });

      if (isDesktop) {
        cards.forEach((card) => {
          card.addEventListener("mouseenter", () => {
            gsap.to(card, { rotation: 0, duration: 0.4, ease: "power2.out" });
          });
          card.addEventListener("mouseleave", () => {
            const tilt = (Math.random() - 0.5) * 3;
            gsap.to(card, { rotation: tilt, duration: 0.4, ease: "power2.out" });
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  if (steps.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="font-body text-xs text-primary/80 uppercase tracking-wider">Process</p>

        <h2 className="mt-6 font-heading font-bold text-2xl text-primary sm:text-3xl tracking-tight">
          From concept to launch
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="process-card group flex flex-col rounded-xl border border-border bg-surface p-6 md:p-8 transition-colors hover:border-accent-secondary/30 hover:bg-surface-muted"
            >
              <span className="font-heading text-3xl text-accent-tertiary/40 transition-colors group-hover:text-accent">
                {String(step.step_number).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-heading text-lg text-primary">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
